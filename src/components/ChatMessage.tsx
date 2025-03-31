
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
        "flex items-start mb-4 animate-fade-in",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0 mr-3">
          <Avatar className="h-8 w-8 bg-[hsl(var(--header-bg))] border border-[hsl(var(--primary))] rounded-sm">
            <BotIcon className="h-5 w-5 text-[hsl(var(--primary))]" />
          </Avatar>
        </div>
      )}
      
      <div
        className={cn(
          "msg-bubble terminal-text",
          isUser ? "msg-bubble-user" : "msg-bubble-bot"
        )}
      >
        <div className="whitespace-pre-wrap mb-1">
          {isUser && <span className="text-[hsl(var(--primary))] font-bold">user@server:~$ </span>}
          {!isUser && <span className="text-[hsl(var(--primary))] font-bold">server_wizard:~# </span>}
          {message}
        </div>
        <div
          className={cn(
            "text-xs opacity-70"
          )}
        >
          {timestamp}
        </div>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 ml-3">
          <Avatar className="h-8 w-8 bg-[hsl(var(--chat-bubble-user))] border border-[hsl(var(--chat-bubble-user-light))] rounded-sm">
            <User className="h-5 w-5 text-white" />
          </Avatar>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
