
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
        // Create a new conversation and navigate to it
        const newConversation = await addConversation("New Conversation");
        if (newConversation) {
          navigate(`/chat/${newConversation.id}`, { replace: true });
        }
      } else if (!isAuthLoading && !user) {
        // Redirect to authentication page if the user is not logged in
        navigate("/auth", { replace: true });
      }
    };

    createAndNavigate();
  }, [user, isAuthLoading, isConversationsLoading]);

  return (
    <div className="flex-1 flex items-center justify-center h-screen bg-[hsl(var(--background))]">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--primary))]" />
        <p className="text-[hsl(var(--foreground))]">Creating a new conversation...</p>
      </div>
    </div>
  );
};

export default Chat;
