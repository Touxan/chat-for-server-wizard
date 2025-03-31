
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
        <Button variant="ghost" className="relative h-10 w-10">
          <div className="flex items-center justify-center h-9 w-9 rounded-sm border border-[hsl(var(--primary))] bg-[hsl(var(--header-accent))] text-[hsl(var(--primary))] font-mono">
            <User size={20} />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-[hsl(var(--popover))] border-[hsl(var(--border))] font-mono" align="end" forceMount>
        <DropdownMenuLabel className="text-[hsl(var(--foreground))]">user@server:~</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[hsl(var(--border))]" />
        <DropdownMenuItem className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] focus:bg-[hsl(var(--accent))]">
          <User className="mr-2 h-4 w-4" />
          <span>./profile.sh</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] focus:bg-[hsl(var(--accent))]">
          <Settings className="mr-2 h-4 w-4" />
          <span>./settings.sh</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-[hsl(var(--border))]" />
        <DropdownMenuItem className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] focus:bg-[hsl(var(--accent))]">
          <LogOut className="mr-2 h-4 w-4" />
          <span>logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
