
// Define connection credential types
export type ConnectionCredentials = {
  apiKey: string;
  username: string;
  password: string;
  endpoint: string;
};

// Define the connection type structure
export type ConnectionType = {
  id: number;
  type: string;
  name: string;
  description: string;
  status: 'available' | 'coming soon';
  icon: React.ElementType;
  fields: Array<keyof ConnectionCredentials>;
};
