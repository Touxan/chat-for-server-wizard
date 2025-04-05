
import React, { forwardRef, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useConversations } from "@/hooks/useConversations";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

// Import our new components
import NewConversationButton from "./sidebar/NewConversationButton";
import ConversationList from "./sidebar/ConversationList";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(({ isOpen }, ref) => {
  const { groupedConversations, isLoading, addConversation, deleteConversation, renameConversation } = useConversations();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNewChat = async () => {
    const newConversation = await addConversation("New conversation");
    if (newConversation) {
      navigate(`/chat/${newConversation.id}`);
    }
  };
  
  const handleDeleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking delete
    
    try {
      // Store current path before deletion
      const currentPath = location.pathname;
      const isOnDeletedConversation = currentPath === `/chat/${id}`;
      
      console.log(`Current path: ${currentPath}, deleting conversation: ${id}`);
      console.log(`Is on deleted conversation: ${isOnDeletedConversation}`);
      
      const success = await deleteConversation(id);
      
      // Navigate if needed
      if (success && isOnDeletedConversation) {
        console.log(`Redirecting from deleted conversation ${id} to /chat`);
        // Use replace: true to prevent back button from returning to deleted conversation
        navigate('/chat', { replace: true });
      }
      
    } catch (error) {
      console.error("Error in handleDeleteConversation:", error);
    }
  };
  
  const handleRenameConversation = (chat: any, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking rename
    if (chat.id && chat.title) {
      renameConversation(chat.id, chat.title);
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
            openRenameDialog={handleRenameConversation}
            openDeleteDialog={handleDeleteConversation}
          />
        </div>
      </div>
    </div>
  );
});

Sidebar.displayName = "Sidebar";

export default Sidebar;
