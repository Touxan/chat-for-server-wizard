
import React, { useRef, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ChatMessagesArea from "@/components/ChatMessagesArea";
import ChatInputWrapper from "@/components/ChatInputWrapper";
import SidebarOverlay from "@/components/SidebarOverlay";
import { useSidebar } from "@/hooks/useSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useChatMessagesWithSupabase } from "@/hooks/useChatMessagesWithSupabase";
import { Loader2 } from "lucide-react";

const ChatWithId = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { user, isLoading: isAuthLoading } = useAuth();
  const {
    messages,
    isLoading: isMessagesLoading,
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

  // Scroll to bottom when messages change
  useEffect(() => {
    const chatContainer = document.getElementById("chat-scroll-area");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
            <ChatMessagesArea 
              messages={messages}
              onApproveCommand={handleApproveCommand}
              onDeclineCommand={handleDeclineCommand}
              messagesEndRef={messagesEndRef}
            />
            
            <ChatInputWrapper onSendMessage={handleSendMessage} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWithId;
