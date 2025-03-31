
import { useState } from "react";
import { MessageType } from "@/types/chat";

const initialMessages: MessageType[] = [
  {
    id: "welcome",
    content: "Hello! I'm your Server Wizard assistant for Scaleway. I can help you manage your servers by creating and executing commands with your approval. How can I assist you today?",
    isUser: false,
    timestamp: "Just now",
  },
];

export const useChatMessages = () => {
  const [messages, setMessages] = useState<MessageType[]>(initialMessages);
  
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

  return {
    messages,
    handleSendMessage,
    handleApproveCommand,
    handleDeclineCommand
  };
};
