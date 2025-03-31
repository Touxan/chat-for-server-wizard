
export type MessageType = {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
  command?: {
    text: string;
    description: string;
    risk: "low" | "medium" | "high";
  };
};
