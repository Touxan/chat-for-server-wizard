
export type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company: string | null;
  last_connection: string;
  created_at: string;
};

export type Conversation = {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  category: string;
};

export type Message = {
  id: string;
  conversation_id: string;
  content: string;
  is_user: boolean;
  command: {
    text: string;
    description: string;
    risk: "low" | "medium" | "high";
  } | null;
  timestamp: string;
};
