
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
    <div className="flex flex-col h-screen bg-[hsl(var(--chat-bg))] chat-pattern">
      <Header toggleSidebar={toggleSidebar} />
      
      <Sidebar ref={sidebarRef} isOpen={isSidebarOpen} />
      
      <SidebarOverlay 
        isVisible={isOverlayVisible} 
        overlayRef={overlayRef}
        onClose={closeSidebar} 
      />
      
      <div className="flex-1 flex flex-col relative overflow-hidden">
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
