import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export const useConversationRealtime = (user: any, fetchConversations: () => Promise<void>) => {
  // Keep track of the channel to properly clean it up
  const channelRef = useRef<RealtimeChannel | null>(null);
  
  // Listen for real-time updates to conversations
  useEffect(() => {
    if (!user) return;
    
    // Clean up previous channel if it exists
    if (channelRef.current) {
      console.log('Cleaning up previous channel before creating a new one');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    
    // Create a new channel
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
    
    // Store the channel reference
    channelRef.current = channel;

    // Clean up the channel on unmount
    return () => {
      console.log('Cleaning up conversation realtime channel');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [user, fetchConversations]);
};
