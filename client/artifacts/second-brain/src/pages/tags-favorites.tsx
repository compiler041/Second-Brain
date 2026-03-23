import { useState } from "react";
import { AppLayout } from "@/components/layout";
import { useAppContext } from "@/context/app-context";
import { useTagMutations, useFavoriteMutations } from "@/hooks/use-app-mutations";
import { Tags, Star, Trash2, Plus, FileText, Twitter, Youtube, X, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

const TYPE_CONFIG = {
  Note: { icon: FileText, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  Tweet: { icon: Twitter, color: "text-sky-500", bg: "bg-sky-500/10" },
  Video: { icon: Youtube, color: "text-red-500", bg: "bg-red-500/10" },
};

export default function TagsFavorites() {
  const { tags, favorites, notes, tweets, videos } = useAppContext();
  const tagMutations = useTagMutations();
  const favMutations = useFavoriteMutations();
  const [newTag, setNewTag] = useState("");
  const [activeTab, setActiveTab] = useState<"tags" | "favorites">("tags");

  function handleAddTag(e: React.FormEvent) {
    e.preventDefault();
    if (!newTag.trim()) return;
    tagMutations.create(newTag.trim());
    setNewTag("");
  }

  function getFavContent(fav: typeof favorites[0]) {
    if (fav.content_type === "Note") return notes.find(n => n.note_id === fav.content_id);
    if (fav.content_type === "Tweet") return tweets.find(t => t.tweet_id === fav.content_id);
    if (fav.content_type === "Video") return videos.find(v => v.video_id === fav.content_id);
    return null;
  }

  function getFavLink(fav: typeof favorites[0]) {
    if (fav.content_type === "Tweet") return tweets.find(t => t.tweet_id === fav.content_id)?.tweet_link;
    if (fav.content_type === "Video") return videos.find(v => v.video_id === fav.content_id)?.video_link;
    return null;
  }

  return (
    <AppLayout>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Tags className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-medium text-amber-500">Organize</span>
        </div>
        <h1 className="text-2xl font-bold">Tags & Favorites</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{tags.length} tags · {favorites.length} favorites</p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 p-1 bg-secondary/60 rounded-xl w-fit mb-6">
        {(["tags", "favorites"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
              activeTab === tab ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "tags" ? <Hash className="w-4 h-4" /> : <Star className="w-4 h-4" />}
            {tab === "tags" ? `Tags (${tags.length})` : `Favorites (${favorites.length})`}
          </button>
        ))}
      </div>

      {activeTab === "tags" && (
        <div>
          {/* Add tag form */}
          <form onSubmit={handleAddTag} className="flex gap-2 mb-6">
            <div className="relative flex-1 max-w-md">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                placeholder="Add a new tag..."
                className="rounded-xl h-11 pl-9"
              />
            </div>
            <Button type="submit" disabled={!newTag.trim()} className="h-11 rounded-xl px-5 gap-2">
              <Plus className="w-4 h-4" /> Add Tag
            </Button>
          </form>

          {tags.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border-2 border-dashed border-border bg-card/30">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-4">
                <Hash className="w-7 h-7 text-amber-500" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">No tags yet</h3>
              <p className="text-sm text-muted-foreground">Create tags to organize your content.</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <div
                  key={tag.tag_id}
                  className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border/60 hover:border-border hover:shadow-sm transition-all"
                >
                  <Hash className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium text-foreground">{tag.tag_name}</span>
                  <button
                    onClick={() => tagMutations.remove(tag.tag_id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 text-muted-foreground hover:text-red-500 rounded-md p-0.5"
                    title="Remove tag"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "favorites" && (
        <div>
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border-2 border-dashed border-border bg-card/30">
              <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-4">
                <Star className="w-7 h-7 text-yellow-500 fill-yellow-500" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">No favorites yet</h3>
              <p className="text-sm text-muted-foreground">Star notes, tweets, or videos to pin them here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {favorites.map(fav => {
                const content = getFavContent(fav);
                if (!content) return null;
                const link = getFavLink(fav);
                const title = "title" in content ? content.title : undefined;
                const cfg = TYPE_CONFIG[fav.content_type];
                const Icon = cfg.icon;
                return (
                  <div key={fav.favorite_id} className="group flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/60 hover:border-border hover:shadow-sm transition-all">
                    <div className={`p-2.5 rounded-xl flex-shrink-0 ${cfg.bg}`}>
                      <Icon className={`w-5 h-5 ${cfg.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{title || "Untitled"}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>{fav.content_type}</span>
                        <span className="text-[11px] text-muted-foreground">{format(new Date(fav.created_at), "MMM d")}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {link && (
                        <a href={link} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline font-medium px-2 py-1 rounded-lg hover:bg-primary/10 transition-colors">
                          Open
                        </a>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => favMutations.remove(fav.favorite_id)}
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}
