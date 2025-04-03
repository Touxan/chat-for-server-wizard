
import { useEffect, useCallback } from 'react';
import { Conversation } from '@/integrations/supabase/schema';
import { useAuth } from '@/contexts/AuthContext';

import { useFetchConversations } from './conversation/useFetchConversations';
import { useConversationMutations } from './conversation/useConversationMutations';
import { useGroupConversations, GroupedConversations } from './conversation/useGroupConversations';
import { useConversationRealtime } from './conversation/useConversationRealtime';

export type { GroupedConversations };

export const useConversations = () => {
  const { user } = useAuth();
  
  const { 
    conversations, 
    setConversations, 
    isLoading, 
    fetchConversations 
  } = useFetchConversations(user);
  
  const { 
    addConversation, 
    renameConversation, 
    deleteConversation 
  } = useConversationMutations(user, setConversations);
  
  const { 
    groupedConversations 
  } = useGroupConversations(conversations);
  
  // Initialize real-time subscription
  useConversationRealtime(user, fetchConversations);

  // Memoized effect to load conversations at mount
  const loadConversations = useCallback(() => {
    if (user) {
      console.log("Loading conversations for user:", user.id);
      fetchConversations();
    } else {
      console.log("No user, clearing conversations");
      setConversations([]);
    }
  }, [user, fetchConversations, setConversations]);

  // Effect to load conversations when user changes
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return {
    conversations,
    groupedConversations,
    isLoading,
    fetchConversations,
    addConversation,
    renameConversation,
    deleteConversation,
  };
};
