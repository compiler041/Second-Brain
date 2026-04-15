import client from './client';
import type { Task } from '../types';

export const createTask = async (
  title: string,
  description: string
): Promise<Task> => {
  const { data } = await client.post<Task>('/tasks', {
    title,
    description,
  });
  return data;
};

export const getAllTasks = async (): Promise<Task[]> => {
  const { data } = await client.get<Task[]>('/tasks');
  return data;
};

export const getOneTask = async (task_id: number): Promise<Task> => {
  const { data } = await client.get<Task>(`/tasks/${task_id}`);
  return data;
};

export const updateTask = async (
  task_id: number,
  updates: { title?: string; description?: string; status?: boolean; due_date?: string | null }
): Promise<Task> => {
  const { data } = await client.put<Task>(`/tasks/${task_id}`, updates);
  return data;
};

export const deleteTask = async (task_id: number): Promise<void> => {
  await client.delete(`/tasks/${task_id}`);
};
