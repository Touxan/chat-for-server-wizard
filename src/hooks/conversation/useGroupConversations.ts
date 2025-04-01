
import { useState, useEffect } from 'react';
import { Conversation } from '@/integrations/supabase/schema';

export type GroupedConversations = {
  title: string;
  chats: Conversation[];
};

export const useGroupConversations = (conversations: Conversation[]) => {
  const [groupedConversations, setGroupedConversations] = useState<GroupedConversations[]>([]);

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

  return {
    groupedConversations
  };
};
