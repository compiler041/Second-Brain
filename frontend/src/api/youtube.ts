import client from './client';
import type { YouTubeVideo } from '../types';

export const addVideo = async (
  video_link: string,
  title: string,
  description: string
): Promise<YouTubeVideo> => {
  const { data } = await client.post<YouTubeVideo>('/yt', {
    video_link,
    title,
    description,
  });
  return data;
};

export const getAllVideos = async (): Promise<YouTubeVideo[]> => {
  const { data } = await client.get<YouTubeVideo[]>('/yt');
  return data;
};

export const deleteVideo = async (video_id: number): Promise<void> => {
  await client.delete(`/yt/${video_id}`);
};
