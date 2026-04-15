import client from './client';
import type { Note } from '../types';

export const createNote = async (
  title: string,
  content: string,
  visibility: boolean = true
): Promise<Note> => {
  const { data } = await client.post('/notes', {
    title,
    context: content,
    visibility,
  });
  return data;
};

export const getAllNotes = async (): Promise<Note[]> => {
  const { data } = await client.get<Note[]>('/notes');
  return data;
};

export const deleteNote = async (note_id: number): Promise<void> => {
  await client.delete(`/notes/${note_id}`);
};
