
// Define connection credential types
export type ConnectionCredentials = {
  apiKey: string;
  username: string;
  password: string;
  endpoint: string;
  xAuthToken: string;
  sshPrivateKey: string;
};

// Define a provider structure
export type Provider = {
  id: string;
  name: string;
  logo: React.ElementType;
  status: 'available' | 'coming soon';
};

// Define the connection type structure
export type ConnectionType = {
  id: number;
  type: string;
  name: string;
  description: string;
  icon: React.ElementType;
  providers: Provider[];
  fields: Array<keyof ConnectionCredentials>;
};
