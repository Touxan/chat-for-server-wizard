
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
        "flex items-start mb-5",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0 mr-3">
          <Avatar className="h-9 w-9 bg-[hsl(var(--header-bg))] ring-2 ring-[hsl(var(--chat-bubble-bot-border))] ring-offset-2 ring-offset-[hsl(var(--chat-bg))]">
            <BotIcon className="h-5 w-5 text-white" />
          </Avatar>
        </div>
      )}
      <div
        className={cn(
          "max-w-[80%] rounded-xl p-4 shadow-sm",
          isUser
            ? "bg-[hsl(var(--chat-bubble-user))] text-white rounded-br-none"
            : "bg-[hsl(var(--chat-bubble-bot))] border border-[hsl(var(--chat-bubble-bot-border))] dark:text-gray-100 rounded-bl-none"
        )}
      >
        <div className="whitespace-pre-wrap mb-1 text-sm">{message}</div>
        <div
          className={cn(
            "text-xs",
            isUser ? "text-white/80" : "text-gray-500 dark:text-gray-400"
          )}
        >
          {timestamp}
        </div>
      </div>
      {isUser && (
        <div className="flex-shrink-0 ml-3">
          <Avatar className="h-9 w-9 bg-[hsl(var(--chat-bubble-user))] ring-2 ring-[hsl(var(--chat-bubble-user)/80] ring-offset-2 ring-offset-[hsl(var(--chat-bg))]">
            <User className="h-5 w-5 text-white" />
          </Avatar>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
