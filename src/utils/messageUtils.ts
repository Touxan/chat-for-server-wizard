
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/integrations/supabase/schema";
import { MessageType } from "@/types/chat";

/**
 * Convert Supabase messages to MessageType format
 */
export const convertToMessageType = (message: Message): MessageType => ({
  id: message.id,
  content: message.content,
  isUser: message.is_user,
  timestamp: new Date(message.timestamp).toLocaleTimeString(),
  command: message.command,
});

/**
 * Fetch messages for a conversation
 */
export const fetchMessagesForConversation = async (conversationId: string) => {
  if (!conversationId) return [];
  
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('timestamp', { ascending: true });

    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

/**
 * Send a user message to a conversation
 */
export const sendUserMessage = async (conversationId: string, content: string) => {
  if (!conversationId) return null;
  
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        content,
        is_user: true,
      })
      .select()
      .single();

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

/**
 * Send a bot response to a conversation
 */
export const sendBotResponse = async (conversationId: string, content: string, command: any = null) => {
  if (!conversationId) return null;
  
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        content,
        is_user: false,
        command,
      })
      .select()
      .single();

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error sending bot response:", error);
    throw error;
  }
};

/**
 * Update a message after a command action (approve/decline)
 */
export const updateMessageAfterCommand = async (messageId: string, content: string) => {
  if (!messageId) return null;
  
  try {
    const { data, error } = await supabase
      .from('messages')
      .update({
        content,
        command: null,
      })
      .eq('id', messageId)
      .select()
      .single();

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error updating message:", error);
    throw error;
  }
};

/**
 * Set up real-time listeners for message changes
 */
export const setupMessageListeners = (conversationId: string, callback: () => void) => {
  if (!conversationId) return null;
  
  const channel = supabase
    .channel('schema-db-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        console.log('Real-time message update:', payload);
        callback();
      }
    )
    .subscribe();

  return channel;
};
