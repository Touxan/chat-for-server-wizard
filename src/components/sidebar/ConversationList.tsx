
import React from "react";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GroupedConversations } from "@/hooks/conversation/useGroupConversations";
import ConversationGroup from "./ConversationGroup";
import { Skeleton } from "@/components/ui/skeleton";

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
  if (!user) {
    return (
      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="text-center p-4 text-[hsl(var(--sidebar-text))/60]">
          Login to see your conversations
        </div>
      </ScrollArea>
    );
  }

  if (isLoading) {
    return (
      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="space-y-2 p-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="px-1 py-2">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <div className="space-y-1">
                {[1, 2].map((j) => (
                  <Skeleton key={j} className="h-8 w-full rounded-md" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  }

  if (groupedConversations.length === 0) {
    return (
      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="text-center p-4 text-[hsl(var(--sidebar-text))/60]">
          No conversations found
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-180px)]">
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
    </ScrollArea>
  );
};

export default ConversationList;
