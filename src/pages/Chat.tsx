
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Chat = () => {
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading } = useAuth();

  useEffect(() => {
    // If user is not authenticated, redirect them to the auth page
    if (!isAuthLoading && !user) {
      navigate("/auth", { replace: true });
    }
  }, [user, isAuthLoading, navigate]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center h-screen bg-[hsl(var(--background))]">
      <div className="flex flex-col items-center space-y-4 text-center max-w-md px-4">
        <BookText className="h-16 w-16 text-[hsl(var(--primary))]" />
        <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">Welcome to the Chat</h1>
        <p className="text-[hsl(var(--muted-foreground))]">
          Start a new conversation by clicking the "New conversation" button in the sidebar.
        </p>
      </div>
    </div>
  );
};

export default Chat;
