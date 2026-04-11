import client from './client';
import type { AuthResponse } from '../types';

export const signup = async (
  username: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  const { data } = await client.post<AuthResponse>('/users/signup', {
    username,
    email,
    password,
  });
  return data;
};

export const signin = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const { data } = await client.post<AuthResponse>('/users/signin', {
    email,
    password,
  });
  return data;
};
