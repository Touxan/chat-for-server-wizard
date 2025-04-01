
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useConversationRealtime = (user: any, fetchConversations: () => Promise<void>) => {
  // Listen for real-time updates to conversations
  useEffect(() => {
    if (!user) return;
    
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Real-time conversation update:', payload);
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchConversations]);
};
