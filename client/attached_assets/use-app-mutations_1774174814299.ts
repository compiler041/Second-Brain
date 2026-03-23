import { useQueryClient } from "@tanstack/react-query";
import {
  useCreateTask, useUpdateTask, useDeleteTask, getGetTasksQueryKey,
  useCreateNote, useUpdateNote, useDeleteNote, getGetNotesQueryKey,
  useCreateTweet, useUpdateTweet, useDeleteTweet, getGetTweetsQueryKey,
  useCreateVideo, useUpdateVideo, useDeleteVideo, getGetVideosQueryKey,
  useCreateTag, useDeleteTag, getGetTagsQueryKey,
  useAddFavorite, useRemoveFavorite, getGetFavoritesQueryKey,
  useUpdateProfile, getGetMeQueryKey, getGetActivityLogsQueryKey
} from "@workspace/api-client-react";

// Centralized wrappers to handle cache invalidation consistently
export function useTaskMutations() {
  const qc = useQueryClient();
  const onSucc = () => {
    qc.invalidateQueries({ queryKey: getGetTasksQueryKey() });
    qc.invalidateQueries({ queryKey: getGetActivityLogsQueryKey() });
  };
  return {
    create: useCreateTask({ mutation: { onSuccess: onSucc } }),
    update: useUpdateTask({ mutation: { onSuccess: onSucc } }),
    remove: useDeleteTask({ mutation: { onSuccess: onSucc } })
  };
}

export function useNoteMutations() {
  const qc = useQueryClient();
  const onSucc = () => {
    qc.invalidateQueries({ queryKey: getGetNotesQueryKey() });
    qc.invalidateQueries({ queryKey: getGetActivityLogsQueryKey() });
  };
  return {
    create: useCreateNote({ mutation: { onSuccess: onSucc } }),
    update: useUpdateNote({ mutation: { onSuccess: onSucc } }),
    remove: useDeleteNote({ mutation: { onSuccess: onSucc } })
  };
}

export function useTweetMutations() {
  const qc = useQueryClient();
  const onSucc = () => {
    qc.invalidateQueries({ queryKey: getGetTweetsQueryKey() });
    qc.invalidateQueries({ queryKey: getGetActivityLogsQueryKey() });
  };
  return {
    create: useCreateTweet({ mutation: { onSuccess: onSucc } }),
    update: useUpdateTweet({ mutation: { onSuccess: onSucc } }),
    remove: useDeleteTweet({ mutation: { onSuccess: onSucc } })
  };
}

export function useVideoMutations() {
  const qc = useQueryClient();
  const onSucc = () => {
    qc.invalidateQueries({ queryKey: getGetVideosQueryKey() });
    qc.invalidateQueries({ queryKey: getGetActivityLogsQueryKey() });
  };
  return {
    create: useCreateVideo({ mutation: { onSuccess: onSucc } }),
    update: useUpdateVideo({ mutation: { onSuccess: onSucc } }),
    remove: useDeleteVideo({ mutation: { onSuccess: onSucc } })
  };
}

export function useTagMutations() {
  const qc = useQueryClient();
  const onSucc = () => {
    qc.invalidateQueries({ queryKey: getGetTagsQueryKey() });
    qc.invalidateQueries({ queryKey: getGetActivityLogsQueryKey() });
  };
  return {
    create: useCreateTag({ mutation: { onSuccess: onSucc } }),
    remove: useDeleteTag({ mutation: { onSuccess: onSucc } })
  };
}

export function useFavoriteMutations() {
  const qc = useQueryClient();
  const onSucc = () => {
    qc.invalidateQueries({ queryKey: getGetFavoritesQueryKey() });
    qc.invalidateQueries({ queryKey: getGetActivityLogsQueryKey() });
  };
  return {
    add: useAddFavorite({ mutation: { onSuccess: onSucc } }),
    remove: useRemoveFavorite({ mutation: { onSuccess: onSucc } })
  };
}

export function useProfileMutations() {
  const qc = useQueryClient();
  return {
    update: useUpdateProfile({
      mutation: {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getGetMeQueryKey() });
          qc.invalidateQueries({ queryKey: getGetActivityLogsQueryKey() });
        }
      }
    })
  };
}
