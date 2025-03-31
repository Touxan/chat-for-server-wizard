
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal } from "lucide-react";
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
    <form onSubmit={handleSubmit} className="bg-white p-4">
      <div className="flex items-end space-x-2">
        <Textarea
          placeholder="Ask about your servers... (or use voice input)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[50px] resize-none flex-1"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <div className="flex space-x-2">
          <VoiceInput onTranscript={handleVoiceTranscript} />
          <Button type="submit" size="icon" disabled={!message.trim()}>
            <SendHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
