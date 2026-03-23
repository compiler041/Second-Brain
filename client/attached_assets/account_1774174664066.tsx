import { AppLayout } from "@/components/layout";
import { useAuth } from "@/hooks/use-auth-wrapper";
import { useProfileMutations } from "@/hooks/use-app-mutations";
import { useState, useEffect } from "react";
import { User as UserIcon, Mail, Shield, Loader2, Save } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

export default function Account() {
  const { user } = useAuth();
  const { update } = useProfileMutations();
  
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user]);

  const handleSave = () => {
    update.mutate({ data: { username, email } });
  };

  const isChanged = user?.username !== username || user?.email !== email;

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-2">Account Settings</h1>
        <p className="text-muted-foreground">Manage your profile and preferences.</p>
      </div>

      <div className="max-w-2xl">
        <Card className="bg-card border-border/50 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border/50">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary/40 to-primary/10 flex items-center justify-center border-4 border-background shadow-xl">
              <span className="text-4xl font-bold text-primary">
                {user?.username?.[0]?.toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{user?.username}</h2>
              <div className="flex items-center text-muted-foreground mt-1 text-sm">
                <Shield className="w-4 h-4 mr-1.5 text-primary" />
                {user?.role || "Member"} since {user?.created_at ? format(new Date(user.created_at), "MMMM yyyy") : "recently"}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-muted-foreground ml-1">Username</Label>
              <div className="relative">
                <UserIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  value={username} 
                  onChange={e => setUsername(e.target.value)} 
                  className="pl-10 h-12 bg-secondary/30 border-border/50 text-base rounded-xl" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground ml-1">Email Address</Label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  type="email"
                  className="pl-10 h-12 bg-secondary/30 border-border/50 text-base rounded-xl" 
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button 
                onClick={handleSave} 
                disabled={!isChanged || update.isPending}
                className="h-12 px-8 rounded-xl font-semibold shadow-lg shadow-primary/20"
              >
                {update.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
