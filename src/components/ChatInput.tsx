
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal, Terminal } from "lucide-react";
import VoiceInput from "./VoiceInput";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    setMessage((prev) => prev + transcript);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-black border border-[#0f0]/30 w-full rounded-sm p-3">
      <div className="flex items-center space-x-2 w-full">
        <span className="text-[#0f0] font-mono font-bold">$</span>
        <Textarea
          placeholder="Type your command..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[40px] resize-none flex-1 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#0f0] border-none font-mono text-[#0f0]"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <div className="flex space-x-2 items-center">
          <VoiceInput onTranscript={handleVoiceTranscript} />
          <Button 
            type="submit" 
            size="sm" 
            disabled={!message.trim()} 
            className="bg-[#0f0] hover:bg-[#0f0]/90 text-black rounded-sm"
          >
            <SendHorizontal className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
