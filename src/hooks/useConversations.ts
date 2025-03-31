
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Conversation } from '@/integrations/supabase/schema';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export type GroupedConversations = {
  title: string;
  chats: Conversation[];
};

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [groupedConversations, setGroupedConversations] = useState<GroupedConversations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Function to fetch conversations
  const fetchConversations = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

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
  };

  // Function to add a new conversation
  const addConversation = async (title: string) => {
    if (!user) return null;
    
    try {
      const newConversation = {
        user_id: user.id,
        title,
        category: 'Today', // Default
      };

      const { data, error } = await supabase
        .from('conversations')
        .insert(newConversation)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setConversations(prev => [data as Conversation, ...prev]);
      return data as Conversation;
    } catch (error: any) {
      console.error('Error adding conversation:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Unable to create a new conversation.',
      });
      return null;
    }
  };
  
  // Function to delete a conversation
  const deleteConversation = async (id: string) => {
    if (!user) return false;
    
    try {
      console.log(`Attempting to delete conversation with ID: ${id}`);
      
      // Delete messages associated with the conversation first
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .delete()
        .eq('conversation_id', id)
        .select();
      
      if (messagesError) {
        console.error('Error deleting messages:', messagesError);
        throw messagesError;
      }
      
      console.log(`Deleted ${messagesData?.length || 0} messages`);
      
      // Then delete the conversation
      const { data: conversationData, error: conversationError } = await supabase
        .from('conversations')
        .delete()
        .eq('id', id)
        .select();
        
      if (conversationError) {
        console.error('Error deleting conversation:', conversationError);
        throw conversationError;
      }
      
      console.log('Deleted conversation:', conversationData);
      
      // Update local state
      setConversations(prev => prev.filter(conv => conv.id !== id));
      
      toast({
        title: "Deleted",
        description: "Conversation has been deleted."
      });
      
      return true;
    } catch (error: any) {
      console.error('Error deleting conversation:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Unable to delete the conversation.',
      });
      return false;
    }
  };

  // Effect to group conversations by category
  useEffect(() => {
    const grouped: { [key: string]: Conversation[] } = {};
    
    conversations.forEach(convo => {
      const category = convo.category || 'Older';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(convo);
    });

    // Define order of categories
    const categoryOrder = ['Today', 'Yesterday', 'Last Week', 'Older'];
    const result = categoryOrder
      .filter(cat => grouped[cat] && grouped[cat].length > 0)
      .map(cat => ({
        title: cat,
        chats: grouped[cat],
      }));

    setGroupedConversations(result);
  }, [conversations]);

  // Effect to load conversations at mount
  useEffect(() => {
    if (user) {
      fetchConversations();
    } else {
      setConversations([]);
      setGroupedConversations([]);
    }
  }, [user]);

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
  }, [user]);

  return {
    conversations,
    groupedConversations,
    isLoading,
    fetchConversations,
    addConversation,
    deleteConversation,
  };
};
