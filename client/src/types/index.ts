export interface User {
  user_id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

export interface Task {
  task_id: number;
  title: string;
  description: string;
  due_date: string | null;
  priority_id: number | null;
  status: boolean;
  user_id: number;
  created_at: string;
}

export interface Note {
  note_id: number;
  title: string;
  context: string;
  visibility: boolean;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface Tweet {
  tweet_id: number;
  tweet_link: string;
  title: string;
  description: string;
  visibility: boolean;
  user_id: number;
  saved_at: string;
}

export interface YouTubeVideo {
  video_id: number;
  video_link: string;
  title: string;
  description: string;
  visibility: boolean;
  user_id: number;
  saved_at: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}
