import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Priority = "low" | "medium" | "high" | "urgent";
export type Visibility = "public" | "private";

export interface Task {
  task_id: number;
  title: string;
  description?: string;
  status: boolean;
  priority_level?: Priority;
  created_at: string;
}

export interface Note {
  note_id: number;
  title: string;
  content?: string;
  visibility: Visibility;
  created_at: string;
}

export interface Tweet {
  tweet_id: number;
  tweet_link: string;
  title?: string;
  description?: string;
  visibility: Visibility;
  saved_at: string;
}

export interface Video {
  video_id: number;
  video_link: string;
  title?: string;
  description?: string;
  visibility: Visibility;
  saved_at: string;
}

export interface Tag {
  tag_id: number;
  tag_name: string;
}

export interface Favorite {
  favorite_id: number;
  content_type: "Note" | "Tweet" | "Video";
  content_id: number;
  created_at: string;
}

export interface ActivityLog {
  log_id: number;
  action: string;
  description: string;
  created_at: string;
}

export interface User {
  user_id: number;
  username: string;
  email: string;
  avatar?: string;
}

interface AppContextType {
  user: User | null;
  setUser: (u: User | null) => void;
  tasks: Task[];
  notes: Note[];
  tweets: Tweet[];
  videos: Video[];
  tags: Tag[];
  favorites: Favorite[];
  activityLogs: ActivityLog[];
  addTask: (t: Omit<Task, "task_id" | "created_at">) => void;
  updateTask: (id: number, data: Partial<Task>) => void;
  removeTask: (id: number) => void;
  addNote: (n: Omit<Note, "note_id" | "created_at">) => void;
  updateNote: (id: number, data: Partial<Note>) => void;
  removeNote: (id: number) => void;
  addTweet: (t: Omit<Tweet, "tweet_id" | "saved_at">) => void;
  removeTweet: (id: number) => void;
  addVideo: (v: Omit<Video, "video_id" | "saved_at">) => void;
  removeVideo: (id: number) => void;
  addTag: (name: string) => void;
  removeTag: (id: number) => void;
  addFavorite: (type: "Note" | "Tweet" | "Video", contentId: number) => void;
  removeFavorite: (id: number) => void;
  getFavoritesByType: (type: "Note" | "Tweet" | "Video") => Favorite[];
  updateProfile: (data: Partial<User>) => void;
}

const STORAGE_KEY = "sb_app_data";

const INITIAL_TASKS: Task[] = [
  { task_id: 1, title: "Read 'Building a Second Brain' book", description: "Finish chapters 4-6 this week", status: false, priority_level: "high", created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
  { task_id: 2, title: "Organize meeting notes from Tuesday", description: "Categorize and tag all action items", status: true, priority_level: "medium", created_at: new Date(Date.now() - 86400000 * 5).toISOString() },
  { task_id: 3, title: "Set up weekly review routine", description: "Define a system for reviewing saved content", status: false, priority_level: "urgent", created_at: new Date(Date.now() - 86400000).toISOString() },
  { task_id: 4, title: "Learn Obsidian plugins", description: "Explore graph view and backlinks", status: false, priority_level: "low", created_at: new Date(Date.now() - 86400000 * 3).toISOString() },
  { task_id: 5, title: "Archive old project notes", status: true, priority_level: "low", created_at: new Date(Date.now() - 86400000 * 7).toISOString() },
];

const INITIAL_NOTES: Note[] = [
  { note_id: 1, title: "PARA Method Overview", content: "Projects, Areas, Resources, Archives. The PARA method organizes information into four categories based on actionability. Projects have a deadline and goal. Areas are ongoing responsibilities. Resources are topics of interest. Archives are inactive items.", visibility: "private", created_at: new Date(Date.now() - 86400000 * 3).toISOString() },
  { note_id: 2, title: "Meeting Notes — Product Sync", content: "Action items: 1) Update roadmap 2) Schedule design review 3) Confirm Q2 targets. Key decisions: Launch moved to end of month. Need to finalize the API contract.", visibility: "private", created_at: new Date(Date.now() - 86400000).toISOString() },
  { note_id: 3, title: "Idea: Morning Writing Routine", content: "Write 500 words every morning before checking email. Could be journaling, blog posts, or project notes. Start with 15 minutes and expand.", visibility: "public", created_at: new Date(Date.now() - 86400000 * 6).toISOString() },
  { note_id: 4, title: "Books to Read in 2025", content: "1. Thinking Fast and Slow\n2. Deep Work by Cal Newport\n3. The Pragmatic Programmer\n4. Atomic Habits\n5. How to Take Smart Notes", visibility: "private", created_at: new Date(Date.now() - 86400000 * 10).toISOString() },
];

const INITIAL_TWEETS: Tweet[] = [
  { tweet_id: 1, tweet_link: "https://x.com/naval/status/1002103360646823936", title: "How to get rich (without getting lucky)", description: "Naval's famous tweetstorm on wealth creation", visibility: "public", saved_at: new Date(Date.now() - 86400000 * 4).toISOString() },
  { tweet_id: 2, tweet_link: "https://x.com/paulg/status/1", title: "Startup advice from Paul Graham", description: "Make something people want. The rest follows.", visibility: "private", saved_at: new Date(Date.now() - 86400000 * 2).toISOString() },
  { tweet_id: 3, tweet_link: "https://x.com/sama/status/1", title: "On building great products", description: "The best products are made by people who use them obsessively", visibility: "private", saved_at: new Date(Date.now() - 86400000 * 8).toISOString() },
];

const INITIAL_VIDEOS: Video[] = [
  { video_id: 1, video_link: "https://www.youtube.com/watch?v=K-ssUVyfn5g", title: "How to Build a Second Brain", description: "Tiago Forte's full course walkthrough on the PARA method and progressive summarization", visibility: "public", saved_at: new Date(Date.now() - 86400000 * 5).toISOString() },
  { video_id: 2, video_link: "https://www.youtube.com/watch?v=g1dSmA_UtFQ", title: "The Feynman Technique Explained", description: "Learn anything faster by explaining it simply", visibility: "private", saved_at: new Date(Date.now() - 86400000 * 3).toISOString() },
  { video_id: 3, video_link: "https://www.youtube.com/watch?v=0_44XEVOwek", title: "Productivity System Deep Dive", description: "GTD vs PARA vs Zettelkasten — which is best?", visibility: "private", saved_at: new Date(Date.now() - 86400000 * 9).toISOString() },
];

const INITIAL_TAGS: Tag[] = [
  { tag_id: 1, tag_name: "productivity" },
  { tag_id: 2, tag_name: "learning" },
  { tag_id: 3, tag_name: "design" },
  { tag_id: 4, tag_name: "startup" },
  { tag_id: 5, tag_name: "reading" },
];

const INITIAL_FAVORITES: Favorite[] = [
  { favorite_id: 1, content_type: "Note", content_id: 1, created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
  { favorite_id: 2, content_type: "Video", content_id: 1, created_at: new Date(Date.now() - 86400000 * 4).toISOString() },
  { favorite_id: 3, content_type: "Tweet", content_id: 1, created_at: new Date(Date.now() - 86400000).toISOString() },
];

const INITIAL_LOGS: ActivityLog[] = [
  { log_id: 1, action: "Created Note", description: "Added 'PARA Method Overview'", created_at: new Date(Date.now() - 3600000 * 2).toISOString() },
  { log_id: 2, action: "Saved Video", description: "Saved 'How to Build a Second Brain'", created_at: new Date(Date.now() - 3600000 * 5).toISOString() },
  { log_id: 3, action: "Completed Task", description: "Marked 'Archive old project notes' as done", created_at: new Date(Date.now() - 3600000 * 8).toISOString() },
  { log_id: 4, action: "Created Tag", description: "Added tag 'productivity'", created_at: new Date(Date.now() - 86400000).toISOString() },
  { log_id: 5, action: "Saved Tweet", description: "Saved Naval's wealth tweetstorm", created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
  { log_id: 6, action: "Created Task", description: "Added 'Read Building a Second Brain'", created_at: new Date(Date.now() - 86400000 * 3).toISOString() },
];

interface StoredData {
  tasks: Task[];
  notes: Note[];
  tweets: Tweet[];
  videos: Video[];
  tags: Tag[];
  favorites: Favorite[];
  activityLogs: ActivityLog[];
}

function loadFromStorage(): StoredData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveToStorage(data: StoredData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

let nextId = Date.now();
function genId() { return ++nextId; }

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const stored = loadFromStorage();

  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>(stored?.tasks ?? INITIAL_TASKS);
  const [notes, setNotes] = useState<Note[]>(stored?.notes ?? INITIAL_NOTES);
  const [tweets, setTweets] = useState<Tweet[]>(stored?.tweets ?? INITIAL_TWEETS);
  const [videos, setVideos] = useState<Video[]>(stored?.videos ?? INITIAL_VIDEOS);
  const [tags, setTags] = useState<Tag[]>(stored?.tags ?? INITIAL_TAGS);
  const [favorites, setFavorites] = useState<Favorite[]>(stored?.favorites ?? INITIAL_FAVORITES);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(stored?.activityLogs ?? INITIAL_LOGS);

  useEffect(() => {
    saveToStorage({ tasks, notes, tweets, videos, tags, favorites, activityLogs });
  }, [tasks, notes, tweets, videos, tags, favorites, activityLogs]);

  function addLog(action: string, description: string) {
    const log: ActivityLog = { log_id: genId(), action, description, created_at: new Date().toISOString() };
    setActivityLogs(prev => [log, ...prev].slice(0, 50));
  }

  const addTask = (t: Omit<Task, "task_id" | "created_at">) => {
    const task: Task = { ...t, task_id: genId(), created_at: new Date().toISOString() };
    setTasks(prev => [task, ...prev]);
    addLog("Created Task", `Added '${task.title}'`);
  };

  const updateTask = (id: number, data: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.task_id === id ? { ...t, ...data } : t));
    if (data.status !== undefined) addLog(data.status ? "Completed Task" : "Reopened Task", `Task status updated`);
  };

  const removeTask = (id: number) => {
    const t = tasks.find(x => x.task_id === id);
    setTasks(prev => prev.filter(t => t.task_id !== id));
    addLog("Deleted Task", `Removed '${t?.title ?? "task"}'`);
  };

  const addNote = (n: Omit<Note, "note_id" | "created_at">) => {
    const note: Note = { ...n, note_id: genId(), created_at: new Date().toISOString() };
    setNotes(prev => [note, ...prev]);
    addLog("Created Note", `Added '${note.title}'`);
  };

  const updateNote = (id: number, data: Partial<Note>) => {
    setNotes(prev => prev.map(n => n.note_id === id ? { ...n, ...data } : n));
  };

  const removeNote = (id: number) => {
    const n = notes.find(x => x.note_id === id);
    setNotes(prev => prev.filter(n => n.note_id !== id));
    addLog("Deleted Note", `Removed '${n?.title ?? "note"}'`);
  };

  const addTweet = (t: Omit<Tweet, "tweet_id" | "saved_at">) => {
    const tweet: Tweet = { ...t, tweet_id: genId(), saved_at: new Date().toISOString() };
    setTweets(prev => [tweet, ...prev]);
    addLog("Saved Tweet", `Saved '${tweet.title ?? tweet.tweet_link}'`);
  };

  const removeTweet = (id: number) => {
    setTweets(prev => prev.filter(t => t.tweet_id !== id));
    addLog("Deleted Tweet", "Removed saved tweet");
  };

  const addVideo = (v: Omit<Video, "video_id" | "saved_at">) => {
    const video: Video = { ...v, video_id: genId(), saved_at: new Date().toISOString() };
    setVideos(prev => [video, ...prev]);
    addLog("Saved Video", `Saved '${video.title ?? video.video_link}'`);
  };

  const removeVideo = (id: number) => {
    setVideos(prev => prev.filter(v => v.video_id !== id));
    addLog("Deleted Video", "Removed saved video");
  };

  const addTag = (name: string) => {
    if (tags.find(t => t.tag_name.toLowerCase() === name.toLowerCase())) return;
    const tag: Tag = { tag_id: genId(), tag_name: name };
    setTags(prev => [...prev, tag]);
    addLog("Created Tag", `Added tag '${name}'`);
  };

  const removeTag = (id: number) => {
    setTags(prev => prev.filter(t => t.tag_id !== id));
    addLog("Deleted Tag", "Removed tag");
  };

  const addFavorite = (type: "Note" | "Tweet" | "Video", contentId: number) => {
    if (favorites.find(f => f.content_type === type && f.content_id === contentId)) return;
    const fav: Favorite = { favorite_id: genId(), content_type: type, content_id: contentId, created_at: new Date().toISOString() };
    setFavorites(prev => [fav, ...prev]);
    addLog("Favorited", `Added ${type} to favorites`);
  };

  const removeFavorite = (id: number) => {
    setFavorites(prev => prev.filter(f => f.favorite_id !== id));
    addLog("Unfavorited", "Removed from favorites");
  };

  const getFavoritesByType = (type: "Note" | "Tweet" | "Video") => favorites.filter(f => f.content_type === type);

  const updateProfile = (data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
    addLog("Updated Profile", "Profile information changed");
  };

  return (
    <AppContext.Provider value={{
      user, setUser,
      tasks, notes, tweets, videos, tags, favorites, activityLogs,
      addTask, updateTask, removeTask,
      addNote, updateNote, removeNote,
      addTweet, removeTweet,
      addVideo, removeVideo,
      addTag, removeTag,
      addFavorite, removeFavorite, getFavoritesByType,
      updateProfile,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
