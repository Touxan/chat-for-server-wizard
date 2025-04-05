
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConnectionType } from "@/types/connections";
import { ProviderCard } from "./ProviderCard";

interface ConnectionCardProps {
  connection: ConnectionType;
  onConnect: (providerId: string) => void;
}

export const ConnectionCard = ({ connection, onConnect }: ConnectionCardProps) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <connection.icon className="h-5 w-5" />
          {connection.name}
        </CardTitle>
        <CardDescription>
          {connection.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        {connection.providers.map((provider) => (
          <ProviderCard
            key={provider.id}
            provider={provider}
            onConnect={(providerId) => onConnect(`${connection.type}:${providerId}`)}
          />
        ))}
      </CardContent>
    </Card>
  );
};
