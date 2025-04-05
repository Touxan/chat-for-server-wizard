
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ConnectionCard } from "@/components/connections/ConnectionCard";
import { CredentialsDialog } from "@/components/connections/CredentialsDialog";
import { connectionTypes } from "@/data/connectionTypes";
import { useConnections } from "@/hooks/useConnections";

const Connections = () => {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const { 
    currentConnectionType,
    currentProvider,
    isDialogOpen,
    isSubmitting,
    credentials,
    setIsDialogOpen,
    handleConnect,
    handleSaveCredentials,
    handleInputChange,
    findConnectionByType,
    findProviderById
  } = useConnections();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  // Find the current connection config
  const currentConnectionConfig = findConnectionByType(connectionTypes, currentConnectionType);
  
  // Find the current provider
  const currentProviderConfig = currentConnectionConfig 
    ? findProviderById(currentConnectionConfig, currentProvider)
    : null;

  // Handler for saving credentials that uses the connection types
  const saveCredentials = () => handleSaveCredentials(connectionTypes);

  if (!profile) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-pulse text-xl">Loading connections...</div>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Infrastructure Connections</h1>
        <p className="text-muted-foreground mt-2">
          Connect your AI agent to your infrastructure components for enhanced automation and insights
        </p>
      </div>

      <div className="flex flex-col">
        {connectionTypes.map((connection) => (
          <ConnectionCard
            key={connection.id}
            connection={connection}
            onConnect={handleConnect}
          />
        ))}
      </div>

      {/* Credentials Dialog */}
      <CredentialsDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        connectionType={currentConnectionConfig}
        provider={currentProviderConfig}
        credentials={credentials}
        onCredentialsChange={handleInputChange}
        onSave={saveCredentials}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Connections;
