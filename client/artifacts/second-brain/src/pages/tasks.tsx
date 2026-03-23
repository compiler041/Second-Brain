import { useState } from "react";
import { AppLayout } from "@/components/layout";
import { useAppContext } from "@/context/app-context";
import { useTaskMutations } from "@/hooks/use-app-mutations";
import { format } from "date-fns";
import { Plus, Check, Trash2, Calendar, CheckSquare, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Priority } from "@/context/app-context";

const PRIORITY_MAP: Record<Priority, { label: string; dot: string; badge: string }> = {
  urgent: { label: "🔴 Urgent", dot: "bg-red-500", badge: "bg-red-500/10 text-red-500" },
  high:   { label: "🟠 High",   dot: "bg-orange-500", badge: "bg-orange-500/10 text-orange-500" },
  medium: { label: "🟡 Medium", dot: "bg-yellow-500", badge: "bg-yellow-500/10 text-yellow-600" },
  low:    { label: "🔵 Low",    dot: "bg-blue-400",   badge: "bg-blue-500/10 text-blue-500" },
};

export default function Tasks() {
  const { tasks } = useAppContext();
  const mutations = useTaskMutations();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [filter, setFilter] = useState<"all" | "pending" | "done">("all");

  function handleCreate() {
    if (!title.trim()) return;
    mutations.create({ title: title.trim(), description: description.trim() || undefined, priority_level: priority, status: false });
    setIsOpen(false);
    setTitle(""); setDescription(""); setPriority("medium");
  }

  const filtered = tasks.filter(t =>
    filter === "all" ? true : filter === "pending" ? !t.status : t.status
  );

  const pending = tasks.filter(t => !t.status).length;
  const done = tasks.filter(t => t.status).length;

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CheckSquare className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-500">Tasks</span>
          </div>
          <h1 className="text-2xl font-bold">My Tasks</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{pending} pending · {done} completed</p>
        </div>
        <Button onClick={() => setIsOpen(true)} className="rounded-xl font-semibold gap-2 shadow-sm">
          <Plus className="w-4 h-4" /> New Task
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-2 mb-5 p-1 bg-secondary/60 rounded-xl w-fit">
        {(["all", "pending", "done"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${
              filter === f ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {f === "all" ? `All (${tasks.length})` : f === "pending" ? `Pending (${pending})` : `Done (${done})`}
          </button>
        ))}
      </div>

      {/* Task List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border-2 border-dashed border-border bg-card/30">
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
            {filter === "done" ? <Check className="w-7 h-7 text-muted-foreground" /> : <Circle className="w-7 h-7 text-muted-foreground" />}
          </div>
          <h3 className="font-semibold text-foreground mb-1">
            {filter === "done" ? "No completed tasks" : filter === "pending" ? "You're all caught up! 🎉" : "No tasks yet"}
          </h3>
          <p className="text-sm text-muted-foreground mb-5">
            {filter === "all" ? "Create your first task to get started." : ""}
          </p>
          {filter === "all" && (
            <Button onClick={() => setIsOpen(true)} variant="outline" className="rounded-xl gap-2">
              <Plus className="w-4 h-4" /> Create first task
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((task, i) => {
            const p = task.priority_level ? PRIORITY_MAP[task.priority_level] : null;
            return (
              <div
                key={task.task_id}
                className={`group flex items-start gap-4 px-5 py-4 rounded-2xl border transition-all duration-200 ${
                  task.status
                    ? "bg-secondary/20 border-border/30 opacity-60"
                    : "bg-card border-border/60 hover:border-border hover:shadow-sm"
                }`}
                style={{ animationDelay: `${i * 30}ms` }}
              >
                {/* Checkbox */}
                <button
                  onClick={() => mutations.update(task.task_id, { status: !task.status })}
                  className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    task.status
                      ? "bg-emerald-500 border-emerald-500"
                      : "border-border hover:border-primary hover:shadow-sm"
                  }`}
                >
                  {task.status && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <p className={`text-sm font-semibold ${task.status ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {task.title}
                    </p>
                    {p && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${p.badge}`}>
                        {task.priority_level}
                      </span>
                    )}
                  </div>
                  {task.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                  )}
                  {task.created_at && (
                    <p className="text-[11px] text-muted-foreground/70 mt-2 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Added {format(new Date(task.created_at), "MMM d, yyyy")}
                    </p>
                  )}
                </div>

                {/* Delete */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => mutations.remove(task.task_id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl flex-shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[460px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-blue-500" /> Create Task
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Title *</Label>
              <Input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="rounded-xl h-11"
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleCreate()}
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label>Description <span className="text-muted-foreground">(optional)</span></Label>
              <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Any extra context..." className="resize-none min-h-[80px] rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v: Priority) => setPriority(v)}>
                <SelectTrigger className="rounded-xl h-11"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-xl">
                  {(Object.entries(PRIORITY_MAP) as [Priority, typeof PRIORITY_MAP[Priority]][]).map(([key, val]) => (
                    <SelectItem key={key} value={key}>{val.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleCreate} disabled={!title.trim()} className="rounded-xl">Create Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
