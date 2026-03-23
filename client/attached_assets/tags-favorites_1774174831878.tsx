import { AppLayout } from "@/components/layout";
import { useGetTags, useGetFavorites, useGetNotes, useGetTasks, useGetTweets, useGetVideos } from "@workspace/api-client-react";
import { useTagMutations, useFavoriteMutations } from "@/hooks/use-app-mutations";
import { useState } from "react";
import { Tags, Star, Trash2, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function TagsFavorites() {
  const { data: tags, isLoading: tagsLoading } = useGetTags();
  const { data: favs, isLoading: favsLoading } = useGetFavorites();
  const { create: createTag, remove: removeTag } = useTagMutations();
  const { remove: removeFav } = useFavoriteMutations();

  const [newTag, setNewTag] = useState("");

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag) return;
    createTag.mutate({ data: { tag_name: newTag } }, { onSuccess: () => setNewTag("") });
  };

  return (
    <AppLayout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Tags Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
              <Tags className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold">Tags</h2>
              <p className="text-sm text-muted-foreground">Organize content across your brain.</p>
            </div>
          </div>

          <Card className="p-6 bg-card border-border/50 rounded-3xl shadow-sm mb-6">
            <form onSubmit={handleAddTag} className="flex gap-3 mb-8">
              <Input 
                value={newTag} 
                onChange={e => setNewTag(e.target.value)} 
                placeholder="New tag name..." 
                className="bg-secondary/50 border-border/50 h-11"
              />
              <Button type="submit" disabled={!newTag || createTag.isPending} className="h-11 px-6 rounded-xl">
                {createTag.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              </Button>
            </form>

            <div className="flex flex-wrap gap-3">
              {tagsLoading ? (
                <div className="w-full flex gap-2"><div className="w-20 h-8 bg-secondary rounded-full animate-pulse"/><div className="w-24 h-8 bg-secondary rounded-full animate-pulse"/></div>
              ) : tags?.length === 0 ? (
                <p className="text-muted-foreground text-sm">No tags created yet.</p>
              ) : (
                tags?.map(tag => (
                  <Badge key={tag.tag_id} variant="secondary" className="px-3 py-1.5 text-sm rounded-lg bg-secondary border border-border/50 flex items-center gap-2 group">
                    <span className="text-primary font-medium">#</span>
                    {tag.tag_name}
                    <button 
                      onClick={() => removeTag.mutate({ tagId: tag.tag_id })}
                      className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Favorites Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500">
              <Star className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold">Favorites</h2>
              <p className="text-sm text-muted-foreground">Your starred content.</p>
            </div>
          </div>

          <div className="space-y-3">
            {favsLoading ? (
              [1,2,3].map(i => <div key={i} className="h-16 bg-card rounded-2xl animate-pulse" />)
            ) : favs?.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-3xl border border-dashed border-border">
                <Star className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Star items to see them here.</p>
              </div>
            ) : (
              favs?.map(fav => (
                <div key={fav.favorite_id} className="flex items-center justify-between p-4 bg-card border border-border/50 rounded-2xl hover:border-border transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-medium">
                      <span className="text-muted-foreground mr-2">{fav.content_type}:</span>
                      <span>Item #{fav.content_id}</span>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeFav.mutate({ favoriteId: fav.favorite_id })}
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive text-muted-foreground w-8 h-8 rounded-full"
                  >
                    <Star className="w-4 h-4 fill-muted-foreground" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
