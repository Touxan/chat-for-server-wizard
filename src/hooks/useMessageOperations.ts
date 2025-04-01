
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MessageType } from "@/types/chat";
import { 
  convertToMessageType, 
  fetchMessagesForConversation, 
  sendUserMessage, 
  sendBotResponse, 
  setupMessageListeners 
} from "@/utils/messageUtils";
import { useBotResponseGenerator } from "@/hooks/useBotResponseGenerator";

export const useMessageOperations = (
  conversationId: string | undefined, 
  user: any
) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const { toast } = useToast();
  const { generateBotResponse } = useBotResponseGenerator();

  // Function to fetch messages from a conversation
  const fetchMessages = useCallback(async () => {
    if (!conversationId || !user) return;
    
    setIsLoading(true);
    try {
      const data = await fetchMessagesForConversation(conversationId);
      const convertedMessages = data?.map(convertToMessageType) || [];
      setMessages(convertedMessages);
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
  }, [conversationId, user, toast]);

  // Update a specific message in the local state
  const updateMessageInState = useCallback((messageId: string, updatedMessage: any) => {
    setMessages(prev => 
      prev.map(msg => msg.id === messageId ? convertToMessageType(updatedMessage) : msg)
    );
  }, []);

  // Handle sending a message
  const handleSendMessage = useCallback(async (message: string) => {
    if (!conversationId || !user) return;
    
    try {
      // Add user message to local state immediately for instant feedback
      const tempUserMsgId = `temp-${Date.now()}`;
      const tempUserMsg: MessageType = {
        id: tempUserMsgId,
        content: message,
        isUser: true,
        timestamp: new Date().toLocaleTimeString(),
      };
      
      setMessages(prev => [...prev, tempUserMsg]);
      
      // Actually add user message to the database
      const userMessage = await sendUserMessage(conversationId, message);
      
      // Show bot typing indicator
      setIsBotTyping(true);
      
      // Get bot response from the API
      const { botContent, command } = await generateBotResponse(message);
      
      // Add bot response to the database and update local state
      const botMessage = await sendBotResponse(conversationId, botContent, command);
      
      // Update local state with the bot response
      if (botMessage) {
        const botMessageConverted = convertToMessageType(botMessage);
        setMessages(prev => [
          ...prev.filter(msg => msg.id !== tempUserMsgId), // Remove temp user message
          convertToMessageType(userMessage), // Add real user message
          botMessageConverted // Add bot response
        ]);
      }
      
      // Hide bot typing indicator when response is received
      setIsBotTyping(false);
    } catch (error: any) {
      console.error("Error sending message:", error);
      setIsBotTyping(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to send message.",
      });
    }
  }, [conversationId, user, generateBotResponse, toast]);

  // Setup listeners for message events
  const setupListeners = useCallback(() => {
    if (!conversationId) return null;
    
    const messageChannel = setupMessageListeners(conversationId, fetchMessages);

    return () => {
      if (messageChannel) supabase.removeChannel(messageChannel);
    };
  }, [conversationId, fetchMessages]);

  return {
    messages,
    isLoading,
    isBotTyping,
    fetchMessages,
    handleSendMessage,
    updateMessageInState,
    setupListeners
  };
};
