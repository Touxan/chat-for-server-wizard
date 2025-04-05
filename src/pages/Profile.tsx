
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { User, Building, Mail, Calendar, MessageSquare, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleReturnToChat = () => {
    navigate('/chat');
  };

  const handleChangePassword = () => {
    toast({
      title: "Password Change",
      description: "This would open a password change form if implemented.",
    });
  };

  if (!profile) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-pulse text-xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">View and manage your profile information</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {profile.first_name[0]}{profile.last_name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{profile.first_name} {profile.last_name}</CardTitle>
              <CardDescription>{profile.email}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span>{profile.email}</span>
              </div>
              
              {profile.company && (
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-muted-foreground" />
                  <span>{profile.company}</span>
                </div>
              )}
              
              <Separator />
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="mb-2 font-medium">Account Created</h3>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{format(new Date(profile.created_at), 'PPP')}</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="mb-2 font-medium">Last Connection</h3>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {profile.last_connection 
                        ? format(new Date(profile.last_connection), 'PPP') 
                        : 'No recent connections'}
                    </span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                <Button 
                  variant="outline" 
                  onClick={handleReturnToChat}
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  Return to Chat
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleChangePassword}
                  className="flex items-center gap-2"
                >
                  <Lock className="h-4 w-4" />
                  Change Password
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
