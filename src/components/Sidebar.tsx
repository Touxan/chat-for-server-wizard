
import React, { forwardRef, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useConversations } from "@/hooks/useConversations";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

// Import our new components
import NewConversationButton from "./sidebar/NewConversationButton";
import ConversationList from "./sidebar/ConversationList";
import RenameDialog from "./sidebar/RenameDialog";
import DeleteDialog from "./sidebar/DeleteDialog";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(({ isOpen }, ref) => {
  const { groupedConversations, isLoading, addConversation, deleteConversation, renameConversation } = useConversations();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [newTitle, setNewTitle] = useState("");
  const [editingConversationId, setEditingConversationId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingConversationId, setDeletingConversationId] = useState<string | null>(null);
  const [isProcessingDelete, setIsProcessingDelete] = useState(false);

  const handleNewChat = async () => {
    const newConversation = await addConversation("New conversation");
    if (newConversation) {
      navigate(`/chat/${newConversation.id}`);
    }
  };
  
  const handleDeleteConversation = async () => {
    if (isProcessingDelete || !deletingConversationId) return;
    
    try {
      setIsProcessingDelete(true);
      
      // Store current path before deletion
      const currentPath = location.pathname;
      const isOnDeletedConversation = currentPath === `/chat/${deletingConversationId}`;
      
      console.log(`Current path: ${currentPath}, deleting conversation: ${deletingConversationId}`);
      console.log(`Is on deleted conversation: ${isOnDeletedConversation}`);
      
      const success = await deleteConversation(deletingConversationId);
      
      // Reset state first to avoid UI freeze
      setIsDeleteDialogOpen(false);
      
      // Navigate if needed AFTER closing the dialog
      if (success && isOnDeletedConversation) {
        console.log(`Redirecting from deleted conversation ${deletingConversationId} to /chat`);
        // Use replace: true to prevent back button from returning to deleted conversation
        navigate('/chat', { replace: true });
      }
      
      // Complete reset of state
      setDeletingConversationId(null);
      
    } catch (error) {
      console.error("Error in handleDeleteConversation:", error);
      // Ensure dialog is closed even on error
      setIsDeleteDialogOpen(false);
    } finally {
      setIsProcessingDelete(false);
    }
  };
  
  const openDeleteDialog = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking delete
    setDeletingConversationId(id);
    setIsDeleteDialogOpen(true);
  };
  
  const handleRenameConversation = () => {
    if (editingConversationId && newTitle.trim()) {
      renameConversation(editingConversationId, newTitle);
      setEditingConversationId(null);
      setNewTitle("");
    }
  };
  
  const openRenameDialog = (chat: any, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking rename
    setEditingConversationId(chat.id);
    setNewTitle(chat.title);
  };

  const closeRenameDialog = () => {
    setEditingConversationId(null);
    setNewTitle("");
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeletingConversationId(null);
  };

  return (
    <div
      ref={ref}
      className={`${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } fixed top-0 left-0 h-full bg-[hsl(var(--sidebar-bg))] shadow-xl w-80 transition-transform duration-300 ease-in-out z-40 pt-16 text-[hsl(var(--sidebar-text))] font-mono`}
    >
      <div className="p-4">
        <NewConversationButton 
          onClick={handleNewChat} 
          disabled={!user} 
        />
        
        <Separator className="my-4 bg-[hsl(var(--sidebar-hover))/30]" />
        
        <div className="mb-6">
          <h2 className="text-xs uppercase font-mono text-[hsl(var(--primary))] mb-3 tracking-wider">~/chat_logs</h2>
          
          <ConversationList 
            user={user}
            isLoading={isLoading}
            groupedConversations={groupedConversations}
            openRenameDialog={openRenameDialog}
            openDeleteDialog={openDeleteDialog}
          />
        </div>
      </div>

      {/* Dialogs */}
      <RenameDialog 
        isOpen={!!editingConversationId}
        onClose={closeRenameDialog}
        newTitle={newTitle}
        onTitleChange={setNewTitle}
        onRename={handleRenameConversation}
      />

      <DeleteDialog 
        isOpen={isDeleteDialogOpen}
        isProcessingDelete={isProcessingDelete}
        onCancel={closeDeleteDialog}
        onConfirm={handleDeleteConversation}
      />
    </div>
  );
});

Sidebar.displayName = "Sidebar";

export default Sidebar;
