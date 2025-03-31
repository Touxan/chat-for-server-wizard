
import React from "react";
import ChatInput from "@/components/ChatInput";

interface ChatInputWrapperProps {
  onSendMessage: (message: string) => void;
}

const ChatInputWrapper = ({ onSendMessage }: ChatInputWrapperProps) => {
  return (
    <div className="sticky bottom-0 w-full p-4 z-10 bg-gradient-to-b from-transparent via-[hsl(var(--chat-bg))/80] to-[hsl(var(--chat-bg))]">
      <div className="max-w-4xl mx-auto backdrop-blur-md bg-[hsl(var(--card))/90] rounded-xl shadow-lg border border-[hsl(var(--border))]">
        <ChatInput onSendMessage={onSendMessage} />
      </div>
    </div>
  );
};

export default ChatInputWrapper;
