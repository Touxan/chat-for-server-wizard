
import React, { useRef, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ChatMessagesArea from "@/components/ChatMessagesArea";
import ChatInputWrapper from "@/components/ChatInputWrapper";
import SidebarOverlay from "@/components/SidebarOverlay";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useSidebar } from "@/hooks/useSidebar";
import { useTheme } from "@/hooks/useTheme";

const Chat = () => {
  const { 
    messages, 
    handleSendMessage, 
    handleApproveCommand, 
    handleDeclineCommand 
  } = useChatMessages();
  
  const {
    isSidebarOpen,
    isOverlayVisible,
    sidebarRef,
    overlayRef,
    toggleSidebar,
    closeSidebar
  } = useSidebar();
  
  // Initialize the theme hook
  const { theme } = useTheme();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    const chatContainer = document.getElementById("chat-scroll-area");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-[hsl(var(--chat-bg))]">
      <Header toggleSidebar={toggleSidebar} />
      
      <Sidebar ref={sidebarRef} isOpen={isSidebarOpen} />
      
      <SidebarOverlay 
        isVisible={isOverlayVisible} 
        overlayRef={overlayRef}
        onClose={closeSidebar} 
      />
      
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOFYwaDQydjQySDM2VjE4eiIgZmlsbD0iY3VycmVudENvbG9yIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjxwYXRoIGQ9Ik0zMCAzMGMwLTkuOTQtOC4wNi0xOC0xOC0xOFYxMmgzNnYzNkgzMFYzMHoiIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1vcGFjaXR5PSIwLjIiLz48cGF0aCBkPSJNMjQgNDJjMC05Ljk0LTguMDYtMTgtMTgtMTh2LTZoMzZ2NDJIMjRWNDJ6IiBmaWxsPSJjdXJyZW50Q29sb3IiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PC9nPjwvc3ZnPg==')] opacity-20 dark:opacity-10 z-0 text-gray-400 dark:text-gray-600"></div>
        
        <div className="flex-1 flex flex-col h-full">
          <ChatMessagesArea 
            messages={messages}
            onApproveCommand={handleApproveCommand}
            onDeclineCommand={handleDeclineCommand}
            messagesEndRef={messagesEndRef}
          />
          
          <ChatInputWrapper onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
