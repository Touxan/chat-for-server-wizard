
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useConversationOperations } from "@/hooks/useConversationOperations";
import { useMessageOperations } from "@/hooks/useMessageOperations";
import { useMessageCommands } from "@/hooks/useMessageCommands";

export const useChatMessagesWithSupabase = (conversationId?: string) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { validateConversation, setupListeners: setupConversationListeners } = useConversationOperations();
  
  const { 
    messages, 
    isLoading, 
    isBotTyping, 
    fetchMessages, 
    handleSendMessage, 
    updateMessageInState,
    setupListeners: setupMessageListeners
  } = useMessageOperations(conversationId, user);
  
  const { 
    handleApproveCommand, 
    handleDeclineCommand 
  } = useMessageCommands(conversationId, updateMessageInState);

  // Effect to load messages on mount or conversation change
  useEffect(() => {
    if (conversationId && user) {
      // First validate that the conversation exists
      validateConversation(conversationId).then(exists => {
        if (exists) {
          fetchMessages();
        }
      });
    }
  }, [conversationId, user, validateConversation, fetchMessages]);

  // Listen for real-time updates to messages and conversations
  useEffect(() => {
    if (!conversationId || !user) return;
    
    // Setup message listeners
    const removeMessageListeners = setupMessageListeners();
    
    // Setup conversation listeners
    const removeConversationListeners = setupConversationListeners(
      conversationId, 
      fetchMessages,
      () => navigate('/chat')
    );

    return () => {
      if (removeMessageListeners) removeMessageListeners();
      if (removeConversationListeners) removeConversationListeners();
    };
  }, [
    conversationId, 
    user, 
    navigate, 
    fetchMessages, 
    setupMessageListeners, 
    setupConversationListeners
  ]);

  return {
    messages,
    isLoading,
    isBotTyping,
    handleSendMessage,
    handleApproveCommand,
    handleDeclineCommand,
  };
};
