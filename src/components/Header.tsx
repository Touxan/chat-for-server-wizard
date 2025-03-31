
import React from "react";
import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/UserButton";
import { Menu } from "lucide-react";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  return (
    <header className="bg-[#1A2B42] text-white p-4 flex justify-between items-center">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className="text-white hover:bg-[#2B3D54]"
        >
          <Menu size={24} />
        </Button>
        <h1 className="ml-3 text-xl font-semibold">Server Wizard</h1>
      </div>
      <UserButton />
    </header>
  );
};

export default Header;
