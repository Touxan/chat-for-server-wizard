
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { MessageType } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";
import { checkConversationExists, setupConversationListeners } from "@/utils/conversationUtils";
import { 
  convertToMessageType, 
  fetchMessagesForConversation, 
  sendUserMessage, 
  sendBotResponse, 
  updateMessageAfterCommand, 
  setupMessageListeners 
} from "@/utils/messageUtils";
import { useBotResponseGenerator } from "@/hooks/useBotResponseGenerator";

export const useChatMessagesWithSupabase = (conversationId?: string) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { generateBotResponse } = useBotResponseGenerator();

  // Function to fetch messages from a conversation
  const fetchMessages = async () => {
    if (!conversationId || !user) return;
    
    setIsLoading(true);
    try {
      // First check if the conversation exists
      const conversationExists = await checkConversationExists(conversationId);
      
      // If conversation doesn't exist, redirect to main chat page
      if (!conversationExists) {
        console.log(`Conversation ${conversationId} does not exist, redirecting to /chat`);
        toast({
          variant: "destructive",
          title: "Conversation Not Found",
          description: "This conversation no longer exists.",
        });
        navigate('/chat');
        return;
      }
      
      const data = await fetchMessagesForConversation(conversationId);

      const convertedMessages = data?.map(convertToMessageType) || [];
      setMessages(convertedMessages.length > 0 ? convertedMessages : [
        {
          id: "welcome",
          content: "Hello! I'm your Server Wizard assistant for Scaleway. I can help you manage your servers by creating and executing commands with your approval. How can I help you today?",
          isUser: false,
          timestamp: "Just now",
        },
      ]);
    } catch (error: any) {
      console.error("Error fetching messages:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to retrieve messages.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!conversationId || !user) return;
    
    try {
      // Add user message
      await sendUserMessage(conversationId, message);
      
      // Simulate bot response
      setTimeout(async () => {
        const { botContent, command } = generateBotResponse(message);
        await sendBotResponse(conversationId, botContent, command);
      }, 1000);
      
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to send message.",
      });
    }
  };

  const handleApproveCommand = async (messageId: string) => {
    if (!conversationId || !user) return;
    
    try {
      const messageToUpdate = messages.find(msg => msg.id === messageId);
      if (!messageToUpdate || !messageToUpdate.command) return;
      
      const updatedContent = `${messageToUpdate.content}\n\nCommand executed successfully: ${messageToUpdate.command.text}`;
      await updateMessageAfterCommand(messageId, updatedContent);
    } catch (error: any) {
      console.error("Error approving command:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to approve command.",
      });
    }
  };

  const handleDeclineCommand = async (messageId: string) => {
    if (!conversationId || !user) return;
    
    try {
      const messageToUpdate = messages.find(msg => msg.id === messageId);
      if (!messageToUpdate || !messageToUpdate.command) return;
      
      const updatedContent = `${messageToUpdate.content}\n\nCommand execution cancelled.`;
      await updateMessageAfterCommand(messageId, updatedContent);
    } catch (error: any) {
      console.error("Error declining command:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to decline command.",
      });
    }
  };

  // Effect to load messages on mount or conversation change
  useEffect(() => {
    if (conversationId && user) {
      fetchMessages();
    }
  }, [conversationId, user]);

  // Listen for real-time updates to messages
  useEffect(() => {
    if (!conversationId || !user) return;
    
    const messageChannel = setupMessageListeners(conversationId, fetchMessages);
    
    const conversationsChannel = setupConversationListeners(
      conversationId,
      fetchMessages,
      () => {
        toast({
          variant: "destructive",
          title: "Conversation Deleted",
          description: "This conversation has been deleted.",
        });
        navigate('/chat');
      }
    );

    return () => {
      if (messageChannel) supabase.removeChannel(messageChannel);
      if (conversationsChannel) supabase.removeChannel(conversationsChannel);
    };
  }, [conversationId, user, navigate]);

  return {
    messages,
    isLoading,
    handleSendMessage,
    handleApproveCommand,
    handleDeclineCommand,
  };
};
