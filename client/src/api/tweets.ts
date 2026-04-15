import client from './client';
import type { Tweet } from '../types';

export const addTweet = async (
  tweet_link: string,
  title: string,
  description: string,
  visibility: boolean = true
): Promise<Tweet> => {
  const { data } = await client.post<Tweet>('/tweets', {
    tweet_link,
    title,
    description,
    visibility,
  });
  return data;
};

export const getAllTweets = async (): Promise<Tweet[]> => {
  const { data } = await client.get<Tweet[]>('/tweets');
  return data;
};

export const deleteTweet = async (tweet_id: number): Promise<void> => {
  await client.delete(`/tweets/${tweet_id}`);
};
