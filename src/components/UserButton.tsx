
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, User, LogOut } from "lucide-react";

export function UserButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-[hsl(var(--chat-bubble-user))] text-white">
            <User size={20} />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-[hsl(var(--popover))] border-[hsl(var(--border))]" align="end" forceMount>
        <DropdownMenuLabel className="text-[hsl(var(--foreground))]">My Account</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[hsl(var(--border))]" />
        <DropdownMenuItem className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] focus:bg-[hsl(var(--accent))]">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] focus:bg-[hsl(var(--accent))]">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-[hsl(var(--border))]" />
        <DropdownMenuItem className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] focus:bg-[hsl(var(--accent))]">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
