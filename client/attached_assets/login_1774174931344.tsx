import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BrainCircuit, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [, setLocation] = useLocation();
  const { login, register, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  });

  // If already authenticated, redirect
  if (isAuthenticated) {
    setLocation("/");
    return null;
  }

  const onLogin = (data: z.infer<typeof loginSchema>) => {
    login.mutate({ data }, {
      onSuccess: () => setLocation("/"),
      onError: (err: any) => {
        toast({
          title: "Login failed",
          description: err?.message || "Invalid credentials",
          variant: "destructive"
        });
      }
    });
  };

  const onRegister = (data: z.infer<typeof registerSchema>) => {
    register.mutate({ data }, {
      onSuccess: () => setLocation("/"),
      onError: (err: any) => {
        toast({
          title: "Registration failed",
          description: err?.message || "Could not create account",
          variant: "destructive"
        });
      }
    });
  };

  const isPending = login.isPending || register.isPending;

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left side - Visuals */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden bg-card border-r border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background z-0" />
        <img 
          src={`${import.meta.env.BASE_URL}images/auth-bg.png`} 
          alt="Abstract mesh" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-screen"
        />
        <div className="relative z-10 text-center max-w-md p-8">
          <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-primary/30 shadow-2xl shadow-primary/20 backdrop-blur-xl">
            <BrainCircuit className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-display font-bold text-foreground mb-4">Your Second Brain</h1>
          <p className="text-lg text-muted-foreground">Capture thoughts, track tasks, save inspirations. Organize your digital life in one beautifully structured place.</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center p-8 sm:p-12 lg:p-24 relative">
        <div className="max-w-md w-full mx-auto space-y-8">
          <div className="lg:hidden flex items-center gap-3 text-primary mb-12">
            <BrainCircuit className="w-8 h-8" />
            <span className="font-display font-bold text-2xl text-foreground">SecondBrain</span>
          </div>

          <div>
            <h2 className="text-3xl font-display font-bold text-foreground tracking-tight">
              {isRegister ? "Create an account" : "Welcome back"}
            </h2>
            <p className="text-muted-foreground mt-2">
              {isRegister ? "Start organizing your knowledge today." : "Enter your credentials to access your workspace."}
            </p>
          </div>

          {isRegister ? (
            <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="reg-username">Username</Label>
                <Input 
                  id="reg-username" 
                  className="h-12 bg-secondary/50 border-border/50 focus:bg-background" 
                  {...registerForm.register("username")} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-email">Email</Label>
                <Input 
                  id="reg-email" 
                  type="email" 
                  className="h-12 bg-secondary/50 border-border/50 focus:bg-background" 
                  {...registerForm.register("email")} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-password">Password</Label>
                <Input 
                  id="reg-password" 
                  type="password" 
                  className="h-12 bg-secondary/50 border-border/50 focus:bg-background" 
                  {...registerForm.register("password")} 
                />
              </div>
              <Button type="submit" className="w-full h-12 text-base rounded-xl font-semibold shadow-lg shadow-primary/20" disabled={isPending}>
                {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}
              </Button>
            </form>
          ) : (
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input 
                  id="login-email" 
                  type="email" 
                  className="h-12 bg-secondary/50 border-border/50 focus:bg-background" 
                  {...loginForm.register("email")} 
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password">Password</Label>
                </div>
                <Input 
                  id="login-password" 
                  type="password" 
                  className="h-12 bg-secondary/50 border-border/50 focus:bg-background" 
                  {...loginForm.register("password")} 
                />
              </div>
              <Button type="submit" className="w-full h-12 text-base rounded-xl font-semibold shadow-lg shadow-primary/20" disabled={isPending}>
                {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
              </Button>
            </form>
          )}

          <div className="text-center">
            <button 
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              {isRegister ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
