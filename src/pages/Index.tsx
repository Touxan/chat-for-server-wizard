
import React from "react";
import { Button } from "@/components/ui/button";
import { Terminal, Server, Shield, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A2B42] to-[#2D3748] text-white">
      <div className="container max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Server Wizard</h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Your AI assistant for managing Scaleway servers efficiently and securely
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-8 mb-16">
          <Button 
            className="bg-[#38B2AC] hover:bg-[#2C9A94] text-lg py-6 px-8"
            onClick={() => navigate("/chat")}
          >
            Start chatting <ArrowRight className="ml-2" />
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-[#2A3F5F] p-6 rounded-lg">
            <div className="bg-[#38B2AC] w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Terminal className="text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Command Generation</h3>
            <p className="text-gray-300">
              Get expert-crafted commands for managing your Scaleway servers, with clear explanations and risk assessments.
            </p>
          </div>

          <div className="bg-[#2A3F5F] p-6 rounded-lg">
            <div className="bg-[#38B2AC] w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Server className="text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Server Management</h3>
            <p className="text-gray-300">
              Easily restart services, update systems, configure network settings, and manage resources with expert guidance.
            </p>
          </div>

          <div className="bg-[#2A3F5F] p-6 rounded-lg">
            <div className="bg-[#38B2AC] w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Shield className="text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Security First</h3>
            <p className="text-gray-300">
              All commands come with clear risk assessments and explicit approval requirements for potentially destructive operations.
            </p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-400 mb-4">
            Voice-enabled assistant for effortless server management
          </p>
          <Button 
            variant="outline" 
            className="border-[#38B2AC] text-[#38B2AC] hover:bg-[#38B2AC] hover:text-white"
            onClick={() => navigate("/chat")}
          >
            Try it now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
