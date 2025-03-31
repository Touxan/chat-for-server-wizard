
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
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
            Low Risk
          </span>
        );
      case "medium":
        return (
          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded">
            Medium Risk
          </span>
        );
      case "high":
        return (
          <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
            High Risk
          </span>
        );
    }
  };

  return (
    <div className="border border-gray-200 rounded-md bg-gray-50 p-4 my-2">
      <div className="flex justify-between items-start mb-2">
        <div className="font-mono text-sm font-bold">{command}</div>
        {getRiskBadge()}
      </div>
      <p className="text-gray-600 text-sm mb-3">{description}</p>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onApprove}
          className="border-green-500 text-green-600 hover:bg-green-50"
        >
          <CheckCircle className="mr-1 h-4 w-4" />
          Approve
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onDecline}
          className="border-red-500 text-red-600 hover:bg-red-50"
        >
          <AlertCircle className="mr-1 h-4 w-4" />
          Decline
        </Button>
      </div>
    </div>
  );
};

export default CommandBlock;
