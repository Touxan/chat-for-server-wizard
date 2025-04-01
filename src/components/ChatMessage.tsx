
import React from "react";
import { Avatar } from "@/components/ui/avatar";
import { BotIcon, User } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

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
          
          {isUser ? (
            message
          ) : (
            <ReactMarkdown 
              components={{
                // Override to maintain terminal styling
                p: ({node, ...props}) => <span className="text-[#eee] block mb-2" {...props} />,
                // Make links open in new tab
                a: ({node, ...props}) => <a target="_blank" rel="noopener noreferrer" className="text-[hsl(var(--primary))] underline" {...props} />,
                // Style headers
                h1: ({node, ...props}) => <h1 className="text-lg font-bold mt-3 mb-1 text-white" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-md font-bold mt-3 mb-1 text-white" {...props} />,
                h3: ({node, ...props}) => <h3 className="font-bold mt-2 mb-1 text-white" {...props} />,
                // Style lists
                ul: ({node, ...props}) => <ul className="list-disc ml-4 my-2 text-[#eee]" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal ml-4 my-2 text-[#eee]" {...props} />,
                li: ({node, ...props}) => <li className="my-1 text-[#eee]" {...props} />,
                // Style code blocks
                code: ({node, ...props}) => <code className="bg-black/30 px-1 rounded font-mono text-[#eee]" {...props} />,
                pre: ({node, ...props}) => <pre className="bg-black/30 p-2 rounded my-2 overflow-x-auto text-[#eee]" {...props} />,
                // Add styles to other elements
                strong: ({node, ...props}) => <strong className="text-white font-bold" {...props} />,
                em: ({node, ...props}) => <em className="text-[#eee] italic" {...props} />,
                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-[hsl(var(--primary))] pl-2 my-2 italic text-[#eee]" {...props} />,
              }}
            >
              {message}
            </ReactMarkdown>
          )}
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
