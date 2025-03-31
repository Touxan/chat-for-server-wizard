import React, { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ChatInput from "@/components/ChatInput";
import ChatMessage from "@/components/ChatMessage";
import CommandBlock from "@/components/CommandBlock";
import { ScrollArea } from "@/components/ui/scroll-area";

type MessageType = {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
  command?: {
    text: string;
    description: string;
    risk: "low" | "medium" | "high";
  };
};

const initialMessages: MessageType[] = [
  {
    id: "welcome",
    content: "Hello! I'm your Server Wizard assistant for Scaleway. I can help you manage your servers by creating and executing commands with your approval. How can I assist you today?",
    isUser: false,
    timestamp: "Just now",
  },
];

const Chat = () => {
  const [messages, setMessages] = useState<MessageType[]>(initialMessages);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setIsOverlayVisible(!isOverlayVisible);
  };

  const closeSidebar = () => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
      setIsOverlayVisible(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target as Node) &&
        overlayRef.current !== event.target &&
        !overlayRef.current?.contains(event.target as Node)
      ) {
        closeSidebar();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  const handleSendMessage = (message: string) => {
    const newUserMessage: MessageType = {
      id: `user-${Date.now()}`,
      content: message,
      isUser: true,
      timestamp: "Just now",
    };
    
    setMessages((prev) => [...prev, newUserMessage]);

    setTimeout(() => {
      let botResponse: MessageType;
      
      if (message.toLowerCase().includes("restart") || message.toLowerCase().includes("reboot")) {
        botResponse = {
          id: `bot-${Date.now()}`,
          content: "I can help you restart your server. Here's the command I recommend:",
          isUser: false,
          timestamp: "Just now",
          command: {
            text: "sudo systemctl restart nginx",
            description: "This will restart the NGINX web server without affecting other services.",
            risk: "low",
          },
        };
      } else if (message.toLowerCase().includes("update") || message.toLowerCase().includes("upgrade")) {
        botResponse = {
          id: `bot-${Date.now()}`,
          content: "I can help you update your system. Here's the recommended command:",
          isUser: false,
          timestamp: "Just now",
          command: {
            text: "sudo apt update && sudo apt upgrade -y",
            description: "This will update your package lists and upgrade all installed packages to their latest versions.",
            risk: "medium",
          },
        };
      } else if (message.toLowerCase().includes("delete") || message.toLowerCase().includes("remove")) {
        botResponse = {
          id: `bot-${Date.now()}`,
          content: "I understand you want to delete something. Please be careful with this command:",
          isUser: false,
          timestamp: "Just now",
          command: {
            text: "sudo rm -rf /var/log/old_logs/",
            description: "This will recursively remove all files in the old_logs directory. Make sure you don't need these files anymore.",
            risk: "high",
          },
        };
      } else {
        botResponse = {
          id: `bot-${Date.now()}`,
          content: "I'm analyzing your request. Could you provide more details about what you'd like to do with your Scaleway servers?",
          isUser: false,
          timestamp: "Just now",
        };
      }
      
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const handleApproveCommand = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId && msg.command) {
          return {
            ...msg,
            content: `${msg.content}\n\nCommand executed successfully: ${msg.command.text}`,
            command: undefined,
          };
        }
        return msg;
      })
    );
  };

  const handleDeclineCommand = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId && msg.command) {
          return {
            ...msg,
            content: `${msg.content}\n\nCommand execution cancelled.`,
            command: undefined,
          };
        }
        return msg;
      })
    );
  };

  useEffect(() => {
    const chatContainer = document.getElementById("chat-scroll-area");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#f8fafc] to-[#eef2f6]">
      <Header toggleSidebar={toggleSidebar} />
      
      <Sidebar ref={sidebarRef} isOpen={isSidebarOpen} />
      
      {isOverlayVisible && (
        <div 
          ref={overlayRef}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-30 md:hidden"
          onClick={closeSidebar}
        />
      )}
      
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOFYwaDQydjQySDM2VjE4eiIgZmlsbD0iI2VlZjJmNiIgZmlsbC1vcGFjaXR5PSIwLjQiLz48cGF0aCBkPSJNMzAgMzBjMC05Ljk0LTguMDYtMTgtMTgtMThWMTJoMzZ2MzZIMzBWMzB6IiBmaWxsPSIjZWVmMmY2IiBmaWxsLW9wYWNpdHk9IjAuNCIvPjxwYXRoIGQ9Ik0yNCA0MmMwLTkuOTQtOC4wNi0xOC0xOC0xOHYtNmgzNnY0MkgyNFY0MnoiIGZpbGw9IiNlZWYyZjYiIGZpbGwtb3BhY2l0eT0iMC40Ii8+PC9nPjwvc3ZnPg==')] opacity-30 z-0"></div>
        
        <div className="flex-1 flex flex-col h-full">
          <ScrollArea id="chat-scroll-area" className="flex-1">
            <div className="max-w-4xl mx-auto w-full p-4">
              {messages.map((msg) => (
                <div key={msg.id} className="animate-fade-in">
                  <ChatMessage
                    message={msg.content}
                    isUser={msg.isUser}
                    timestamp={msg.timestamp}
                  />
                  {msg.command && (
                    <div className="ml-11 mb-6">
                      <CommandBlock
                        command={msg.command.text}
                        description={msg.command.description}
                        risk={msg.command.risk}
                        onApprove={() => handleApproveCommand(msg.id)}
                        onDecline={() => handleDeclineCommand(msg.id)}
                      />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <div className="sticky bottom-0 w-full p-4 z-10 bg-gradient-to-b from-transparent via-[#eef2f6]/80 to-[#eef2f6]">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100">
              <ChatInput onSendMessage={handleSendMessage} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
