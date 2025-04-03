
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Conversation } from '@/integrations/supabase/schema';
import { useToast } from '@/hooks/use-toast';

export const useFetchConversations = (user: any) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Function to fetch conversations
  const fetchConversations = useCallback(async () => {
    if (!user) {
      setConversations([]);
      return;
    }
    
    setIsLoading(true);
    try {
      console.log(`Fetching conversations for user: ${user.id}`);
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching conversations:', error);
        throw error;
      }

      console.log(`Fetched ${data?.length || 0} conversations`);
      setConversations(data || []);
    } catch (error: any) {
      console.error('Error fetching conversations:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Unable to retrieve conversations.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  return {
    conversations,
    setConversations,
    isLoading,
    fetchConversations
  };
};
