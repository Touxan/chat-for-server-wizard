
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
import { Textarea } from "@/components/ui/textarea";
import { ConnectionType, ConnectionCredentials, Provider } from "@/types/connections";

interface CredentialsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  connectionType: ConnectionType | null;
  provider: Provider | null;
  credentials: ConnectionCredentials;
  onCredentialsChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSave: () => void;
  isSubmitting: boolean;
}

export const CredentialsDialog = ({
  isOpen,
  onOpenChange,
  connectionType,
  provider,
  credentials,
  onCredentialsChange,
  onSave,
  isSubmitting,
}: CredentialsDialogProps) => {
  if (!connectionType || !provider) return null;

  // Function to get a friendly label for credential fields
  const getFieldLabel = (field: keyof ConnectionCredentials) => {
    const labels: Record<keyof ConnectionCredentials, string> = {
      apiKey: "API Key",
      username: "Username",
      password: "Password",
      endpoint: "Endpoint URL",
      xAuthToken: "X-Auth-Token",
      sshPrivateKey: "SSH Private Key"
    };
    
    return labels[field] || field.replace(/([A-Z])/g, ' $1').trim();
  };

  // Function to get placeholder text based on field and provider
  const getPlaceholder = (field: keyof ConnectionCredentials, providerId: string) => {
    if (field === 'xAuthToken' && providerId === 'scaleway') {
      return '69f3aef1-cb31-4598-82b7-zz5eea02df72';
    }
    
    if (field === 'sshPrivateKey' && providerId === 'linux') {
      return '-----BEGIN RSA PRIVATE KEY-----\nYour private key content here\n-----END RSA PRIVATE KEY-----';
    }
    
    return `Enter your ${getFieldLabel(field)}`;
  };

  // Function to determine if we should use a textarea for this field
  const isTextareaField = (field: keyof ConnectionCredentials): boolean => {
    return field === 'sshPrivateKey';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Connect to {provider.name}
          </DialogTitle>
          <DialogDescription>
            Provide the necessary credentials to connect your {provider.name} {connectionType.name.toLowerCase()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {connectionType.fields.map((field) => (
            <div key={field} className="grid gap-2">
              <Label htmlFor={field}>{getFieldLabel(field)}</Label>
              {isTextareaField(field) ? (
                <Textarea
                  id={field}
                  name={field}
                  value={credentials[field]}
                  onChange={onCredentialsChange}
                  placeholder={getPlaceholder(field, provider.id)}
                  rows={6}
                  className="font-mono text-sm"
                />
              ) : (
                <Input
                  id={field}
                  name={field}
                  type={field.includes('password') ? 'password' : 'text'}
                  value={credentials[field]}
                  onChange={onCredentialsChange}
                  placeholder={getPlaceholder(field, provider.id)}
                />
              )}
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
