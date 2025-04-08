
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ConnectionCredentials, ConnectionType, Provider } from "@/types/connections";
import { supabase } from "@/integrations/supabase/client";

export const useConnections = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentConnectionType, setCurrentConnectionType] = useState<string | null>(null);
  const [currentProvider, setCurrentProvider] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [credentials, setCredentials] = useState<ConnectionCredentials>({
    apiKey: "",
    username: "",
    password: "",
    endpoint: "",
    xAuthToken: "",
    sshPrivateKey: ""
  });

  // Handle opening the connection dialog
  const handleConnect = (connectionString: string) => {
    // Parse connection string (format: "type:provider")
    const [type, provider] = connectionString.split(':');
    
    const connectionConfig = findConnectionByType(type);
    const providerConfig = connectionConfig ? findProviderById(connectionConfig, provider) : null;
    
    if (providerConfig?.status === 'coming soon') {
      toast({
        title: "Coming Soon",
        description: `${providerConfig.name} is not yet available.`,
      });
      return;
    }

    setCurrentConnectionType(type);
    setCurrentProvider(provider);
    setIsDialogOpen(true);
    // Reset all credential fields
    setCredentials({
      apiKey: "",
      username: "",
      password: "",
      endpoint: "",
      xAuthToken: "",
      sshPrivateKey: ""
    });
  };

  // Find a connection by its type
  const findConnectionByType = (type: string | null): ConnectionType | null => {
    if (!type) return null;
    // This will be provided by the component using this hook
    return null;
  };

  // Find a provider by its ID within a connection type
  const findProviderById = (connection: ConnectionType, providerId: string | null): Provider | null => {
    if (!providerId) return null;
    return connection.providers.find(p => p.id === providerId) || null;
  };

  // Handle saving credentials
  const handleSaveCredentials = async (connectionTypes: ConnectionType[]) => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    // Get the current connection configuration
    const connectionConfig = connectionTypes.find(c => c.type === currentConnectionType);
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
          p_type: `${currentConnectionType}:${currentProvider}`,
          p_credentials: credentialsToSave
        }
      });
        
      if (error) throw error;
      
      const providerName = connectionConfig.providers.find(p => p.id === currentProvider)?.name || '';
      
      toast({
        title: "Connection Saved",
        description: `Your ${providerName} connection has been saved successfully.`,
      });
      
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || `Failed to save connection.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle change in input fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return {
    currentConnectionType,
    currentProvider,
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
    },
    findProviderById: (connection: ConnectionType | null, providerId: string | null) => {
      if (!connection || !providerId) return null;
      return connection.providers.find(p => p.id === providerId) || null;
    }
  };
};
