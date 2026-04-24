import { useState } from "react";
import { useLocation } from "wouter";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const login = useAppStore((state) => state.login);
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    let name = username;
    let role: "passenger" | "admin" = "passenger";

    if (username === "admin") {
      name = "Alex Rivera";
      role = "admin";
    } else if (username === "john") {
      name = "John Carter";
    } else if (username === "maya") {
      name = "Maya Singh";
    } else {
      // Capitalize first letter for display name
      name = username.charAt(0).toUpperCase() + username.slice(1);
    }

    login({ id: username, username, name, role });
    toast({
      title: "Welcome back",
      description: `Logged in as ${name}`,
    });
    setLocation("/");
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-muted/30">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="mx-auto bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <Plane className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground">AeroPortal</h1>
          <p className="text-muted-foreground mt-2">Manage your journey with ease</p>
        </div>

        <Card className="shadow-lg border-border">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. john, maya, or admin"
                  data-testid="input-username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Any password works"
                  data-testid="input-password"
                />
              </div>
              <Button type="submit" className="w-full mt-2" data-testid="button-submit">
                Sign In
              </Button>
            </form>

            <div className="mt-6 p-4 bg-muted rounded-lg text-sm text-muted-foreground text-center border">
              <p className="font-medium text-foreground mb-1">Demo Credentials</p>
              <p>Passenger: <strong>john</strong> or <strong>maya</strong></p>
              <p>Admin: <strong>admin</strong></p>
              <p className="text-xs mt-2 opacity-80">(Any password is accepted)</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
