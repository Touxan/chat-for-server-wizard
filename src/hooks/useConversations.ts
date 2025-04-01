
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
  
  // Function to rename a conversation
  const renameConversation = async (id: string, newTitle: string) => {
    if (!user || !id || !newTitle.trim()) return false;
    
    try {
      console.log(`Attempting to rename conversation ${id} to "${newTitle}"`);
      
      const { data, error } = await supabase
        .from('conversations')
        .update({ title: newTitle })
        .eq('id', id)
        .select();
        
      if (error) {
        console.error('Error renaming conversation:', error);
        throw error;
      }
      
      console.log('Renamed conversation:', data);
      
      // Update local state
      setConversations(prev => 
        prev.map(conv => conv.id === id ? { ...conv, title: newTitle } : conv)
      );
      
      toast({
        title: "Renamed",
        description: "Conversation has been renamed."
      });
      
      return true;
    } catch (error: any) {
      console.error('Error renaming conversation:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Unable to rename the conversation.',
      });
      return false;
    }
  };
  
  // Function to delete a conversation - Fixed with proper error handling and transaction approach
  const deleteConversation = async (id: string) => {
    if (!user || !id) return false;
    
    try {
      console.log(`Attempting to delete conversation with ID: ${id}`);
      
      // First check if conversation exists and belongs to user
      const { data: conversationData, error: checkError } = await supabase
        .from('conversations')
        .select('id')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();
      
      if (checkError) {
        console.error('Error checking conversation:', checkError);
        throw checkError;
      }
      
      if (!conversationData) {
        console.error(`Conversation ${id} not found or doesn't belong to user ${user.id}`);
        throw new Error("Conversation not found");
      }
      
      // Delete all messages associated with the conversation first
      const { error: messagesError } = await supabase
        .from('messages')
        .delete()
        .eq('conversation_id', id);
      
      if (messagesError) {
        console.error('Error deleting messages:', messagesError);
        throw messagesError;
      }
      
      console.log(`Deleted messages for conversation ${id}`);
      
      // Then delete the conversation itself
      const { error: conversationError } = await supabase
        .from('conversations')
        .delete()
        .eq('id', id);
        
      if (conversationError) {
        console.error('Error deleting conversation:', conversationError);
        throw conversationError;
      }
      
      console.log('Deleted conversation with ID:', id);
      
      // Update local state by filtering out the deleted conversation
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
    renameConversation,
    deleteConversation,
  };
};
