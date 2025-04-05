
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, User, LogOut, Link } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function UserButton() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  
  const handleProfileClick = () => {
    navigate('/profile');
  };
  
  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const handleConnectionClick = () => {
    navigate('/connections');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10">
          {profile ? (
            <div className="flex items-center justify-center h-9 w-9 rounded-sm border border-[hsl(var(--primary))] bg-[hsl(var(--header-accent))] text-[hsl(var(--primary))] font-mono">
              {profile.first_name[0]}{profile.last_name[0]}
            </div>
          ) : (
            <div className="flex items-center justify-center h-9 w-9 rounded-sm border border-[hsl(var(--primary))] bg-[hsl(var(--header-accent))] text-[hsl(var(--primary))] font-mono">
              <User size={20} />
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-[hsl(var(--popover))] border-[hsl(var(--border))]" align="end" forceMount>
        <DropdownMenuLabel className="text-[hsl(var(--foreground))]">
          {profile ? `${profile.first_name} ${profile.last_name}` : 'My Account'}
        </DropdownMenuLabel>
        {profile && (
          <DropdownMenuLabel className="text-xs text-[hsl(var(--foreground-muted))]">
            {profile.email}
          </DropdownMenuLabel>
        )}
        <DropdownMenuSeparator className="bg-[hsl(var(--border))]" />
        <DropdownMenuItem 
          onClick={handleProfileClick}
          className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] focus:bg-[hsl(var(--accent))]"
        >
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleConnectionClick}
          className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] focus:bg-[hsl(var(--accent))]"
        >
          <Link className="mr-2 h-4 w-4" />
          <span>Connections</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleSettingsClick}
          className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] focus:bg-[hsl(var(--accent))]"
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-[hsl(var(--border))]" />
        <DropdownMenuItem 
          onClick={() => signOut()}
          className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] focus:bg-[hsl(var(--accent))]"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
