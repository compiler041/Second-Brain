import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout";
import { useAuth } from "@/hooks/use-auth-wrapper";
import { useProfileMutations } from "@/hooks/use-app-mutations";
import { User as UserIcon, Mail, Save, Activity, Shield, Moon, Sun, BrainCircuit, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppContext } from "@/context/app-context";
import { formatDistanceToNow } from "date-fns";

export default function Account() {
  const { user } = useAuth();
  const { updateProfile } = useProfileMutations();
  const { activityLogs, tasks, notes, tweets, videos, favorites } = useAppContext();

  const [username, setUsername] = useState(user?.username ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [saved, setSaved] = useState(false);
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));

  useEffect(() => {
    if (user) { setUsername(user.username); setEmail(user.email); }
  }, [user]);

  function handleSave() {
    updateProfile({ username, email });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  }

  const initials = username ? username.slice(0, 2).toUpperCase() : "SB";
  const isChanged = username !== (user?.username ?? "") || email !== (user?.email ?? "");

  const contentStats = [
    { label: "Tasks", value: tasks.length, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Notes", value: notes.length, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Tweets", value: tweets.length, color: "text-sky-500", bg: "bg-sky-500/10" },
    { label: "Videos", value: videos.length, color: "text-red-500", bg: "bg-red-500/10" },
  ];

  return (
    <AppLayout>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <UserIcon className="w-4 h-4 text-pink-500" />
          <span className="text-sm font-medium text-pink-500">Account</span>
        </div>
        <h1 className="text-2xl font-bold">My Account</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your profile and preferences</p>
      </div>

      {/* Profile Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-6 border border-border/60">
        <div className="h-24 bg-gradient-to-r from-primary/20 via-violet-500/10 to-pink-500/10" />
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-8 mb-4">
            <Avatar className="h-16 w-16 border-4 border-card flex-shrink-0">
              <AvatarFallback
                className="text-white text-xl font-bold"
                style={{ background: "linear-gradient(135deg, hsl(262 83% 52%), hsl(300 70% 55%))" }}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="pb-1">
              <h2 className="text-lg font-bold text-foreground">{user?.username}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {contentStats.map(s => (
              <div key={s.label} className={`${s.bg} rounded-xl p-3 text-center`}>
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left — profile form */}
        <div className="lg:col-span-3 space-y-5">
          {/* Edit Profile */}
          <div className="rounded-2xl border border-border/60 bg-card p-6">
            <h3 className="font-semibold mb-5 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-primary" /> Edit Profile
            </h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <UserIcon className="w-3.5 h-3.5 text-muted-foreground" /> Username
                </Label>
                <Input value={username} onChange={e => setUsername(e.target.value)} className="h-11 rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground" /> Email Address
                </Label>
                <Input value={email} onChange={e => setEmail(e.target.value)} type="email" className="h-11 rounded-xl" />
              </div>
              <Button onClick={handleSave} disabled={!isChanged && !saved} className="h-10 px-6 rounded-xl gap-2">
                {saved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Preferences */}
          <div className="rounded-2xl border border-border/60 bg-card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" /> Preferences
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                <div className="flex items-center gap-3">
                  {dark ? <Moon className="w-5 h-5 text-violet-400" /> : <Sun className="w-5 h-5 text-amber-400" />}
                  <div>
                    <p className="text-sm font-medium">{dark ? "Dark Mode" : "Light Mode"}</p>
                    <p className="text-xs text-muted-foreground">Toggle your preferred theme</p>
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`relative w-12 h-6 rounded-full transition-all duration-300 ${dark ? "bg-primary" : "bg-border"}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300 ${dark ? "translate-x-6" : "translate-x-0.5"}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                <div className="flex items-center gap-3">
                  <BrainCircuit className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-sm font-medium">Data & Privacy</p>
                    <p className="text-xs text-muted-foreground">All data stored locally in browser</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600">Local Only</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right — activity log */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-border/60 bg-card h-full p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" /> Activity Log
              <span className="ml-auto text-xs font-normal text-muted-foreground">{activityLogs.length} events</span>
            </h3>
            {activityLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No activity yet.</p>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-[400px] pr-1">
                {activityLogs.map((log, i) => (
                  <div key={log.log_id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-primary mt-1 flex-shrink-0" />
                      {i < activityLogs.length - 1 && <div className="w-px flex-1 bg-border/60 mt-1" />}
                    </div>
                    <div className="pb-3 min-w-0">
                      <p className="text-xs font-semibold text-foreground">{log.action}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{log.description}</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                        {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
