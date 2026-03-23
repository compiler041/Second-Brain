import { AppLayout } from "@/components/layout";
import { 
  useGetTasks, 
  useGetNotes, 
  useGetTweets, 
  useGetVideos, 
  useGetActivityLogs 
} from "@workspace/api-client-react";
import { format } from "date-fns";
import { CheckSquare, FileText, Twitter, Youtube, Activity, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: tasks, isLoading: l1 } = useGetTasks();
  const { data: notes, isLoading: l2 } = useGetNotes();
  const { data: tweets, isLoading: l3 } = useGetTweets();
  const { data: videos, isLoading: l4 } = useGetVideos();
  const { data: activities, isLoading: l5 } = useGetActivityLogs();

  const isLoading = l1 || l2 || l3 || l4 || l5;

  const stats = [
    { title: "Pending Tasks", value: tasks?.filter(t => !t.status).length || 0, icon: CheckSquare, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Total Notes", value: notes?.length || 0, icon: FileText, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Saved Tweets", value: tweets?.length || 0, icon: Twitter, color: "text-sky-500", bg: "bg-sky-500/10" },
    { title: "Saved Videos", value: videos?.length || 0, icon: Youtube, color: "text-rose-500", bg: "bg-rose-500/10" },
  ];

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your personal knowledge base.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i} className="p-6 border-border/50 bg-card hover:bg-secondary/20 transition-colors rounded-2xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bg}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-foreground mb-1">{stat.value}</h3>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Recent Activity
          </h2>
          <Card className="border-border/50 bg-card rounded-2xl shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="p-6 space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : activities?.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">No recent activity.</div>
            ) : (
              <div className="divide-y divide-border/50">
                {activities?.slice(0, 8).map((log) => (
                  <div key={log.log_id} className="p-4 px-6 flex items-center justify-between hover:bg-secondary/30 transition-colors">
                    <div className="flex flex-col">
                      <span className="font-medium text-sm text-foreground">
                        <span className="text-primary capitalize">{log.action_type.toLowerCase()}</span> {log.entity_name} #{log.entity_id}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">
                      {log.timestamp ? format(new Date(log.timestamp), "MMM d, h:mm a") : ""}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
        
        <div>
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl p-8 border border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-20">
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="text-primary"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2 relative z-10">Stay Consistent</h3>
            <p className="text-sm text-muted-foreground relative z-10 mb-6 leading-relaxed">
              You've completed {tasks?.filter(t => t.status).length || 0} tasks total. Keep breaking down your goals into actionable steps.
            </p>
            <div className="relative z-10 h-2 bg-background/50 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full w-[65%]" />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
