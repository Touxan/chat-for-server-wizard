
import React, { forwardRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { PlusCircle, MessageCircle, ChevronDown, ChevronRight, FolderIcon, Terminal, Loader2, Trash2, Edit, MoreHorizontal } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(({ isOpen }, ref) => {
  const { groupedConversations, isLoading, addConversation, deleteConversation, renameConversation } = useConversations();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const [newTitle, setNewTitle] = useState("");
  const [editingConversationId, setEditingConversationId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingConversationId, setDeletingConversationId] = useState<string | null>(null);

  const handleNewChat = async () => {
    const newConversation = await addConversation("New conversation");
    if (newConversation) {
      navigate(`/chat/${newConversation.id}`);
    }
  };
  
  const handleDeleteConversation = async (id: string) => {
    setIsDeleteDialogOpen(false);
    setDeletingConversationId(null);

    // Stocker l'URL actuelle avant de supprimer
    const currentPath = window.location.pathname;
    const deletedConversationPath = `/chat/${id}`;
    
    const success = await deleteConversation(id);
    
    // Si la suppression a réussi et que l'utilisateur est actuellement
    // sur la conversation supprimée, rediriger vers /chat
    if (success && currentPath === deletedConversationPath) {
      console.log(`Redirecting from deleted conversation ${id} to /chat`);
      navigate('/chat', { replace: true });
    }
  };
  
  const openDeleteDialog = (id: string) => {
    setDeletingConversationId(id);
    setIsDeleteDialogOpen(true);
  };
  
  const handleRenameConversation = async (id: string) => {
    if (newTitle.trim()) {
      await renameConversation(id, newTitle);
      setEditingConversationId(null);
      setNewTitle("");
    }
  };
  
  const openRenameDialog = (chat: any) => {
    setEditingConversationId(chat.id);
    setNewTitle(chat.title);
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
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem 
                                    onClick={() => openRenameDialog(chat)}
                                    className="cursor-pointer"
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Rename
                                  </DropdownMenuItem>
                                  
                                  <DropdownMenuItem
                                    onClick={() => openDeleteDialog(chat.id)}
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
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>

      {/* Rename Dialog */}
      <Dialog open={!!editingConversationId} onOpenChange={(open) => !open && setEditingConversationId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename Conversation</DialogTitle>
            <DialogDescription>
              Enter a new name for this conversation.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-y-4 py-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="name" className="sr-only">
                Name
              </Label>
              <Input
                id="name"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter conversation name"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button variant="secondary" onClick={() => setEditingConversationId(null)} className="mr-2">
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={() => editingConversationId && handleRenameConversation(editingConversationId)}
              disabled={!newTitle.trim()}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this conversation? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingConversationId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deletingConversationId && handleDeleteConversation(deletingConversationId)}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
});

Sidebar.displayName = "Sidebar";

export default Sidebar;
