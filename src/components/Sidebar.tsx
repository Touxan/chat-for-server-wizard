
import React, { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { PlusCircle, MessageCircle, ChevronDown, ChevronRight, FolderIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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

// Group chats by date category
const groupedChats = [
  {
    title: "Today",
    chats: ChatHistory.filter(chat => chat.date.includes("hours")),
  },
  {
    title: "Yesterday",
    chats: ChatHistory.filter(chat => chat.date.includes("Yesterday")),
  },
  {
    title: "Last Week",
    chats: ChatHistory.filter(chat => 
      chat.date.includes("days") || 
      chat.date.includes("week")),
  },
  {
    title: "Older",
    chats: ChatHistory.filter(chat => chat.date.includes("weeks")),
  }
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
      } fixed top-0 left-0 h-full bg-gradient-to-r from-[#1A2B42] to-[#2C3E50] shadow-xl w-80 transition-transform duration-300 ease-in-out z-40 pt-16 text-white`}
    >
      <div className="p-4">
        <Button className="w-full bg-gradient-to-r from-[#38B2AC] to-[#319795] hover:from-[#2C9A94] hover:to-[#2C9A94] shadow-md mb-4 py-6 text-white font-medium">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Chat
        </Button>
        <Separator className="my-4 bg-white/10" />
        
        <div className="mb-6">
          <h2 className="text-xs uppercase font-semibold text-gray-300 mb-3 tracking-wider">CHAT HISTORY</h2>
          <ScrollArea className="h-[calc(100vh-180px)]">
            <div className="space-y-2">
              {groupedChats.map((group, index) => (
                <Collapsible key={index} defaultOpen={index < 2}>
                  <div className="flex items-center mb-1">
                    <CollapsibleTrigger className="flex items-center w-full text-sm text-gray-300 hover:text-white">
                      {/* Fix: Use a React element instead of a function that returns an element */}
                      <span className="flex items-center w-full">
                        <ChevronDown className="h-4 w-4 mr-1 group-data-[state=closed]:hidden group-data-[state=open]:block" />
                        <ChevronRight className="h-4 w-4 mr-1 group-data-[state=closed]:block group-data-[state=open]:hidden" />
                        <FolderIcon className="h-4 w-4 mr-2" />
                        <span>{group.title}</span>
                      </span>
                    </CollapsibleTrigger>
                  </div>
                  
                  <CollapsibleContent>
                    <div className="ml-6 space-y-1">
                      {group.chats.map((chat) => (
                        <Button
                          key={chat.id}
                          variant="ghost"
                          className="w-full justify-start text-left font-normal text-gray-200 hover:bg-white/10 hover:text-white rounded-md"
                        >
                          <MessageCircle className="mr-2 h-4 w-4 text-[#38B2AC]" />
                          <div className="flex-1 overflow-hidden">
                            <div className="truncate">{chat.title}</div>
                            <p className="text-xs text-gray-400">{chat.date}</p>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
});

Sidebar.displayName = "Sidebar";

export default Sidebar;
