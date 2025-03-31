
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/integrations/supabase/schema";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { MessageType } from "@/types/chat";

export const useChatMessagesWithSupabase = (conversationId?: string) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Function to convert Supabase messages to MessageType format
  const convertToMessageType = (message: Message): MessageType => ({
    id: message.id,
    content: message.content,
    isUser: message.is_user,
    timestamp: new Date(message.timestamp).toLocaleTimeString(),
    command: message.command,
  });

  // Function to fetch messages from a conversation
  const fetchMessages = async () => {
    if (!conversationId || !user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('timestamp', { ascending: true });

      if (error) throw error;

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
      const { data: userMessageData, error: userMessageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          content: message,
          is_user: true,
        })
        .select()
        .single();

      if (userMessageError) throw userMessageError;
      
      // Simulate bot response (in a real app, this would be handled by an API or backend function)
      setTimeout(async () => {
        let botContent = "";
        let command = null;
        
        if (message.toLowerCase().includes("restart") || message.toLowerCase().includes("redémarrer")) {
          botContent = "I can help you restart your server. Here's the command I recommend:";
          command = {
            text: "sudo systemctl restart nginx",
            description: "This command will restart the NGINX web server without affecting other services.",
            risk: "low" as const,
          };
        } else if (message.toLowerCase().includes("update") || message.toLowerCase().includes("mise à jour")) {
          botContent = "I can help you update your system. Here's the recommended command:";
          command = {
            text: "sudo apt update && sudo apt upgrade -y",
            description: "This command will update the package list and upgrade all installed packages to their latest versions.",
            risk: "medium" as const,
          };
        } else if (message.toLowerCase().includes("delete") || message.toLowerCase().includes("supprimer")) {
          botContent = "I understand that you want to delete something. Please be careful with this command:";
          command = {
            text: "sudo rm -rf /var/log/old_logs/",
            description: "This command will recursively delete all files in the old_logs directory. Make sure you no longer need these files.",
            risk: "high" as const,
          };
        } else {
          botContent = "I'm analyzing your request. Could you provide more details about what you'd like to do with your Scaleway servers?";
        }
        
        const { error: botMessageError } = await supabase
          .from('messages')
          .insert({
            conversation_id: conversationId,
            content: botContent,
            is_user: false,
            command: command,
          });

        if (botMessageError) throw botMessageError;
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
      
      const { error } = await supabase
        .from('messages')
        .update({
          content: `${messageToUpdate.content}\n\nCommand executed successfully: ${messageToUpdate.command.text}`,
          command: null,
        })
        .eq('id', messageId);

      if (error) throw error;
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
      
      const { error } = await supabase
        .from('messages')
        .update({
          content: `${messageToUpdate.content}\n\nCommand execution cancelled.`,
          command: null,
        })
        .eq('id', messageId);

      if (error) throw error;
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
    
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, user]);

  return {
    messages,
    isLoading,
    handleSendMessage,
    handleApproveCommand,
    handleDeclineCommand,
  };
};
