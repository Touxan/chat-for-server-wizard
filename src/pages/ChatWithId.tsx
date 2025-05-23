
import React, { useRef, useEffect, useCallback } from "react";
import { useParams, Navigate } from "react-router-dom";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ChatMessagesArea from "@/components/ChatMessagesArea";
import ChatInputWrapper from "@/components/ChatInputWrapper";
import SidebarOverlay from "@/components/SidebarOverlay";
import { useSidebar } from "@/hooks/useSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useChatMessagesWithSupabase } from "@/hooks/useChatMessagesWithSupabase";
import { Loader2, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const ChatWithId = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { user, isLoading: isAuthLoading } = useAuth();
  const {
    messages,
    isLoading: isMessagesLoading,
    isBotTyping,
    handleSendMessage,
    handleApproveCommand,
    handleDeclineCommand
  } = useChatMessagesWithSupabase(conversationId);
  
  const {
    isSidebarOpen,
    isOverlayVisible,
    sidebarRef,
    overlayRef,
    toggleSidebar,
    closeSidebar
  } = useSidebar();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change or when bot starts/stops typing
  const scrollToBottom = useCallback(() => {
    const chatContainer = document.getElementById("chat-scroll-area");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesEndRef]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isBotTyping, scrollToBottom]);

  // Redirect to authentication page if user is not logged in
  if (!isAuthLoading && !user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="flex flex-col h-screen bg-[hsl(var(--chat-bg))] chat-pattern">
      <Header toggleSidebar={toggleSidebar} />
      
      <Sidebar ref={sidebarRef} isOpen={isSidebarOpen} />
      
      <SidebarOverlay 
        isVisible={isOverlayVisible} 
        overlayRef={overlayRef}
        onClose={closeSidebar} 
      />
      
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {isAuthLoading || isMessagesLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--primary))]" />
              <p className="text-[hsl(var(--foreground))]">Loading...</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col h-full">
            {/* Mobile-only button to open sidebar */}
            <div className="md:hidden p-2">
              <Button 
                onClick={toggleSidebar} 
                variant="ghost" 
                size="sm"
                className="flex items-center"
              >
                <Menu className="h-4 w-4 mr-2" />
                Menu
              </Button>
            </div>
          
            <ChatMessagesArea 
              messages={messages}
              onApproveCommand={handleApproveCommand}
              onDeclineCommand={handleDeclineCommand}
              messagesEndRef={messagesEndRef}
              isBotTyping={isBotTyping}
            />
            
            <ChatInputWrapper onSendMessage={handleSendMessage} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWithId;
