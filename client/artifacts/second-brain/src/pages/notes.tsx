import { useState } from "react";
import { AppLayout } from "@/components/layout";
import { useAppContext } from "@/context/app-context";
import { useNoteMutations } from "@/hooks/use-app-mutations";
import { ItemCard } from "@/components/item-card";
import { Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Note, Visibility } from "@/context/app-context";

export default function Notes() {
  const { notes } = useAppContext();
  const mutations = useNoteMutations();
  const [isOpen, setIsOpen] = useState(false);
  const [editNote, setEditNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("private");

  function openCreate() {
    setEditNote(null); setTitle(""); setContent(""); setVisibility("private");
    setIsOpen(true);
  }

  function openEdit(note: Note) {
    setEditNote(note); setTitle(note.title); setContent(note.content ?? ""); setVisibility(note.visibility);
    setIsOpen(true);
  }

  function handleSave() {
    if (!title.trim()) return;
    if (editNote) mutations.update(editNote.note_id, { title: title.trim(), content: content.trim() || undefined, visibility });
    else mutations.create({ title: title.trim(), content: content.trim() || undefined, visibility });
    setIsOpen(false);
  }

  return (
    <AppLayout>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-500">Notes</span>
          </div>
          <h1 className="text-2xl font-bold">My Notes</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{notes.length} notes · {notes.filter(n => n.visibility === "public").length} public</p>
        </div>
        <Button onClick={openCreate} className="rounded-xl font-semibold gap-2 shadow-sm">
          <Plus className="w-4 h-4" /> New Note
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[540px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-500" />
              {editNote ? "Edit Note" : "Create Note"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Title *</Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Note title..." className="rounded-xl h-11" autoFocus />
            </div>
            <div className="space-y-1.5">
              <Label>Content <span className="text-muted-foreground">(optional)</span></Label>
              <Textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Write your note here..." className="min-h-[140px] resize-none rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label>Visibility</Label>
              <Select value={visibility} onValueChange={(v: Visibility) => setVisibility(v)}>
                <SelectTrigger className="rounded-xl h-11"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="private">🔒 Private — only you can see this</SelectItem>
                  <SelectItem value="public">🌐 Public — visible to everyone</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleSave} disabled={!title.trim()} className="rounded-xl">
              {editNote ? "Save Changes" : "Create Note"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center rounded-2xl border-2 border-dashed border-border bg-card/30">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
            <FileText className="w-7 h-7 text-emerald-500" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">No notes yet</h3>
          <p className="text-sm text-muted-foreground mb-5">Capture your first thought or idea.</p>
          <Button onClick={openCreate} variant="outline" className="rounded-xl gap-2">
            <Plus className="w-4 h-4" /> Write your first note
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map(note => (
            <ItemCard
              key={note.note_id}
              id={note.note_id}
              type="Note"
              title={note.title}
              content={note.content}
              visibility={note.visibility}
              date={note.created_at}
              icon={<FileText className="w-4 h-4 text-emerald-500" />}
              accentColor="from-emerald-500/40"
              onEdit={() => openEdit(note)}
              onDelete={() => mutations.remove(note.note_id)}
            />
          ))}
        </div>
      )}
    </AppLayout>
  );
}
