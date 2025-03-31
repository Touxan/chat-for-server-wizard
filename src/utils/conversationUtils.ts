
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/**
 * Check if a conversation exists in the database
 */
export const checkConversationExists = async (conversationId: string): Promise<boolean> => {
  if (!conversationId) return false;
  
  try {
    console.log(`Checking if conversation ${conversationId} exists`);
    const { data, error } = await supabase
      .from('conversations')
      .select('id')
      .eq('id', conversationId)
      .maybeSingle();
      
    if (error) {
      console.error('Error checking conversation existence:', error);
      throw error;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error checking conversation:', error);
    return false;
  }
};

/**
 * Set up real-time listeners for conversation changes
 */
export const setupConversationListeners = (
  conversationId: string,
  callback: () => void,
  onDeleteCallback: () => void
) => {
  if (!conversationId) return null;
  
  // Listen for changes to the conversations table to detect deletions
  const conversationsChannel = supabase
    .channel('conversations-changes')
    .on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'conversations',
        filter: `id=eq.${conversationId}`,
      },
      (payload) => {
        console.log('Conversation deleted:', payload);
        onDeleteCallback();
      }
    )
    .subscribe();

  return conversationsChannel;
};
