
import React, { useState, useEffect } from "react";
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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setIsOverlayVisible(!isOverlayVisible);
  };

  const handleSendMessage = (message: string) => {
    // Add user message
    const newUserMessage: MessageType = {
      id: `user-${Date.now()}`,
      content: message,
      isUser: true,
      timestamp: "Just now",
    };
    
    setMessages((prev) => [...prev, newUserMessage]);

    // Simulate AI response with a delay
    setTimeout(() => {
      // Example responses based on keywords in the message
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

  // Scroll to bottom effect
  useEffect(() => {
    const chatContainer = document.getElementById("chat-scroll-area");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-[#F7FAFC]">
      <Header toggleSidebar={toggleSidebar} />
      
      <Sidebar isOpen={isSidebarOpen} />
      
      {/* Overlay when sidebar is open on mobile */}
      {isOverlayVisible && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      <div className="flex-1 flex flex-col relative">
        <ScrollArea id="chat-scroll-area" className="flex-1 p-4">
          <div className="max-w-4xl mx-auto w-full">
            {messages.map((msg) => (
              <div key={msg.id}>
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
          </div>
        </ScrollArea>
        
        <div className="max-w-4xl mx-auto w-full">
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
