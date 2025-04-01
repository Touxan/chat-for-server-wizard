
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MessageType } from "@/types/chat";
import { useToast } from "@/hooks/use-toast";
import { Json } from "@/integrations/supabase/types";

export const useMessageCommands = (
  conversationId?: string,
  updateMessageInState?: (messageId: string, updatedFields: Partial<MessageType>) => void
) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { toast } = useToast();

  // Handle approval of command
  const handleApproveCommand = useCallback(async (messageId: string) => {
    if (!conversationId || !messageId || isProcessing) return;
    setIsProcessing(true);
    
    try {
      // Get the current message to obtain the command
      const { data: messageData, error: messageError } = await supabase
        .from("messages")
        .select("*")
        .eq("id", messageId)
        .eq("conversation_id", conversationId)
        .single();
      
      if (messageError || !messageData) throw new Error("Failed to fetch message data");
      
      // Extract command details
      const command = messageData.command;
      
      // Type guard to check if command is a properly structured object
      const isValidCommandObject = (cmd: any): cmd is { text: string; description: string; risk: string } => {
        return cmd !== null && 
               typeof cmd === 'object' && 
               'text' in cmd && 
               typeof cmd.text === 'string';
      };
      
      if (!command || !isValidCommandObject(command)) {
        throw new Error("Invalid command format");
      }
      
      const commandText = command.text;
      
      // Update message to show command is being executed
      if (updateMessageInState) {
        updateMessageInState(messageId, {
          content: `Executing command: ${commandText}...`,
        });
      }
      
      // Make API call to execute the command
      const { data: executeData, error: executeError } = await supabase.functions.invoke(
        "execute-command",
        {
          body: {
            command: commandText,
            messageId,
            conversationId,
          },
        }
      );
      
      if (executeError) throw executeError;
      
      // Remove command from message as it's been processed
      const { error: updateError } = await supabase
        .from("messages")
        .update({ 
          command: null,
          updated_at: new Date().toISOString()
        })
        .eq("id", messageId);
      
      if (updateError) throw updateError;
      
      // Show success notification
      toast({
        title: "Command executed",
        description: "The command was successfully executed.",
      });
      
      if (updateMessageInState) {
        updateMessageInState(messageId, {
          command: null
        });
      }
      
    } catch (error: any) {
      console.error("Error executing command:", error);
      toast({
        variant: "destructive",
        title: "Command execution failed",
        description: error.message || "An error occurred while executing the command.",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [conversationId, isProcessing, toast, updateMessageInState]);

  // Handle decline of command
  const handleDeclineCommand = useCallback(async (messageId: string) => {
    if (!conversationId || !messageId || isProcessing) return;
    setIsProcessing(true);
    
    try {
      // Update the message to remove the command
      const { error: updateError } = await supabase
        .from("messages")
        .update({ 
          command: null,
          updated_at: new Date().toISOString()
        })
        .eq("id", messageId);
      
      if (updateError) throw updateError;
      
      if (updateMessageInState) {
        updateMessageInState(messageId, {
          command: null
        });
      }
      
      toast({
        title: "Command declined",
        description: "The command was declined and will not be executed.",
      });
    } catch (error: any) {
      console.error("Error declining command:", error);
      toast({
        variant: "destructive",
        title: "Failed to decline command",
        description: error.message || "An error occurred while declining the command.",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [conversationId, isProcessing, toast, updateMessageInState]);

  return {
    handleApproveCommand,
    handleDeclineCommand,
    isProcessing,
  };
};

