
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { checkConversationExists, setupConversationListeners } from "@/utils/conversationUtils";
import { supabase } from "@/integrations/supabase/client";

export const useConversationOperations = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Function to validate if a conversation exists
  const validateConversation = useCallback(async (conversationId: string) => {
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
        return false;
      }
      
      return true;
    } catch (error: any) {
      console.error("Error validating conversation:", error);
      return false;
    }
  }, [navigate, toast]);

  // Setup listeners for conversation events
  const setupListeners = useCallback((
    conversationId: string,
    onUpdate: () => void,
    onDelete: () => void
  ) => {
    if (!conversationId) return null;
    
    const conversationsChannel = setupConversationListeners(
      conversationId,
      onUpdate,
      () => {
        toast({
          variant: "destructive",
          title: "Conversation Deleted",
          description: "This conversation has been deleted.",
        });
        onDelete();
      }
    );

    return () => {
      if (conversationsChannel) supabase.removeChannel(conversationsChannel);
    };
  }, [toast]);

  return {
    validateConversation,
    setupListeners
  };
};
