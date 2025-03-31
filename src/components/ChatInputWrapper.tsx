
import React from "react";
import ChatInput from "@/components/ChatInput";

interface ChatInputWrapperProps {
  onSendMessage: (message: string) => void;
}

const ChatInputWrapper = ({ onSendMessage }: ChatInputWrapperProps) => {
  return (
    <div className="sticky bottom-0 w-full p-4 z-10 bg-gradient-to-b from-transparent via-[#eef2f6]/80 to-[#eef2f6]">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100">
        <ChatInput onSendMessage={onSendMessage} />
      </div>
    </div>
  );
};

export default ChatInputWrapper;
