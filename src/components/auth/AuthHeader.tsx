
import { Terminal } from "lucide-react";

const AuthHeader = () => {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center">
        <Terminal className="h-12 w-12 text-[hsl(var(--primary))]" />
      </div>
      <h2 className="mt-6 text-3xl font-bold font-mono text-[hsl(var(--foreground))]">
        Server_Wizard.sh
      </h2>
      <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
        Manage your servers efficiently
      </p>
    </div>
  );
};

export default AuthHeader;
