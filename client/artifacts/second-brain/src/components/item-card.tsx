import { ReactNode } from "react";
import { format } from "date-fns";
import { Star, Globe, Lock, Trash2, Edit, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavoriteMutations } from "@/hooks/use-app-mutations";
import { useAppContext } from "@/context/app-context";

interface ItemCardProps {
  id: number;
  type: "Note" | "Tweet" | "Video";
  title?: string;
  description?: string;
  content?: string;
  link?: string;
  visibility: "public" | "private";
  date?: string;
  onEdit?: () => void;
  onDelete: () => void;
  icon?: ReactNode;
  accentColor?: string;
}

export function ItemCard({ id, type, title, description, content, link, visibility, date, onEdit, onDelete, icon, accentColor = "from-primary/30" }: ItemCardProps) {
  const { favorites } = useAppContext();
  const { add, remove } = useFavoriteMutations();

  const favorite = favorites.find(f => f.content_type === type && f.content_id === id);
  const isFavorited = !!favorite;

  function handleFavoriteToggle() {
    if (isFavorited && favorite) remove(favorite.favorite_id);
    else add(type, id);
  }

  return (
    <div className="group relative flex flex-col rounded-2xl bg-card border border-border/60 overflow-hidden hover:shadow-md hover:border-border transition-all duration-200">
      {/* Top accent bar */}
      <div className={`h-0.5 bg-gradient-to-r ${accentColor} to-transparent`} />

      <div className="flex flex-col flex-1 p-5">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-secondary flex-shrink-0">
              {icon}
            </div>
            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
              visibility === "public"
                ? "bg-emerald-500/10 text-emerald-600"
                : "bg-secondary text-muted-foreground"
            }`}>
              {visibility === "public" ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
              {visibility}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-150 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFavoriteToggle}
              className={`h-7 w-7 rounded-xl transition-all ${isFavorited ? "text-yellow-400 hover:text-yellow-500" : "text-muted-foreground hover:text-yellow-400"}`}
              title={isFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Star className={`w-3.5 h-3.5 ${isFavorited ? "fill-current" : ""}`} />
            </Button>
            {onEdit && (
              <Button variant="ghost" size="icon" onClick={onEdit} className="h-7 w-7 rounded-xl text-muted-foreground hover:text-foreground" title="Edit">
                <Edit className="w-3.5 h-3.5" />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onDelete} className="h-7 w-7 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10" title="Delete">
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-foreground mb-2 line-clamp-2 leading-snug">
            {title || "Untitled"}
          </h3>
          {description && (
            <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed mb-2">{description}</p>
          )}
          {content && (
            <p className="text-xs text-muted-foreground line-clamp-4 leading-relaxed whitespace-pre-wrap">{content}</p>
          )}
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline mt-2 font-medium"
            >
              <ExternalLink className="w-3 h-3" />
              Open Link
            </a>
          )}
        </div>

        {/* Footer */}
        {date && (
          <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground/70">Added</span>
            <span className="text-[11px] font-medium text-muted-foreground">{format(new Date(date), "MMM d, yyyy")}</span>
          </div>
        )}
      </div>
    </div>
  );
}
