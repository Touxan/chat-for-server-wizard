
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "@/components/ChatMessage";
import CommandBlock from "@/components/CommandBlock";
import { MessageType } from "@/types/chat";

interface ChatMessagesAreaProps {
  messages: MessageType[];
  onApproveCommand: (messageId: string) => void;
  onDeclineCommand: (messageId: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const ChatMessagesArea = ({
  messages,
  onApproveCommand,
  onDeclineCommand,
  messagesEndRef,
}: ChatMessagesAreaProps) => {
  return (
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
                  onApprove={() => onApproveCommand(msg.id)}
                  onDecline={() => onDeclineCommand(msg.id)}
                />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default ChatMessagesArea;
