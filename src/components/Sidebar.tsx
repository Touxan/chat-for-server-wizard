
import React, { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { PlusCircle, MessageCircle, ChevronDown, ChevronRight, FolderIcon, Terminal, Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useConversations, GroupedConversations } from "@/hooks/useConversations";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(({ isOpen }, ref) => {
  const { groupedConversations, isLoading, addConversation, deleteConversation } = useConversations();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { conversationId } = useParams();

  const handleNewChat = async () => {
    const newConversation = await addConversation("New conversation");
    if (newConversation) {
      navigate(`/chat/${newConversation.id}`);
    }
  };
  
  const handleDeleteConversation = async (id: string) => {
    const success = await deleteConversation(id);
    if (success && id === conversationId) {
      navigate('/chat');
    }
  };

  return (
    <div
      ref={ref}
      className={`${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } fixed top-0 left-0 h-full bg-[hsl(var(--sidebar-bg))] shadow-xl w-80 transition-transform duration-300 ease-in-out z-40 pt-16 text-[hsl(var(--sidebar-text))] font-mono`}
    >
      <div className="p-4">
        <Button 
          className="w-full bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 shadow-md mb-4 py-5 text-white font-mono rounded-sm"
          onClick={handleNewChat}
          disabled={!user}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New conversation
        </Button>
        <Separator className="my-4 bg-[hsl(var(--sidebar-hover))/30]" />
        
        <div className="mb-6">
          <h2 className="text-xs uppercase font-mono text-[hsl(var(--primary))] mb-3 tracking-wider">~/chat_logs</h2>
          <ScrollArea className="h-[calc(100vh-180px)]">
            {!user ? (
              <div className="text-center p-4 text-[hsl(var(--sidebar-text))/60]">
                Login to see your conversations
              </div>
            ) : isLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin text-[hsl(var(--primary))]" />
                <span className="ml-2 text-[hsl(var(--sidebar-text))/60]">Loading...</span>
              </div>
            ) : groupedConversations.length === 0 ? (
              <div className="text-center p-4 text-[hsl(var(--sidebar-text))/60]">
                No conversations found
              </div>
            ) : (
              <div className="space-y-2">
                {groupedConversations.map((group: GroupedConversations, index) => (
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
                              className="flex-1 justify-start text-left font-mono text-sm text-[hsl(var(--sidebar-text))/80] hover:bg-[hsl(var(--sidebar-hover))] hover:text-[hsl(var(--sidebar-text))] rounded-sm"
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
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this conversation? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteConversation(chat.id)}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
});

Sidebar.displayName = "Sidebar";

export default Sidebar;
