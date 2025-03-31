
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/integrations/supabase/schema";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { MessageType } from "@/types/chat";

export const useChatMessagesWithSupabase = (conversationId?: string) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fonction pour convertir les messages de Supabase en format MessageType
  const convertToMessageType = (message: Message): MessageType => ({
    id: message.id,
    content: message.content,
    isUser: message.is_user,
    timestamp: new Date(message.timestamp).toLocaleTimeString(),
    command: message.command,
  });

  // Fonction pour récupérer les messages d'une conversation
  const fetchMessages = async () => {
    if (!conversationId || !user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('timestamp', { ascending: true });

      if (error) throw error;

      const convertedMessages = data?.map(convertToMessageType) || [];
      setMessages(convertedMessages.length > 0 ? convertedMessages : [
        {
          id: "welcome",
          content: "Bonjour ! Je suis votre assistant Server Wizard pour Scaleway. Je peux vous aider à gérer vos serveurs en créant et exécutant des commandes avec votre approbation. Comment puis-je vous aider aujourd'hui ?",
          isUser: false,
          timestamp: "À l'instant",
        },
      ]);
    } catch (error: any) {
      console.error("Error fetching messages:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les messages.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!conversationId || !user) return;
    
    try {
      // Ajouter le message de l'utilisateur
      const { data: userMessageData, error: userMessageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          content: message,
          is_user: true,
        })
        .select()
        .single();

      if (userMessageError) throw userMessageError;
      
      // Simuler la réponse du bot (dans une application réelle, ceci serait géré par une API ou une fonction backend)
      setTimeout(async () => {
        let botContent = "";
        let command = null;
        
        if (message.toLowerCase().includes("restart") || message.toLowerCase().includes("redémarrer")) {
          botContent = "Je peux vous aider à redémarrer votre serveur. Voici la commande que je recommande :";
          command = {
            text: "sudo systemctl restart nginx",
            description: "Cette commande redémarrera le serveur web NGINX sans affecter les autres services.",
            risk: "low" as const,
          };
        } else if (message.toLowerCase().includes("update") || message.toLowerCase().includes("mise à jour")) {
          botContent = "Je peux vous aider à mettre à jour votre système. Voici la commande recommandée :";
          command = {
            text: "sudo apt update && sudo apt upgrade -y",
            description: "Cette commande mettra à jour la liste des paquets et mettra à niveau tous les paquets installés vers leurs dernières versions.",
            risk: "medium" as const,
          };
        } else if (message.toLowerCase().includes("delete") || message.toLowerCase().includes("supprimer")) {
          botContent = "Je comprends que vous souhaitez supprimer quelque chose. Veuillez être prudent avec cette commande :";
          command = {
            text: "sudo rm -rf /var/log/old_logs/",
            description: "Cette commande supprimera récursivement tous les fichiers dans le répertoire old_logs. Assurez-vous que vous n'avez plus besoin de ces fichiers.",
            risk: "high" as const,
          };
        } else {
          botContent = "J'analyse votre demande. Pourriez-vous fournir plus de détails sur ce que vous souhaitez faire avec vos serveurs Scaleway ?";
        }
        
        const { error: botMessageError } = await supabase
          .from('messages')
          .insert({
            conversation_id: conversationId,
            content: botContent,
            is_user: false,
            command: command,
          });

        if (botMessageError) throw botMessageError;
      }, 1000);
      
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer le message.",
      });
    }
  };

  const handleApproveCommand = async (messageId: string) => {
    if (!conversationId || !user) return;
    
    try {
      const messageToUpdate = messages.find(msg => msg.id === messageId);
      if (!messageToUpdate || !messageToUpdate.command) return;
      
      const { error } = await supabase
        .from('messages')
        .update({
          content: `${messageToUpdate.content}\n\nCommande exécutée avec succès: ${messageToUpdate.command.text}`,
          command: null,
        })
        .eq('id', messageId);

      if (error) throw error;
    } catch (error: any) {
      console.error("Error approving command:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'approuver la commande.",
      });
    }
  };

  const handleDeclineCommand = async (messageId: string) => {
    if (!conversationId || !user) return;
    
    try {
      const messageToUpdate = messages.find(msg => msg.id === messageId);
      if (!messageToUpdate || !messageToUpdate.command) return;
      
      const { error } = await supabase
        .from('messages')
        .update({
          content: `${messageToUpdate.content}\n\nExécution de la commande annulée.`,
          command: null,
        })
        .eq('id', messageId);

      if (error) throw error;
    } catch (error: any) {
      console.error("Error declining command:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de refuser la commande.",
      });
    }
  };

  // Effet pour charger les messages au montage ou au changement de conversation
  useEffect(() => {
    if (conversationId && user) {
      fetchMessages();
    }
  }, [conversationId, user]);

  // Écouter les mises à jour en temps réel des messages
  useEffect(() => {
    if (!conversationId || !user) return;
    
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
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, user]);

  return {
    messages,
    isLoading,
    handleSendMessage,
    handleApproveCommand,
    handleDeclineCommand,
  };
};
