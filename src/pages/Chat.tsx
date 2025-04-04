
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookText, Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import SidebarOverlay from "@/components/SidebarOverlay";
import { useSidebar } from "@/hooks/useSidebar";
import { Button } from "@/components/ui/button";

const Chat = () => {
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading } = useAuth();
  const {
    isSidebarOpen,
    isOverlayVisible,
    sidebarRef,
    overlayRef,
    toggleSidebar,
    closeSidebar
  } = useSidebar();

  useEffect(() => {
    // If user is not authenticated, redirect them to the auth page
    if (!isAuthLoading && !user) {
      navigate("/auth", { replace: true });
    }
  }, [user, isAuthLoading, navigate]);

  return (
    <div className="flex flex-col h-screen bg-[hsl(var(--background))]">
      <Header toggleSidebar={toggleSidebar} />
      
      <Sidebar ref={sidebarRef} isOpen={isSidebarOpen} />
      
      <SidebarOverlay 
        isVisible={isOverlayVisible} 
        overlayRef={overlayRef}
        onClose={closeSidebar} 
      />
      
      <div className="flex-1 flex flex-col items-center justify-center h-screen bg-[hsl(var(--background))]">
        <div className="flex flex-col items-center space-y-4 text-center max-w-md px-4">
          <BookText className="h-16 w-16 text-[hsl(var(--primary))]" />
          <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">Welcome to the Chat</h1>
          <p className="text-[hsl(var(--muted-foreground))]">
            Start a new conversation by clicking the "New conversation" button in the sidebar.
          </p>
          
          {/* Mobile-only button to open sidebar */}
          <div className="md:hidden mt-6">
            <Button 
              onClick={toggleSidebar} 
              variant="outline" 
              className="flex items-center"
            >
              <Menu className="mr-2 h-4 w-4" />
              Open Sidebar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
