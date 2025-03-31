
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

  // Fonction pour récupérer les conversations
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
        title: 'Erreur',
        description: 'Impossible de récupérer les conversations.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour ajouter une nouvelle conversation
  const addConversation = async (title: string) => {
    if (!user) return null;
    
    try {
      const newConversation = {
        user_id: user.id,
        title,
        category: 'Today', // Par défaut
      };

      const { data, error } = await supabase
        .from('conversations')
        .insert(newConversation)
        .select()
        .single();

      if (error) throw error;

      // Mise à jour de l'état local
      setConversations(prev => [data as Conversation, ...prev]);
      return data as Conversation;
    } catch (error: any) {
      console.error('Error adding conversation:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de créer une nouvelle conversation.',
      });
      return null;
    }
  };

  // Effet pour regrouper les conversations par catégorie
  useEffect(() => {
    const grouped: { [key: string]: Conversation[] } = {};
    
    conversations.forEach(convo => {
      const category = convo.category || 'Older';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(convo);
    });

    // Définir l'ordre des catégories
    const categoryOrder = ['Today', 'Yesterday', 'Last Week', 'Older'];
    const result = categoryOrder
      .filter(cat => grouped[cat] && grouped[cat].length > 0)
      .map(cat => ({
        title: cat,
        chats: grouped[cat],
      }));

    setGroupedConversations(result);
  }, [conversations]);

  // Effet pour charger les conversations au montage
  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  // Écouter les mises à jour en temps réel des conversations
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
  };
};
