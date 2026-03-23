import { useState } from "react";
import { AppLayout } from "@/components/layout";
import { useGetVideos } from "@workspace/api-client-react";
import { useVideoMutations } from "@/hooks/use-app-mutations";
import { ItemCard } from "@/components/item-card";
import { Plus, Youtube, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function Videos() {
  const { data: videos, isLoading } = useGetVideos();
  const { create, remove } = useVideoMutations();
  
  const [isOpen, setIsOpen] = useState(false);
  const [link, setLink] = useState("");
  const [title, setTitle] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("private");

  const handleCreate = () => {
    if (!link) return;
    create.mutate({
      data: { video_link: link, title, visibility }
    }, {
      onSuccess: () => {
        setIsOpen(false);
        setLink(""); setTitle("");
        setVisibility("private");
      }
    });
  };

  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Saved Videos</h1>
          <p className="text-muted-foreground">Keep track of tutorials, talks, and inspirations.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl shadow-lg shadow-red-500/20 px-6 font-semibold bg-red-600 hover:bg-red-700 text-white">
              <Plus className="w-5 h-5 mr-2" />
              Save Video
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">Save YouTube Video</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>YouTube URL *</Label>
                <Input value={link} onChange={e => setLink(e.target.value)} placeholder="https://youtube.com/watch?v=..." className="bg-secondary/50" />
              </div>
              <div className="space-y-2">
                <Label>Title (Optional)</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="React 19 Tutorial" className="bg-secondary/50" />
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
              <Button onClick={handleCreate} disabled={!link || create.isPending} className="bg-red-600 hover:bg-red-700 text-white">
                {create.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-48 bg-card rounded-2xl animate-pulse border border-border" />)}
        </div>
      ) : videos?.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-3xl border border-border border-dashed mt-8">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Youtube className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1">No videos saved</h3>
          <p className="text-muted-foreground">Save links to watch later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {videos?.map(vid => (
            <ItemCard
              key={vid.video_id}
              id={vid.video_id}
              type="Video"
              title={vid.title}
              description={vid.description}
              link={vid.video_link}
              visibility={vid.visibility}
              date={vid.saved_at}
              icon={<Youtube className="w-5 h-5 text-red-500" />}
              onEdit={() => {}}
              onDelete={() => remove.mutate({ videoId: vid.video_id })}
            />
          ))}
        </div>
      )}
    </AppLayout>
  );
}
