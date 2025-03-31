
import React from "react";
import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/UserButton";
import { Menu, Moon, Sun, Terminal } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className="bg-[hsl(var(--header-bg))] text-[hsl(var(--header-text))] p-3 flex justify-between items-center border-b border-[hsl(var(--header-accent))] z-50 terminal-text">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className="text-[hsl(var(--header-text))] hover:bg-[hsl(var(--header-accent))] mr-3"
        >
          <Menu size={22} />
        </Button>
        <div className="flex items-center">
          <Terminal size={18} className="mr-2 text-[hsl(var(--primary))]" />
          <h1 className="text-xl font-mono font-semibold">Server_Wizard.sh</h1>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-[hsl(var(--header-text))] hover:bg-[hsl(var(--header-accent))]"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
        <UserButton />
      </div>
    </header>
  );
};

export default Header;
