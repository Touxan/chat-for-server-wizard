
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ConnectionCredentials, ConnectionType } from "@/types/connections";
import { supabase } from "@/integrations/supabase/client";

export const useConnections = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentConnection, setCurrentConnection] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [credentials, setCredentials] = useState<ConnectionCredentials>({
    apiKey: "",
    username: "",
    password: "",
    endpoint: ""
  });

  // Handle opening the connection dialog
  const handleConnect = (type: string) => {
    const connectionConfig = findConnectionByType(type);
    
    if (connectionConfig?.status === 'coming soon') {
      toast({
        title: "Coming Soon",
        description: `The ${connectionConfig.name} connection is not yet available.`,
      });
      return;
    }

    setCurrentConnection(type);
    setIsDialogOpen(true);
    setCredentials({
      apiKey: "",
      username: "",
      password: "",
      endpoint: ""
    });
  };

  // Find a connection by its type
  const findConnectionByType = (type: string | null): ConnectionType | null => {
    if (!type) return null;
    
    // This will be provided by the component using this hook
    return null;
  };

  // Handle saving credentials
  const handleSaveCredentials = async (connectionTypes: ConnectionType[]) => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    // Get the current connection configuration
    const connectionConfig = connectionTypes.find(c => c.type === currentConnection);
    if (!connectionConfig) return;
    
    try {
      // Create an object with only the required fields
      const credentialsToSave = connectionConfig.fields.reduce((obj, field) => {
        obj[field] = credentials[field];
        return obj;
      }, {} as Record<string, string>);
      
      // Save to Supabase using the edge function
      const { error } = await supabase.functions.invoke("insert_connection", {
        body: {
          p_user_id: user.id,
          p_type: currentConnection,
          p_credentials: credentialsToSave
        }
      });
        
      if (error) throw error;
      
      toast({
        title: "Connection Saved",
        description: `Your ${connectionConfig.name} connection has been saved successfully.`,
      });
      
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || `Failed to save ${currentConnection} connection.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle change in input fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return {
    currentConnection,
    isDialogOpen,
    isSubmitting,
    credentials,
    setIsDialogOpen,
    handleConnect,
    handleSaveCredentials,
    handleInputChange,
    findConnectionByType: (connections: ConnectionType[], type: string | null) => {
      if (!type) return null;
      return connections.find(c => c.type === type) || null;
    }
  };
};
