
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useConversations } from "@/hooks/useConversations";

const Chat = () => {
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading } = useAuth();
  const { addConversation, isLoading: isConversationsLoading } = useConversations();

  useEffect(() => {
    const createAndNavigate = async () => {
      if (user && !isConversationsLoading) {
        // Créer une nouvelle conversation et naviguer vers celle-ci
        const newConversation = await addConversation("nouvelle_conversation");
        if (newConversation) {
          navigate(`/chat/${newConversation.id}`, { replace: true });
        }
      } else if (!isAuthLoading && !user) {
        // Rediriger vers la page d'authentification si l'utilisateur n'est pas connecté
        navigate("/auth", { replace: true });
      }
    };

    createAndNavigate();
  }, [user, isAuthLoading, isConversationsLoading]);

  return (
    <div className="flex-1 flex items-center justify-center h-screen bg-[hsl(var(--background))]">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--primary))]" />
        <p className="text-[hsl(var(--foreground))]">Création d'une nouvelle conversation...</p>
      </div>
    </div>
  );
};

export default Chat;
