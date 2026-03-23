import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { BrainCircuit, Loader2, CheckCircle2, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-auth-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginData {
  email: string;
  password: string;
  username?: string;
}

const FEATURES = [
  "Capture tasks with priority levels",
  "Write and organize notes instantly",
  "Save tweets and YouTube videos",
  "Tag and favorite your best content",
];

export default function Login() {
  const [, navigate] = useLocation();
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<LoginData>({ defaultValues: { email: "", password: "", username: "" } });

  async function onSubmit(data: LoginData) {
    setIsPending(true);
    setError("");
    try {
      if (isRegister) {
        await register(data.email, data.password, data.username);
      } else {
        await login(data.email, data.password);
      }
      navigate("/");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col justify-between p-10"
        style={{ background: "linear-gradient(135deg, hsl(262 83% 28%) 0%, hsl(262 83% 48%) 60%, hsl(300 70% 45%) 100%)" }}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-80px] left-[-80px] w-80 h-80 rounded-full opacity-20" style={{ background: "radial-gradient(circle, white, transparent)" }} />
          <div className="absolute bottom-[-60px] right-[-60px] w-96 h-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, white, transparent)" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-5" style={{ background: "radial-gradient(circle, white, transparent)" }} />
        </div>

        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">SecondBrain</span>
          </div>
        </div>

        <div className="relative space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white leading-tight mb-3">
              Your personal<br />knowledge base
            </h2>
            <p className="text-white/70 text-sm leading-relaxed">
              Capture, organize, and resurface everything that matters — all in one place.
            </p>
          </div>

          <div className="space-y-3">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-white/80 flex-shrink-0" />
                <span className="text-white/80 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-white/90 text-xs font-semibold uppercase tracking-wider">Demo Mode</span>
            </div>
            <p className="text-white/70 text-xs leading-relaxed">
              Use any email and password to explore. All data is stored locally in your browser.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-[380px]">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="p-2 bg-primary/10 rounded-xl">
              <BrainCircuit className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-lg">SecondBrain</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-1.5">
              {isRegister ? "Create account" : "Sign in"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isRegister
                ? "Start building your second brain today"
                : "Welcome back — your knowledge awaits"}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex p-1 bg-secondary rounded-xl mb-6">
            {["Sign In", "Sign Up"].map((tab, i) => (
              <button
                key={tab}
                onClick={() => { setIsRegister(i === 1); setError(""); }}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  (i === 1) === isRegister
                    ? "bg-card shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {isRegister && (
              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                <Input
                  id="username"
                  placeholder="yourname"
                  className="h-11 rounded-xl bg-secondary/50 border-border/50 focus:bg-background transition-colors"
                  {...form.register("username")}
                />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="h-11 rounded-xl bg-secondary/50 border-border/50 focus:bg-background transition-colors"
                {...form.register("email", { required: true })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="h-11 rounded-xl bg-secondary/50 border-border/50 focus:bg-background transition-colors"
                {...form.register("password", { required: true })}
              />
            </div>

            {error && (
              <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full h-11 rounded-xl font-semibold text-sm mt-2"
              style={{ background: "linear-gradient(135deg, hsl(262 83% 52%), hsl(262 83% 62%))" }}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isRegister ? "Create Account" : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6 lg:hidden">
            Demo mode — any email & password works
          </p>
        </div>
      </div>
    </div>
  );
}
