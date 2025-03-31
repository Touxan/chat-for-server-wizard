
import React from "react";
import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/UserButton";
import { Menu, SunMoon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className="bg-[hsl(var(--header-bg))] text-white p-4 flex justify-between items-center border-b border-white/10">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className="text-white hover:bg-[hsl(var(--header-accent))] mr-2"
        >
          <Menu size={22} />
        </Button>
        <h1 className="text-xl font-semibold">Server Wizard</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-white hover:bg-[hsl(var(--header-accent))]"
        >
          <SunMoon size={20} />
        </Button>
        <UserButton />
      </div>
    </header>
  );
};

export default Header;
