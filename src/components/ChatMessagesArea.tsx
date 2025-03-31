
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "@/components/ChatMessage";
import CommandBlock from "@/components/CommandBlock";
import { MessageType } from "@/types/chat";
import { Loader2 } from "lucide-react";

interface ChatMessagesAreaProps {
  messages: MessageType[];
  onApproveCommand: (messageId: string) => void;
  onDeclineCommand: (messageId: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  isBotTyping?: boolean;
}

const ChatMessagesArea = ({
  messages,
  onApproveCommand,
  onDeclineCommand,
  messagesEndRef,
  isBotTyping = false,
}: ChatMessagesAreaProps) => {
  return (
    <ScrollArea id="chat-scroll-area" className="flex-1">
      <div className="max-w-4xl mx-auto w-full p-4">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            Start a new conversation...
          </div>
        )}

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
                  onApprove={() => onApproveCommand(msg.id)}
                  onDecline={() => onDeclineCommand(msg.id)}
                />
              </div>
            )}
          </div>
        ))}

        {isBotTyping && (
          <div className="flex items-start mb-4">
            <div className="flex-shrink-0 mr-3">
              <div className="h-8 w-8 bg-[hsl(var(--header-bg))] border border-[hsl(var(--primary))] rounded-sm flex items-center justify-center">
                <Loader2 className="h-5 w-5 text-[hsl(var(--primary))] animate-spin" />
              </div>
            </div>
            <div className="msg-bubble msg-bubble-bot p-3">
              <div className="flex space-x-2 items-center">
                <span className="text-[hsl(var(--primary))]">Agent typing</span>
                <span className="typing-animation">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default ChatMessagesArea;
