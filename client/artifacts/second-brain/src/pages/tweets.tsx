import { useState } from "react";
import { AppLayout } from "@/components/layout";
import { useAppContext } from "@/context/app-context";
import { useTweetMutations } from "@/hooks/use-app-mutations";
import { ItemCard } from "@/components/item-card";
import { Plus, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Visibility } from "@/context/app-context";

export default function Tweets() {
  const { tweets } = useAppContext();
  const mutations = useTweetMutations();
  const [isOpen, setIsOpen] = useState(false);
  const [link, setLink] = useState(""); const [title, setTitle] = useState(""); const [description, setDescription] = useState(""); const [visibility, setVisibility] = useState<Visibility>("private");

  function handleCreate() {
    if (!link.trim()) return;
    mutations.create({ tweet_link: link.trim(), title: title.trim() || undefined, description: description.trim() || undefined, visibility });
    setIsOpen(false); setLink(""); setTitle(""); setDescription(""); setVisibility("private");
  }

  return (
    <AppLayout>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Twitter className="w-4 h-4 text-sky-500" />
            <span className="text-sm font-medium text-sky-500">Tweets</span>
          </div>
          <h1 className="text-2xl font-bold">Saved Tweets</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{tweets.length} saved · archive important threads</p>
        </div>
        <Button onClick={() => setIsOpen(true)} className="rounded-xl font-semibold gap-2 shadow-sm bg-sky-500 hover:bg-sky-600 text-white">
          <Plus className="w-4 h-4" /> Save Tweet
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[440px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Twitter className="w-5 h-5 text-sky-500" /> Save Tweet
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Tweet URL *</Label>
              <Input value={link} onChange={e => setLink(e.target.value)} placeholder="https://x.com/user/status/..." className="rounded-xl h-11" autoFocus />
            </div>
            <div className="space-y-1.5">
              <Label>Title <span className="text-muted-foreground">(optional)</span></Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Great thread on design..." className="rounded-xl h-11" />
            </div>
            <div className="space-y-1.5">
              <Label>Note <span className="text-muted-foreground">(optional)</span></Label>
              <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Why did you save this?" className="rounded-xl h-11" />
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
            <Button onClick={handleCreate} disabled={!link.trim()} className="rounded-xl bg-sky-500 hover:bg-sky-600 text-white">Save Tweet</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {tweets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center rounded-2xl border-2 border-dashed border-border bg-card/30">
          <div className="w-16 h-16 rounded-2xl bg-sky-500/10 flex items-center justify-center mb-4">
            <Twitter className="w-7 h-7 text-sky-500" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">No tweets saved yet</h3>
          <p className="text-sm text-muted-foreground mb-5">Save links to threads and posts from X.</p>
          <Button onClick={() => setIsOpen(true)} variant="outline" className="rounded-xl gap-2"><Plus className="w-4 h-4" /> Save your first tweet</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tweets.map(tweet => (
            <ItemCard
              key={tweet.tweet_id} id={tweet.tweet_id} type="Tweet"
              title={tweet.title} description={tweet.description} link={tweet.tweet_link}
              visibility={tweet.visibility} date={tweet.saved_at}
              icon={<Twitter className="w-4 h-4 text-sky-500" />} accentColor="from-sky-500/40"
              onDelete={() => mutations.remove(tweet.tweet_id)}
            />
          ))}
        </div>
      )}
    </AppLayout>
  );
}
