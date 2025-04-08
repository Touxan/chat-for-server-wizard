
import { 
  Cloud, 
  BarChart, 
  Terminal, 
  GitBranch, 
  Database, 
  Server,
} from "lucide-react";
import { ConnectionType } from "@/types/connections";

// Connection types with their providers and required fields
export const connectionTypes: ConnectionType[] = [
  { 
    id: 1, 
    type: 'cloud', 
    name: 'Cloud Provider',
    description: 'Connect to your cloud infrastructure',
    icon: Cloud,
    providers: [
      { id: 'scaleway', name: 'Scaleway', logo: Cloud, status: 'available' },
      { id: 'aws', name: 'AWS', logo: Cloud, status: 'coming soon' },
      { id: 'gcp', name: 'Google Cloud', logo: Cloud, status: 'coming soon' },
      { id: 'azure', name: 'Azure', logo: Cloud, status: 'coming soon' },
      { id: 'ovh', name: 'OVH Cloud', logo: Cloud, status: 'coming soon' }
    ],
    fields: ['xAuthToken'] 
  },
  { 
    id: 2, 
    type: 'metrics', 
    name: 'Metrics',
    description: 'Connect to metrics platforms',
    icon: BarChart,
    providers: [
      { id: 'prometheus', name: 'Prometheus', logo: BarChart, status: 'coming soon' },
      { id: 'grafana', name: 'Grafana', logo: BarChart, status: 'coming soon' },
      { id: 'datadog', name: 'Datadog', logo: BarChart, status: 'coming soon' }
    ],
    fields: ['apiKey', 'endpoint'] 
  },
  { 
    id: 3, 
    type: 'logs', 
    name: 'Logs',
    description: 'Connect to logging platforms',
    icon: Terminal,
    providers: [
      { id: 'loki', name: 'Loki', logo: Terminal, status: 'coming soon' },
      { id: 'elk', name: 'ELK Stack', logo: Terminal, status: 'coming soon' },
      { id: 'fluentd', name: 'Fluentd', logo: Terminal, status: 'coming soon' }
    ],
    fields: ['apiKey', 'username', 'password', 'endpoint'] 
  },
  { 
    id: 4, 
    type: 'code', 
    name: 'Code Repository',
    description: 'Connect to code repositories',
    icon: GitBranch,
    providers: [
      { id: 'github', name: 'GitHub', logo: GitBranch, status: 'coming soon' },
      { id: 'gitlab', name: 'GitLab', logo: GitBranch, status: 'coming soon' },
      { id: 'bitbucket', name: 'Bitbucket', logo: GitBranch, status: 'coming soon' }
    ],
    fields: ['apiKey', 'username'] 
  },
  { 
    id: 5, 
    type: 'database', 
    name: 'Database',
    description: 'Connect to database services',
    icon: Database,
    providers: [
      { id: 'postgres', name: 'PostgreSQL', logo: Database, status: 'coming soon' },
      { id: 'mysql', name: 'MySQL', logo: Database, status: 'coming soon' },
      { id: 'mongodb', name: 'MongoDB', logo: Database, status: 'coming soon' }
    ],
    fields: [] 
  },
  { 
    id: 6, 
    type: 'server', 
    name: 'Servers',
    description: 'Connect to server infrastructure',
    icon: Server,
    providers: [
      { id: 'linux', name: 'Linux', logo: Server, status: 'available' },
      { id: 'windows', name: 'Windows', logo: Server, status: 'coming soon' }
    ],
    fields: ['sshPrivateKey'] 
  },
];
