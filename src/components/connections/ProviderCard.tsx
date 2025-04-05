
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Provider } from "@/types/connections";

interface ProviderCardProps {
  provider: Provider;
  onConnect: (providerId: string) => void;
}

export const ProviderCard = ({ provider, onConnect }: ProviderCardProps) => {
  return (
    <Card
      className={`transition-all duration-200 ${
        provider.status === 'coming soon' ? 'opacity-70' : 'hover:shadow-md'
      }`}
    >
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
            <provider.logo className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="font-medium">{provider.name}</div>
            {provider.status === 'coming soon' && (
              <Badge variant="outline" className="mt-1">Coming Soon</Badge>
            )}
          </div>
        </div>
        <Button 
          variant={provider.status === 'available' ? "default" : "outline"}
          size="sm"
          onClick={() => onConnect(provider.id)}
          disabled={provider.status === 'coming soon'}
        >
          {provider.status === 'available' ? "Connect" : "Unavailable"}
        </Button>
      </CardContent>
    </Card>
  );
};
