
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Link2, 
  Cloud, 
  BarChart, 
  FileCode, 
  GitBranch, 
  Database, 
  Server, 
  Terminal, 
  Lock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const Connections = () => {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentConnection, setCurrentConnection] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [credentials, setCredentials] = useState({
    apiKey: "",
    username: "",
    password: "",
    endpoint: ""
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  // Connection types with their status and required fields
  const connections = [
    { 
      id: 1, 
      type: 'cloud', 
      name: 'Cloud Provider',
      description: 'Connect to AWS, Google Cloud, or Azure',
      status: 'available', 
      icon: Cloud,
      fields: ['apiKey', 'endpoint'] 
    },
    { 
      id: 2, 
      type: 'metrics', 
      name: 'Metrics',
      description: 'Connect to Prometheus, Grafana, or other metrics platforms',
      status: 'available', 
      icon: BarChart,
      fields: ['apiKey', 'endpoint'] 
    },
    { 
      id: 3, 
      type: 'logs', 
      name: 'Logs',
      description: 'Connect to ELK, Loki, or other logging platforms',
      status: 'available', 
      icon: Terminal,
      fields: ['apiKey', 'username', 'password', 'endpoint'] 
    },
    { 
      id: 4, 
      type: 'code', 
      name: 'Code Repository',
      description: 'Connect to GitHub, GitLab, or other code repositories',
      status: 'available', 
      icon: GitBranch,
      fields: ['apiKey', 'username'] 
    },
    { 
      id: 5, 
      type: 'database', 
      name: 'Database',
      description: 'Connect to your database services',
      status: 'coming soon', 
      icon: Database,
      fields: [] 
    },
    { 
      id: 6, 
      type: 'server', 
      name: 'Servers',
      description: 'Connect to your server infrastructure',
      status: 'coming soon', 
      icon: Server,
      fields: [] 
    },
  ];

  // Handle opening the connection dialog
  const handleConnect = (type: string) => {
    const connectionConfig = connections.find(c => c.type === type);
    
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

  // Handle saving credentials
  const handleSaveCredentials = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    // Get the current connection configuration
    const connectionConfig = connections.find(c => c.type === currentConnection);
    if (!connectionConfig) return;
    
    try {
      // Create an object with only the required fields
      const credentialsToSave = connectionConfig.fields.reduce((obj, field) => {
        obj[field] = credentials[field as keyof typeof credentials];
        return obj;
      }, {} as Record<string, string>);
      
      // Save to Supabase
      const { error } = await supabase
        .from('connections')
        .upsert({
          user_id: user.id,
          type: currentConnection,
          credentials: credentialsToSave
        }, {
          onConflict: 'user_id,type'
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

      <div className="grid gap-6 md:grid-cols-2">
        {connections.map((connection) => (
          <Card
            key={connection.id}
            className={`transition-all duration-200 ${
              connection.status === 'coming soon' ? 'opacity-70' : 'hover:shadow-md'
            }`}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <connection.icon className="h-5 w-5" />
                {connection.name}
                {connection.status === 'coming soon' && (
                  <span className="ml-2 text-xs bg-muted px-2 py-1 rounded-full">Coming Soon</span>
                )}
              </CardTitle>
              <CardDescription>
                {connection.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm">
                  <div className={`mr-2 h-3 w-3 rounded-full ${
                    connection.status === 'available' ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                  <span className="capitalize">{connection.status}</span>
                </div>
                <Button 
                  variant={connection.status === 'available' ? "default" : "outline"}
                  onClick={() => handleConnect(connection.type)}
                  disabled={connection.status === 'coming soon'}
                >
                  {connection.status === 'available' ? "Connect" : "Unavailable"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Credentials Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Connect to {connections.find(c => c.type === currentConnection)?.name}
            </DialogTitle>
            <DialogDescription>
              Provide the necessary credentials to connect your {connections.find(c => c.type === currentConnection)?.name.toLowerCase()}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {currentConnection && connections.find(c => c.type === currentConnection)?.fields.map((field) => (
              <div key={field} className="grid gap-2">
                <Label htmlFor={field} className="capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</Label>
                <Input
                  id={field}
                  name={field}
                  type={field.includes('password') ? 'password' : 'text'}
                  value={credentials[field as keyof typeof credentials]}
                  onChange={handleInputChange}
                  placeholder={`Enter your ${field.replace(/([A-Z])/g, ' $1').trim()}`}
                />
              </div>
            ))}
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleSaveCredentials} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Connection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Connections;
