
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConnectionType } from "@/types/connections";

interface ConnectionCardProps {
  connection: ConnectionType;
  onConnect: (type: string) => void;
}

export const ConnectionCard = ({ connection, onConnect }: ConnectionCardProps) => {
  return (
    <Card
      className={`transition-all duration-200 ${
        connection.status === 'coming soon' ? 'opacity-70' : 'hover:shadow-md'
      }`}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <connection.icon className="h-5 w-5" />
          {connection.name}
          {connection.status === 'coming soon' && (
            <span className="ml-2 text-xs bg-muted px-2 py-1 rounded-full">Coming Soon</span>
          )}
        </CardTitle>
        <CardDescription>
          {connection.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm">
            <div className={`mr-2 h-3 w-3 rounded-full ${
              connection.status === 'available' ? 'bg-green-500' : 'bg-gray-400'
            }`}></div>
            <span className="capitalize">{connection.status}</span>
          </div>
          <Button 
            variant={connection.status === 'available' ? "default" : "outline"}
            onClick={() => onConnect(connection.type)}
            disabled={connection.status === 'coming soon'}
          >
            {connection.status === 'available' ? "Connect" : "Unavailable"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
