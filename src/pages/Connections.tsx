
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link2, Plus, Github, Google, Twitter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Connections = () => {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  // Mock data for connections since we don't have actual connections yet
  const connections = [
    { id: 1, type: 'github', connected: false, icon: Github },
    { id: 2, type: 'google', connected: false, icon: Google },
    { id: 3, type: 'twitter', connected: false, icon: Twitter },
  ];

  const handleConnect = (type: string) => {
    toast({
      title: "Connection feature",
      description: `This would connect your account to ${type} if implemented.`,
    });
  };

  if (!profile) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-pulse text-xl">Loading connections...</div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">External Connections</h1>
        <p className="text-muted-foreground">Manage your connected accounts and services</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Connected Accounts
          </CardTitle>
          <CardDescription>
            Link your accounts to enable single sign-on and other features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {connections.map((connection) => (
              <div 
                key={connection.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-3">
                  <connection.icon className="h-6 w-6" />
                  <div>
                    <h3 className="font-medium capitalize">{connection.type}</h3>
                    <p className="text-sm text-muted-foreground">
                      {connection.connected 
                        ? `Connected to ${connection.type}` 
                        : `Not connected to ${connection.type}`}
                    </p>
                  </div>
                </div>
                <Button 
                  variant={connection.connected ? "outline" : "default"}
                  onClick={() => handleConnect(connection.type)}
                >
                  {connection.connected ? "Disconnect" : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Connect
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Connections;
