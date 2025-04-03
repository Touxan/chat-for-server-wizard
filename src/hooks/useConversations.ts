
import { useEffect } from 'react';
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

  // Effect to load conversations at mount
  useEffect(() => {
    if (user) {
      fetchConversations();
    } else {
      setConversations([]);
    }
  }, [user, fetchConversations, setConversations]);

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
