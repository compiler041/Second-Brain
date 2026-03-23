import { useState } from "react";
import { AppLayout } from "@/components/layout";
import { useGetTasks, useGetPriorities } from "@workspace/api-client-react";
import { useTaskMutations } from "@/hooks/use-app-mutations";
import { format } from "date-fns";
import { Plus, Check, Calendar, Trash2, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function Tasks() {
  const { data: tasks, isLoading } = useGetTasks();
  const { data: priorities } = useGetPriorities();
  const { create, update, remove } = useTaskMutations();

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  
  // Form state
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priorityId, setPriorityId] = useState<string>("");

  const handleCreate = () => {
    if (!title) return;
    create.mutate({
      data: {
        title,
        description: desc,
        priority_id: priorityId ? parseInt(priorityId) : undefined
      }
    }, {
      onSuccess: () => {
        setIsOpen(false);
        setTitle("");
        setDesc("");
        setPriorityId("");
      }
    });
  };

  const toggleStatus = (id: number, currentStatus: boolean) => {
    update.mutate({ taskId: id, data: { status: !currentStatus } });
  };

  const filteredTasks = tasks?.filter(t => {
    if (filter === "pending") return !t.status;
    if (filter === "completed") return t.status;
    return true;
  });

  const getPriorityColor = (level?: string) => {
    if (level === "High") return "bg-red-500/10 text-red-500 border-red-500/20";
    if (level === "Medium") return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    if (level === "Low") return "bg-green-500/10 text-green-500 border-green-500/20";
    return "bg-secondary text-muted-foreground border-border";
  };

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Tasks</h1>
          <p className="text-muted-foreground">Manage your action items.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl shadow-lg shadow-primary/20 px-6 font-semibold">
              <Plus className="w-5 h-5 mr-2" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">Create Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Buy groceries..." className="bg-secondary/50 border-border/50" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Milk, eggs, bread..." className="bg-secondary/50 border-border/50" />
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={priorityId} onValueChange={setPriorityId}>
                  <SelectTrigger className="bg-secondary/50 border-border/50">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities?.map(p => (
                      <SelectItem key={p.priority_id} value={p.priority_id.toString()}>{p.priority_level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={!title || create.isPending}>
                {create.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2 mb-6 p-1 bg-secondary inline-flex rounded-xl">
        {(["all", "pending", "completed"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-card rounded-2xl animate-pulse" />)}
        </div>
      ) : filteredTasks?.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-3xl border border-border border-dashed">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckSquare className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1">No tasks found</h3>
          <p className="text-muted-foreground">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks?.map(task => (
            <div 
              key={task.task_id}
              className={`group flex items-start gap-4 p-5 rounded-2xl border transition-all duration-200 ${task.status ? "bg-secondary/20 border-border/30 opacity-70" : "bg-card border-border shadow-sm hover:shadow-md"}`}
            >
              <button 
                onClick={() => toggleStatus(task.task_id, task.status)}
                className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.status ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground hover:border-primary"}`}
              >
                {task.status && <Check className="w-4 h-4" />}
              </button>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className={`font-semibold text-base truncate ${task.status ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {task.title}
                  </h3>
                  {task.priority_level && (
                    <Badge variant="outline" className={`h-6 text-xs border ${getPriorityColor(task.priority_level)}`}>
                      {task.priority_level}
                    </Badge>
                  )}
                </div>
                {task.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{task.description}</p>
                )}
                <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                  {task.created_at && (
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Added {format(new Date(task.created_at), "MMM d")}</span>
                  )}
                </div>
              </div>

              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" onClick={() => remove.mutate({ taskId: task.task_id })} className="text-muted-foreground hover:text-destructive rounded-full w-8 h-8">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
