
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RenameDialogProps {
  isOpen: boolean;
  onClose: () => void;
  newTitle: string;
  onTitleChange: (value: string) => void;
  onRename: () => void;
}

const RenameDialog: React.FC<RenameDialogProps> = ({
  isOpen,
  onClose,
  newTitle,
  onTitleChange,
  onRename,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rename Conversation</DialogTitle>
          <DialogDescription>
            Enter a new name for this conversation.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-y-4 py-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="name" className="sr-only">
              Name
            </Label>
            <Input
              id="name"
              value={newTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Enter conversation name"
              className="col-span-3"
              autoFocus
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button variant="secondary" onClick={onClose} className="mr-2">
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={onRename}
            disabled={!newTitle.trim()}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RenameDialog;
