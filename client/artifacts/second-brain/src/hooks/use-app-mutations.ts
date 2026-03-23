import { useAppContext } from "@/context/app-context";

export function useTaskMutations() {
  const ctx = useAppContext();
  return {
    create: (data: Parameters<typeof ctx.addTask>[0]) => ctx.addTask(data),
    update: (id: number, data: Parameters<typeof ctx.updateTask>[1]) => ctx.updateTask(id, data),
    remove: (id: number) => ctx.removeTask(id),
  };
}

export function useNoteMutations() {
  const ctx = useAppContext();
  return {
    create: (data: Parameters<typeof ctx.addNote>[0]) => ctx.addNote(data),
    update: (id: number, data: Parameters<typeof ctx.updateNote>[1]) => ctx.updateNote(id, data),
    remove: (id: number) => ctx.removeNote(id),
  };
}

export function useTweetMutations() {
  const ctx = useAppContext();
  return {
    create: (data: Parameters<typeof ctx.addTweet>[0]) => ctx.addTweet(data),
    remove: (id: number) => ctx.removeTweet(id),
  };
}

export function useVideoMutations() {
  const ctx = useAppContext();
  return {
    create: (data: Parameters<typeof ctx.addVideo>[0]) => ctx.addVideo(data),
    remove: (id: number) => ctx.removeVideo(id),
  };
}

export function useTagMutations() {
  const ctx = useAppContext();
  return {
    create: (name: string) => ctx.addTag(name),
    remove: (id: number) => ctx.removeTag(id),
  };
}

export function useFavoriteMutations() {
  const ctx = useAppContext();
  return {
    add: (type: "Note" | "Tweet" | "Video", contentId: number) => ctx.addFavorite(type, contentId),
    remove: (id: number) => ctx.removeFavorite(id),
  };
}

export function useProfileMutations() {
  const ctx = useAppContext();
  return {
    update: (data: Parameters<typeof ctx.updateProfile>[0]) => ctx.updateProfile(data),
  };
}
