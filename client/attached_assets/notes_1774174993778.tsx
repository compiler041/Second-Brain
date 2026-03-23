import { useState } from "react";
import { AppLayout } from "@/components/layout";
import { useGetNotes } from "@workspace/api-client-react";
import { useNoteMutations } from "@/hooks/use-app-mutations";
import { ItemCard } from "@/components/item-card";
import { Plus, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function Notes() {
  const { data: notes, isLoading } = useGetNotes();
  const { create, remove } = useNoteMutations();
  
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("private");

  const handleCreate = () => {
    if (!title) return;
    create.mutate({
      data: { title, content, visibility }
    }, {
      onSuccess: () => {
        setIsOpen(false);
        setTitle("");
        setContent("");
        setVisibility("private");
      }
    });
  };

  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Notes</h1>
          <p className="text-muted-foreground">Jot down thoughts and long-form writing.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl shadow-lg shadow-primary/20 px-6 font-semibold">
              <Plus className="w-5 h-5 mr-2" />
              New Note
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">Create Note</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Meeting notes..." className="bg-secondary/50" />
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Start typing..." className="min-h-[150px] bg-secondary/50 resize-none" />
              </div>
              <div className="space-y-2">
                <Label>Visibility</Label>
                <Select value={visibility} onValueChange={(v: any) => setVisibility(v)}>
                  <SelectTrigger className="bg-secondary/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={!title || create.isPending}>
                {create.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Note"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-64 bg-card rounded-2xl animate-pulse border border-border" />)}
        </div>
      ) : notes?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-card/30 rounded-3xl border border-dashed border-border mt-8">
          <img src={`${import.meta.env.BASE_URL}images/empty-state.png`} alt="Empty" className="w-48 h-48 object-cover mb-6 opacity-80" />
          <h3 className="text-xl font-bold text-foreground mb-2">No notes yet</h3>
          <p className="text-muted-foreground max-w-sm">Capture your first thought. Notes are great for meetings, ideas, and drafts.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {notes?.map(note => (
            <ItemCard
              key={note.note_id}
              id={note.note_id}
              type="Note"
              title={note.title}
              content={note.content}
              visibility={note.visibility}
              date={note.created_at}
              icon={<FileText className="w-5 h-5" />}
              onEdit={() => {}} // simplified for brevity
              onDelete={() => remove.mutate({ noteId: note.note_id })}
            />
          ))}
        </div>
      )}
    </AppLayout>
  );
}
