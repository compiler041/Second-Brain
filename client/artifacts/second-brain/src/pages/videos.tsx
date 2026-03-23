import { useState } from "react";
import { AppLayout } from "@/components/layout";
import { useAppContext } from "@/context/app-context";
import { useVideoMutations } from "@/hooks/use-app-mutations";
import { ItemCard } from "@/components/item-card";
import { Plus, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Visibility } from "@/context/app-context";

export default function Videos() {
  const { videos } = useAppContext();
  const mutations = useVideoMutations();
  const [isOpen, setIsOpen] = useState(false);
  const [link, setLink] = useState(""); const [title, setTitle] = useState(""); const [description, setDescription] = useState(""); const [visibility, setVisibility] = useState<Visibility>("private");

  function handleCreate() {
    if (!link.trim()) return;
    mutations.create({ video_link: link.trim(), title: title.trim() || undefined, description: description.trim() || undefined, visibility });
    setIsOpen(false); setLink(""); setTitle(""); setDescription(""); setVisibility("private");
  }

  return (
    <AppLayout>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Youtube className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-red-500">Videos</span>
          </div>
          <h1 className="text-2xl font-bold">Saved Videos</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{videos.length} saved · bookmark to watch later</p>
        </div>
        <Button onClick={() => setIsOpen(true)} className="rounded-xl font-semibold gap-2 shadow-sm bg-red-600 hover:bg-red-700 text-white">
          <Plus className="w-4 h-4" /> Save Video
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[440px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Youtube className="w-5 h-5 text-red-500" /> Save Video
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Video URL *</Label>
              <Input value={link} onChange={e => setLink(e.target.value)} placeholder="https://youtube.com/watch?v=..." className="rounded-xl h-11" autoFocus />
            </div>
            <div className="space-y-1.5">
              <Label>Title <span className="text-muted-foreground">(optional)</span></Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Video title..." className="rounded-xl h-11" />
            </div>
            <div className="space-y-1.5">
              <Label>Description <span className="text-muted-foreground">(optional)</span></Label>
              <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Why save this?" className="rounded-xl h-11" />
            </div>
            <div className="space-y-1.5">
              <Label>Visibility</Label>
              <Select value={visibility} onValueChange={(v: Visibility) => setVisibility(v)}>
                <SelectTrigger className="rounded-xl h-11"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="private">🔒 Private</SelectItem>
                  <SelectItem value="public">🌐 Public</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleCreate} disabled={!link.trim()} className="rounded-xl bg-red-600 hover:bg-red-700 text-white">Save Video</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center rounded-2xl border-2 border-dashed border-border bg-card/30">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">
            <Youtube className="w-7 h-7 text-red-500" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">No videos saved yet</h3>
          <p className="text-sm text-muted-foreground mb-5">Save YouTube links to watch and learn later.</p>
          <Button onClick={() => setIsOpen(true)} variant="outline" className="rounded-xl gap-2"><Plus className="w-4 h-4" /> Save your first video</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map(vid => (
            <ItemCard
              key={vid.video_id} id={vid.video_id} type="Video"
              title={vid.title} description={vid.description} link={vid.video_link}
              visibility={vid.visibility} date={vid.saved_at}
              icon={<Youtube className="w-4 h-4 text-red-500" />} accentColor="from-red-500/40"
              onDelete={() => mutations.remove(vid.video_id)}
            />
          ))}
        </div>
      )}
    </AppLayout>
  );
}
