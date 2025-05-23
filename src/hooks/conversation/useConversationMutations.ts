
import { supabase } from '@/integrations/supabase/client';
import { Conversation } from '@/integrations/supabase/schema';
import { useToast } from '@/hooks/use-toast';

export const useConversationMutations = (user: any, setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>) => {
  const { toast } = useToast();

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
  
  // Function to delete a conversation - updated to directly use Supabase
  const deleteConversation = async (id: string) => {
    if (!user || !id) return false;
    
    console.log(`Starting deletion of conversation ${id} using Supabase`);
    
    try {
      // First, delete related messages
      const { error: messagesError } = await supabase
        .from('messages')
        .delete()
        .eq('conversation_id', id);
      
      if (messagesError) {
        console.error('Error deleting messages:', messagesError);
        throw messagesError;
      }
      
      // Then, delete the conversation
      const { error: conversationError } = await supabase
        .from('conversations')
        .delete()
        .eq('id', id);
      
      if (conversationError) {
        console.error('Error deleting conversation:', conversationError);
        throw conversationError;
      }
      
      console.log('Successfully deleted conversation with Supabase:', id);
      
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
        description: error.message || 'Unable to delete the conversation.',
      });
      return false;
    }
  };

  return {
    addConversation,
    renameConversation,
    deleteConversation
  };
};
