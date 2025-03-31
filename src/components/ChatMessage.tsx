
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
        "flex items-start mb-6",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0 mr-3">
          <Avatar className="h-8 w-8 bg-primary">
            <BotIcon className="h-5 w-5 text-white" />
          </Avatar>
        </div>
      )}
      <div
        className={cn(
          "max-w-[80%] rounded-lg p-4",
          isUser
            ? "bg-primary text-white rounded-br-none"
            : "bg-white border border-gray-200 rounded-bl-none shadow-sm"
        )}
      >
        <div className="whitespace-pre-wrap mb-1">{message}</div>
        <div
          className={cn(
            "text-xs",
            isUser ? "text-gray-100" : "text-gray-500"
          )}
        >
          {timestamp}
        </div>
      </div>
      {isUser && (
        <div className="flex-shrink-0 ml-3">
          <Avatar className="h-8 w-8 bg-secondary">
            <User className="h-5 w-5 text-primary" />
          </Avatar>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;

