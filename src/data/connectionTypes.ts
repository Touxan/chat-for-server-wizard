
import { 
  Cloud, 
  BarChart, 
  Terminal, 
  GitBranch, 
  Database, 
  Server 
} from "lucide-react";
import { ConnectionType } from "@/types/connections";

// Connection types with their status and required fields
export const connectionTypes: ConnectionType[] = [
  { 
    id: 1, 
    type: 'cloud', 
    name: 'Cloud Provider',
    description: 'Connect to AWS, Google Cloud, or Azure',
    status: 'available', 
    icon: Cloud,
    fields: ['apiKey', 'endpoint'] 
  },
  { 
    id: 2, 
    type: 'metrics', 
    name: 'Metrics',
    description: 'Connect to Prometheus, Grafana, or other metrics platforms',
    status: 'available', 
    icon: BarChart,
    fields: ['apiKey', 'endpoint'] 
  },
  { 
    id: 3, 
    type: 'logs', 
    name: 'Logs',
    description: 'Connect to ELK, Loki, or other logging platforms',
    status: 'available', 
    icon: Terminal,
    fields: ['apiKey', 'username', 'password', 'endpoint'] 
  },
  { 
    id: 4, 
    type: 'code', 
    name: 'Code Repository',
    description: 'Connect to GitHub, GitLab, or other code repositories',
    status: 'available', 
    icon: GitBranch,
    fields: ['apiKey', 'username'] 
  },
  { 
    id: 5, 
    type: 'database', 
    name: 'Database',
    description: 'Connect to your database services',
    status: 'coming soon', 
    icon: Database,
    fields: [] 
  },
  { 
    id: 6, 
    type: 'server', 
    name: 'Servers',
    description: 'Connect to your server infrastructure',
    status: 'coming soon', 
    icon: Server,
    fields: [] 
  },
];
