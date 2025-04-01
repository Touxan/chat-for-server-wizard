
import React from "react";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GroupedConversations } from "@/hooks/useConversations";
import ConversationGroup from "./ConversationGroup";

interface ConversationListProps {
  user: any;
  isLoading: boolean;
  groupedConversations: GroupedConversations[];
  openRenameDialog: (chat: any, e: React.MouseEvent) => void;
  openDeleteDialog: (id: string, e: React.MouseEvent) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  user,
  isLoading,
  groupedConversations,
  openRenameDialog,
  openDeleteDialog,
}) => {
  return (
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
          {groupedConversations.map((group, index) => (
            <ConversationGroup
              key={index}
              group={group}
              index={index}
              openRenameDialog={openRenameDialog}
              openDeleteDialog={openDeleteDialog}
            />
          ))}
        </div>
      )}
    </ScrollArea>
  );
};

export default ConversationList;
