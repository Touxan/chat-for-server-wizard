
import React from "react";
import ChatInput from "@/components/ChatInput";

interface ChatInputWrapperProps {
  onSendMessage: (message: string) => void;
}

const ChatInputWrapper = ({ onSendMessage }: ChatInputWrapperProps) => {
  return (
    <div className="sticky bottom-0 w-full p-4 z-10 bg-gradient-to-b from-transparent via-background/80 to-background">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-accent">
        <ChatInput onSendMessage={onSendMessage} />
      </div>
    </div>
  );
};

export default ChatInputWrapper;

