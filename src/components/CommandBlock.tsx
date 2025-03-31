
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle } from "lucide-react";

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
          <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs font-medium px-2.5 py-1 rounded-full">
            Low Risk
          </span>
        );
      case "medium":
        return (
          <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 text-xs font-medium px-2.5 py-1 rounded-full">
            Medium Risk
          </span>
        );
      case "high":
        return (
          <span className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 text-xs font-medium px-2.5 py-1 rounded-full">
            High Risk
          </span>
        );
    }
  };

  return (
    <div className="glass dark:glass rounded-xl p-4 my-3 animate-fade-in shadow-md">
      <div className="flex justify-between items-start mb-3">
        <div className="font-mono text-sm font-bold">{command}</div>
        {getRiskBadge()}
      </div>
      <p className="text-muted-foreground text-sm mb-4">{description}</p>
      <div className="flex space-x-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onApprove}
          className="border-green-500 text-green-600 dark:border-green-600 dark:text-green-400 rounded-full"
        >
          <CheckCircle className="mr-1.5 h-4 w-4" />
          Approve
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onDecline}
          className="border-red-500 text-red-600 dark:border-red-600 dark:text-red-400 rounded-full"
        >
          <AlertCircle className="mr-1.5 h-4 w-4" />
          Decline
        </Button>
      </div>
    </div>
  );
};

export default CommandBlock;
