
import React from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NewConversationButtonProps {
  onClick: () => void;
  disabled: boolean;
}

const NewConversationButton: React.FC<NewConversationButtonProps> = ({
  onClick,
  disabled
}) => {
  return (
    <Button 
      className="w-full bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 shadow-md mb-4 py-5 text-white font-mono rounded-sm"
      onClick={onClick}
      disabled={disabled}
    >
      <PlusCircle className="mr-2 h-4 w-4" />
      New conversation
    </Button>
  );
};

export default NewConversationButton;
