
import React from "react";
import ChatInput from "@/components/ChatInput";

interface ChatInputWrapperProps {
  onSendMessage: (message: string) => void;
}

const ChatInputWrapper = ({ onSendMessage }: ChatInputWrapperProps) => {
  return (
    <div className="sticky bottom-0 w-full p-4 pb-6 z-10 bg-gradient-to-b from-transparent via-black/95 to-black">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-sm overflow-hidden shadow-md border-t border-[#0f0]/30">
          <ChatInput onSendMessage={onSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default ChatInputWrapper;
