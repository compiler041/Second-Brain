import { AppLayout } from "@/components/layout";
import { useAppContext } from "@/context/app-context";
import { useAuth } from "@/hooks/use-auth-wrapper";
import { format, formatDistanceToNow } from "date-fns";
import {
  CheckSquare, FileText, Twitter, Youtube, Activity,
  Star, ArrowRight, TrendingUp, Zap, Clock,
} from "lucide-react";
import { Link } from "wouter";

function StatCard({ title, value, icon: Icon, iconColor, iconBg, href, trend }: {
  title: string; value: number; icon: React.ElementType;
  iconColor: string; iconBg: string; href: string; trend?: string;
}) {
  return (
    <Link href={href}>
      <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 hover:shadow-lg hover:shadow-black/5 hover:border-border transition-all duration-200 cursor-pointer">
        <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-[0.04] -translate-y-8 translate-x-8 transition-transform group-hover:translate-x-4 group-hover:-translate-y-4"
          style={{ background: `var(--icon-color)` }} />
        <div className="flex items-start justify-between mb-4">
          <div className={`p-2.5 rounded-xl ${iconBg}`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" />
        </div>
        <p className="text-3xl font-bold text-foreground tabular-nums">{value}</p>
        <p className="text-xs font-medium text-muted-foreground mt-1">{title}</p>
        {trend && <p className="text-[11px] text-emerald-500 mt-1.5 flex items-center gap-1"><TrendingUp className="w-3 h-3" />{trend}</p>}
      </div>
    </Link>
  );
}

export default function Dashboard() {
  const { tasks, notes, tweets, videos, activityLogs, favorites } = useAppContext();
  const { user } = useAuth();

  const pendingTasks = tasks.filter(t => !t.status).length;
  const completedTasks = tasks.filter(t => t.status).length;
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const name = user?.username ? `, ${user.username}` : "";

  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-primary">Dashboard</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground">{greeting}{name} 👋</h1>
        <p className="text-muted-foreground mt-1 text-sm">{format(new Date(), "EEEE, MMMM d")} · {pendingTasks} tasks pending</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Pending Tasks" value={pendingTasks} icon={CheckSquare} iconColor="text-blue-500" iconBg="bg-blue-500/10" href="/tasks" />
        <StatCard title="Notes" value={notes.length} icon={FileText} iconColor="text-emerald-500" iconBg="bg-emerald-500/10" href="/notes" />
        <StatCard title="Saved Tweets" value={tweets.length} icon={Twitter} iconColor="text-sky-500" iconBg="bg-sky-500/10" href="/tweets" />
        <StatCard title="Videos" value={videos.length} icon={Youtube} iconColor="text-red-500" iconBg="bg-red-500/10" href="/videos" />
      </div>

      {/* Progress Banner */}
      {tasks.length > 0 && (
        <div className="rounded-2xl p-5 mb-8 border border-border/60 bg-gradient-to-r from-primary/5 to-violet-500/5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground mb-1">Task completion</p>
            <div className="h-2 bg-secondary rounded-full w-full max-w-sm overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-violet-400 transition-all duration-700"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{completedTasks} of {tasks.length} completed</p>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="text-2xl font-bold text-primary">{completionRate}%</p>
            <p className="text-xs text-muted-foreground">completion rate</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Recent Activity
            </h2>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
            {activityLogs.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground text-sm">No activity yet. Start adding content!</div>
            ) : (
              <div>
                {activityLogs.slice(0, 8).map((log, i) => (
                  <div key={log.log_id} className={`flex items-center gap-4 px-5 py-3.5 hover:bg-secondary/40 transition-colors ${i !== 0 ? "border-t border-border/40" : ""}`}>
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Activity className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{log.action}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{log.description}</p>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground whitespace-nowrap">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Upcoming Tasks */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold">Upcoming</h2>
              <Link href="/tasks">
                <span className="text-xs text-primary hover:underline flex items-center gap-1 font-medium">
                  All tasks <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
              {tasks.filter(t => !t.status).length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-2xl mb-1">🎉</p>
                  <p className="text-sm font-medium text-foreground">All caught up!</p>
                  <p className="text-xs text-muted-foreground mt-1">No pending tasks.</p>
                </div>
              ) : (
                tasks.filter(t => !t.status).slice(0, 5).map((task, i) => (
                  <div key={task.task_id} className={`flex items-center gap-3 px-4 py-3 ${i !== 0 ? "border-t border-border/40" : ""}`}>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      task.priority_level === "urgent" ? "bg-red-500" :
                      task.priority_level === "high" ? "bg-orange-500" :
                      task.priority_level === "medium" ? "bg-yellow-500" : "bg-blue-400"
                    }`} />
                    <p className="text-sm text-foreground font-medium truncate flex-1">{task.title}</p>
                    {task.priority_level && (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize flex-shrink-0 ${
                        task.priority_level === "urgent" ? "bg-red-500/10 text-red-500" :
                        task.priority_level === "high" ? "bg-orange-500/10 text-orange-500" :
                        task.priority_level === "medium" ? "bg-yellow-500/10 text-yellow-600" :
                        "bg-blue-500/10 text-blue-500"
                      }`}>
                        {task.priority_level}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div>
            <h2 className="text-base font-bold mb-3">Quick Stats</h2>
            <div className="rounded-2xl border border-border/60 bg-card p-4 space-y-3">
              {[
                { label: "Tasks completed", value: completedTasks, suffix: "" },
                { label: "Favorites starred", value: favorites.length, icon: <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" /> },
                { label: "Public notes", value: notes.filter(n => n.visibility === "public").length, suffix: "" },
                { label: "Total content items", value: notes.length + tweets.length + videos.length, suffix: "" },
              ].map((stat, i) => (
                <div key={i} className={`flex justify-between items-center ${i !== 0 ? "pt-3 border-t border-border/40" : ""}`}>
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                  <div className="flex items-center gap-1">
                    {stat.icon}
                    <span className="text-sm font-bold text-foreground">{stat.value}{stat.suffix}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
