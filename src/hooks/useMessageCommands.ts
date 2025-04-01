
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { updateMessageAfterCommand } from "@/utils/messageUtils";
import { supabase } from "@/integrations/supabase/client";

export const useMessageCommands = (
  conversationId: string | undefined,
  updateMessages: (messageId: string, updatedMessage: any) => void
) => {
  const { toast } = useToast();

  const handleApproveCommand = useCallback(async (messageId: string) => {
    if (!conversationId) return;
    
    try {
      const messageToUpdate = await getMessageById(messageId);
      if (!messageToUpdate || !messageToUpdate.command) return;
      
      const updatedContent = `${messageToUpdate.content}\n\nCommand executed successfully: ${messageToUpdate.command.text}`;
      const updatedMessage = await updateMessageAfterCommand(messageId, updatedContent);
      
      // Update the message in local state immediately
      if (updatedMessage) {
        updateMessages(messageId, updatedMessage);
      }
    } catch (error: any) {
      console.error("Error approving command:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to approve command.",
      });
    }
  }, [conversationId, toast, updateMessages]);

  const handleDeclineCommand = useCallback(async (messageId: string) => {
    if (!conversationId) return;
    
    try {
      const messageToUpdate = await getMessageById(messageId);
      if (!messageToUpdate || !messageToUpdate.command) return;
      
      const updatedContent = `${messageToUpdate.content}\n\nCommand execution cancelled.`;
      const updatedMessage = await updateMessageAfterCommand(messageId, updatedContent);
      
      // Update the message in local state immediately
      if (updatedMessage) {
        updateMessages(messageId, updatedMessage);
      }
    } catch (error: any) {
      console.error("Error declining command:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to decline command.",
      });
    }
  }, [conversationId, toast, updateMessages]);

  // Helper function to get a message by ID
  const getMessageById = useCallback(async (messageId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('id', messageId)
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching message:", error);
      return null;
    }
  }, []);

  return {
    handleApproveCommand,
    handleDeclineCommand
  };
};
