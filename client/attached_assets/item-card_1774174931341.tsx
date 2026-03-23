import { ReactNode } from "react";
import { format } from "date-fns";
import { Star, Globe, Lock, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFavoriteMutations } from "@/hooks/use-app-mutations";
import { useGetFavorites } from "@workspace/api-client-react";

interface ItemCardProps {
  id: number;
  type: "Note" | "Tweet" | "Video";
  title?: string;
  description?: string;
  content?: string;
  link?: string;
  visibility: "public" | "private";
  date?: string;
  onEdit: () => void;
  onDelete: () => void;
  icon?: ReactNode;
}

export function ItemCard({ id, type, title, description, content, link, visibility, date, onEdit, onDelete, icon }: ItemCardProps) {
  const { data: favorites } = useGetFavorites({ content_type: type });
  const { add, remove } = useFavoriteMutations();

  const favorite = favorites?.find(f => f.content_id === id);
  const isFavorited = !!favorite;

  const handleFavoriteToggle = () => {
    if (isFavorited && favorite) {
      remove.mutate({ favoriteId: favorite.favorite_id });
    } else {
      add.mutate({ data: { content_type: type, content_id: id } });
    }
  };

  return (
    <div className="group relative flex flex-col p-6 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-xl hover:border-border transition-all duration-300 overflow-hidden">
      {/* Decorative gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-secondary text-primary">
            {icon}
          </div>
          <Badge variant={visibility === "public" ? "default" : "secondary"} className="h-6">
            {visibility === "public" ? <Globe className="w-3 h-3 mr-1" /> : <Lock className="w-3 h-3 mr-1" />}
            {visibility}
          </Badge>
        </div>
        <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" onClick={handleFavoriteToggle} className="h-8 w-8 rounded-full">
            <Star className={`w-4 h-4 ${isFavorited ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`} />
          </Button>
          <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8 rounded-full">
            <Edit className="w-4 h-4 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete} className="h-8 w-8 rounded-full hover:text-destructive">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 mb-6">
        <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2 leading-tight">
          {title || "Untitled"}
        </h3>
        
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{description}</p>
        )}
        
        {content && (
          <p className="text-sm text-muted-foreground line-clamp-4 mb-3 whitespace-pre-wrap">{content}</p>
        )}

        {link && (
          <a 
            href={link} 
            target="_blank" 
            rel="noreferrer" 
            className="text-sm text-primary hover:underline inline-flex items-center mt-2 font-medium"
          >
            Open Link →
          </a>
        )}
      </div>

      {date && (
        <div className="mt-auto pt-4 border-t border-border/50 text-xs text-muted-foreground font-medium flex justify-between items-center">
          <span>Added</span>
          <span>{format(new Date(date), "MMM d, yyyy")}</span>
        </div>
      )}
    </div>
  );
}
