
import React, { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, MessageCircle } from "lucide-react";

interface ChatHistoryItem {
  id: string;
  title: string;
  date: string;
}

const ChatHistory: ChatHistoryItem[] = [
  { id: "1", title: "Server restart procedure", date: "2 hours ago" },
  { id: "2", title: "Database backup", date: "Yesterday" },
  { id: "3", title: "Security audit", date: "3 days ago" },
  { id: "4", title: "Network configuration", date: "Last week" },
  { id: "5", title: "Performance tuning", date: "2 weeks ago" },
];

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(({ isOpen }, ref) => {
  return (
    <div
      ref={ref}
      className={`${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } fixed top-0 left-0 h-full bg-white shadow-lg w-80 transition-transform duration-300 ease-in-out z-40 pt-16`}
    >
      <div className="p-4">
        <Button className="w-full bg-[#38B2AC] hover:bg-[#2C9A94] mb-4">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Chat
        </Button>
        <Separator className="my-4" />
        <h2 className="text-sm font-medium text-gray-500 mb-2">CHAT HISTORY</h2>
        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="space-y-1">
            {ChatHistory.map((chat) => (
              <Button
                key={chat.id}
                variant="ghost"
                className="w-full justify-start text-left font-normal"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                <div className="flex-1 overflow-hidden">
                  <div className="truncate">{chat.title}</div>
                  <p className="text-xs text-gray-500">{chat.date}</p>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
});

Sidebar.displayName = "Sidebar";

export default Sidebar;
