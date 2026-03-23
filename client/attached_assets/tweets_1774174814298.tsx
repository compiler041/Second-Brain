import { useState } from "react";
import { AppLayout } from "@/components/layout";
import { useGetTweets } from "@workspace/api-client-react";
import { useTweetMutations } from "@/hooks/use-app-mutations";
import { ItemCard } from "@/components/item-card";
import { Plus, Twitter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function Tweets() {
  const { data: tweets, isLoading } = useGetTweets();
  const { create, remove } = useTweetMutations();
  
  const [isOpen, setIsOpen] = useState(false);
  const [link, setLink] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("private");

  const handleCreate = () => {
    if (!link) return;
    create.mutate({
      data: { tweet_link: link, title, description: desc, visibility }
    }, {
      onSuccess: () => {
        setIsOpen(false);
        setLink(""); setTitle(""); setDesc("");
        setVisibility("private");
      }
    });
  };

  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Saved Tweets</h1>
          <p className="text-muted-foreground">Archive important threads and posts.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl shadow-lg shadow-primary/20 px-6 font-semibold bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white">
              <Plus className="w-5 h-5 mr-2" />
              Save Tweet
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">Save Tweet</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Tweet URL *</Label>
                <Input value={link} onChange={e => setLink(e.target.value)} placeholder="https://x.com/..." className="bg-secondary/50" />
              </div>
              <div className="space-y-2">
                <Label>Title (Optional)</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Great thread on design" className="bg-secondary/50" />
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
              <Button onClick={handleCreate} disabled={!link || create.isPending} className="bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white">
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
      ) : tweets?.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-3xl border border-border border-dashed mt-8">
          <div className="w-16 h-16 bg-[#1DA1F2]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Twitter className="w-8 h-8 text-[#1DA1F2]" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1">No tweets saved</h3>
          <p className="text-muted-foreground">Keep your favorite posts safe here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {tweets?.map(tweet => (
            <ItemCard
              key={tweet.tweet_id}
              id={tweet.tweet_id}
              type="Tweet"
              title={tweet.title}
              description={tweet.description}
              link={tweet.tweet_link}
              visibility={tweet.visibility}
              date={tweet.saved_at}
              icon={<Twitter className="w-5 h-5 text-[#1DA1F2]" />}
              onEdit={() => {}}
              onDelete={() => remove.mutate({ tweetId: tweet.tweet_id })}
            />
          ))}
        </div>
      )}
    </AppLayout>
  );
}
