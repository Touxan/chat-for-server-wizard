
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/integrations/supabase/schema";
import { MessageType } from "@/types/chat";
import { Json } from "@/integrations/supabase/types";

/**
 * Safely parse command from Json to the expected format
 */
export const parseCommand = (commandJson: Json | null): MessageType['command'] | undefined => {
  if (!commandJson) return undefined;
  
  // If commandJson is already an object with the required properties, return it
  if (
    typeof commandJson === 'object' && 
    commandJson !== null &&
    'text' in commandJson && 
    'description' in commandJson && 
    'risk' in commandJson
  ) {
    const { text, description, risk } = commandJson as any;
    
    // Validate risk value
    if (risk === 'low' || risk === 'medium' || risk === 'high') {
      return {
        text: String(text),
        description: String(description),
        risk: risk as 'low' | 'medium' | 'high'
      };
    }
  }
  
  // If commandJson doesn't match the expected format, return undefined
  console.warn('Invalid command format:', commandJson);
  return undefined;
};

/**
 * Convert Supabase messages to MessageType format
 */
export const convertToMessageType = (message: any): MessageType => ({
  id: message.id,
  content: message.content,
  isUser: message.is_user,
  timestamp: new Date(message.timestamp).toLocaleTimeString(),
  command: parseCommand(message.command)
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
  
  // Ensure command is in the correct format if provided
  const formattedCommand = command ? {
    text: String(command.text || ''),
    description: String(command.description || ''),
    risk: (command.risk === 'low' || command.risk === 'medium' || command.risk === 'high') 
      ? command.risk 
      : 'medium'
  } : null;
  
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        content,
        is_user: false,
        command: formattedCommand,
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
