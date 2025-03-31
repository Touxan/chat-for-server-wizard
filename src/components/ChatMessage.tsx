
import React from "react";
import { Avatar } from "@/components/ui/avatar";
import { BotIcon, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: string;
}

const ChatMessage = ({ message, isUser, timestamp }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex items-start mb-6 animate-fade-in",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0 mr-3">
          <Avatar className="h-10 w-10 bg-[hsl(var(--header-bg))] avatar-ring-bot">
            <BotIcon className="h-5 w-5 text-white" />
          </Avatar>
        </div>
      )}
      
      <div
        className={cn(
          "msg-bubble",
          isUser ? "msg-bubble-user" : "msg-bubble-bot"
        )}
      >
        <div className="whitespace-pre-wrap mb-1.5">{message}</div>
        <div
          className={cn(
            "text-xs",
            isUser ? "opacity-80" : "opacity-60"
          )}
        >
          {timestamp}
        </div>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 ml-3">
          <Avatar className="h-10 w-10 bg-[hsl(var(--chat-bubble-user))] avatar-ring-user">
            <User className="h-5 w-5 text-white" />
          </Avatar>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
