
import React from "react";
import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/UserButton";
import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className="bg-[hsl(var(--header-bg))] text-[hsl(var(--header-text))] p-4 flex justify-between items-center border-b border-[hsl(var(--header-accent))] shadow-md z-50">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className="text-[hsl(var(--header-text))] hover:bg-[hsl(var(--header-accent))] mr-3"
        >
          <Menu size={22} />
        </Button>
        <h1 className="text-xl font-semibold">Server Wizard</h1>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-[hsl(var(--header-text))] hover:bg-[hsl(var(--header-accent))] rounded-full"
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
