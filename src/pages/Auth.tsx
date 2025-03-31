
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm, { LoginFormValues } from "@/components/auth/LoginForm";
import RegisterForm, { RegisterFormValues } from "@/components/auth/RegisterForm";
import AuthHeader from "@/components/auth/AuthHeader";

const Auth = () => {
  const { signIn, signUp, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("login");

  const onLoginSubmit = async (data: LoginFormValues) => {
    await signIn(data.email, data.password);
  };

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    await signUp(
      data.email,
      data.password,
      data.firstName,
      data.lastName,
      data.company || null
    );
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md space-y-8 p-6 bg-[hsl(var(--card))] rounded-lg shadow-lg border border-[hsl(var(--border))]">
          <AuthHeader />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm isLoading={isLoading} onSubmit={onLoginSubmit} />
            </TabsContent>
            
            <TabsContent value="register">
              <RegisterForm isLoading={isLoading} onSubmit={onRegisterSubmit} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Auth;
