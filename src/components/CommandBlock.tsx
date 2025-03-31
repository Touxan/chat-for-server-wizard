
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Terminal } from "lucide-react";

interface CommandBlockProps {
  command: string;
  description: string;
  onApprove: () => void;
  onDecline: () => void;
  risk: "low" | "medium" | "high";
}

const CommandBlock = ({
  command,
  description,
  onApprove,
  onDecline,
  risk,
}: CommandBlockProps) => {
  const getRiskBadge = () => {
    switch (risk) {
      case "low":
        return (
          <span className="bg-green-900/30 text-green-400 font-mono text-xs font-medium px-2 py-0.5 rounded-sm border border-green-600/30">
            LOW_RISK
          </span>
        );
      case "medium":
        return (
          <span className="bg-yellow-900/30 text-yellow-400 font-mono text-xs font-medium px-2 py-0.5 rounded-sm border border-yellow-600/30">
            MED_RISK
          </span>
        );
      case "high":
        return (
          <span className="bg-red-900/30 text-red-400 font-mono text-xs font-medium px-2 py-0.5 rounded-sm border border-red-600/30">
            HIGH_RISK
          </span>
        );
    }
  };

  return (
    <div className="bg-[hsl(var(--chat-bubble-bot))] border border-[hsl(var(--chat-bubble-bot-border))] rounded-sm p-4 my-3 animate-fade-in shadow-md">
      <div className="flex justify-between items-start mb-3">
        <div className="font-mono text-sm text-[hsl(var(--primary))]">
          <Terminal size={14} className="inline mr-2" />
          {command}
        </div>
        {getRiskBadge()}
      </div>
      <p className="text-[hsl(var(--chat-bubble-bot-text))] opacity-80 text-sm mb-4 font-mono">{description}</p>
      <div className="flex space-x-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onApprove}
          className="border-green-500 text-green-500 hover:bg-green-900/30 rounded-sm font-mono"
        >
          <CheckCircle className="mr-1.5 h-4 w-4" />
          EXEC
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onDecline}
          className="border-red-500 text-red-500 hover:bg-red-900/30 rounded-sm font-mono"
        >
          <AlertCircle className="mr-1.5 h-4 w-4" />
          ABORT
        </Button>
      </div>
    </div>
  );
};

export default CommandBlock;
