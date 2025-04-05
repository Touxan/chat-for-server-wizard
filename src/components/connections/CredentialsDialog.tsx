
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ConnectionType, ConnectionCredentials } from "@/types/connections";

interface CredentialsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentConnection: ConnectionType | null;
  credentials: ConnectionCredentials;
  onCredentialsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  isSubmitting: boolean;
}

export const CredentialsDialog = ({
  isOpen,
  onOpenChange,
  currentConnection,
  credentials,
  onCredentialsChange,
  onSave,
  isSubmitting,
}: CredentialsDialogProps) => {
  if (!currentConnection) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Connect to {currentConnection.name}
          </DialogTitle>
          <DialogDescription>
            Provide the necessary credentials to connect your {currentConnection.name.toLowerCase()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {currentConnection.fields.map((field) => (
            <div key={field} className="grid gap-2">
              <Label htmlFor={field} className="capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</Label>
              <Input
                id={field}
                name={field}
                type={field.includes('password') ? 'password' : 'text'}
                value={credentials[field]}
                onChange={onCredentialsChange}
                placeholder={`Enter your ${field.replace(/([A-Z])/g, ' $1').trim()}`}
              />
            </div>
          ))}
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Cancel
          </Button>
          <Button onClick={onSave} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Connection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
