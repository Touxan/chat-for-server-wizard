
import React from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, FolderIcon, Terminal, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GroupedConversations } from "@/hooks/conversation/useGroupConversations";
import { useNavigate, useParams } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface ConversationGroupProps {
  group: GroupedConversations;
  index: number;
  openRenameDialog: (chat: any, e: React.MouseEvent) => void;
  openDeleteDialog: (id: string, e: React.MouseEvent) => void;
}

const ConversationGroup: React.FC<ConversationGroupProps> = ({
  group,
  index,
  openRenameDialog,
  openDeleteDialog
}) => {
  const navigate = useNavigate();
  const { conversationId } = useParams();

  return (
    <Collapsible key={index} defaultOpen={index < 2}>
      <div className="flex items-center mb-1">
        <CollapsibleTrigger className="flex items-center w-full text-sm text-[hsl(var(--sidebar-text))/80] hover:text-[hsl(var(--sidebar-text))]">
          <span className="flex items-center w-full">
            <ChevronDown className="h-4 w-4 mr-1 group-data-[state=closed]:hidden group-data-[state=open]:block" />
            <ChevronRight className="h-4 w-4 mr-1 group-data-[state=closed]:block group-data-[state=open]:hidden" />
            <FolderIcon className="h-4 w-4 mr-2 text-[hsl(var(--primary))]" />
            <span>/{group.title}/</span>
          </span>
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent>
        <div className="ml-6 space-y-1">
          {group.chats.map((chat) => (
            <div key={chat.id} className="flex group">
              <Button
                variant="ghost"
                className={cn(
                  "flex-1 justify-start text-left font-mono text-sm text-[hsl(var(--sidebar-text))/80] hover:bg-[hsl(var(--sidebar-hover))] hover:text-[hsl(var(--sidebar-text))] rounded-sm",
                  chat.id === conversationId && "bg-[hsl(var(--sidebar-hover))] text-[hsl(var(--sidebar-text))]"
                )}
                onClick={() => navigate(`/chat/${chat.id}`)}
              >
                <Terminal className="mr-2 h-4 w-4 text-[hsl(var(--primary))]" />
                <div className="flex-1 overflow-hidden">
                  <div className="truncate">{chat.title}</div>
                  <p className="text-xs text-[hsl(var(--sidebar-text))/60]">
                    {new Date(chat.created_at).toLocaleDateString()}
                  </p>
                </div>
              </Button>
              
              <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="hover:bg-[hsl(var(--sidebar-hover))]"
                      onClick={(e) => e.stopPropagation()} // Prevent navigation
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={(e: any) => openRenameDialog(chat, e)}
                      className="cursor-pointer"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Rename
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem
                      onClick={(e: any) => openDeleteDialog(chat.id, e)}
                      className="text-red-500 focus:text-red-500 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ConversationGroup;
