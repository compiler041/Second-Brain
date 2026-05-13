import { useState, useEffect } from 'react';
import { Star, CheckSquare, FileText, MessageSquareText, Video, Heart } from 'lucide-react';
import { useFavorites, type FavoriteType } from '../context/useFavorites';
import * as tasksApi from '../api/tasks';
import * as notesApi from '../api/notes';
import * as tweetsApi from '../api/tweets';
import * as youtubeApi from '../api/youtube';
import type { Task, Note, Tweet, YouTubeVideo } from '../types';
import './Favorites.css';

const categoryMeta = [
  { type: 'task' as FavoriteType, label: 'Tasks', icon: CheckSquare, color: '#A0522D', bg: 'rgba(160,82,45,0.10)' },
  { type: 'note' as FavoriteType, label: 'Notes', icon: FileText, color: '#6B8E6B', bg: 'rgba(107,142,107,0.10)' },
  { type: 'tweet' as FavoriteType, label: 'Tweets', icon: MessageSquareText, color: '#5A7A9A', bg: 'rgba(90,122,154,0.10)' },
  { type: 'video' as FavoriteType, label: 'Videos', icon: Video, color: '#C4A35A', bg: 'rgba(196,163,90,0.10)' },
];

const Favorites = () => {
  const { favorites, getFavoriteIds, toggleFavorite } = useFavorites();
  const [activeTab, setActiveTab] = useState<FavoriteType>('task');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [t, n, tw, v] = await Promise.all([
          tasksApi.getAllTasks(),
          notesApi.getAllNotes(),
          tweetsApi.getAllTweets(),
          youtubeApi.getAllVideos(),
        ]);
        setTasks(t);
        setNotes(n);
        setTweets(tw);
        setVideos(v);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const favTaskIds = getFavoriteIds('task');
  const favNoteIds = getFavoriteIds('note');
  const favTweetIds = getFavoriteIds('tweet');
  const favVideoIds = getFavoriteIds('video');

  const favTasks = tasks.filter((t) => favTaskIds.includes(t.task_id));
  const favNotes = notes.filter((n) => favNoteIds.includes(n.note_id));
  const favTweets = tweets.filter((t) => favTweetIds.includes(t.tweet_id));
  const favVideos = videos.filter((v) => favVideoIds.includes(v.video_id));

  const counts: Record<FavoriteType, number> = {
    task: favTasks.length,
    note: favNotes.length,
    tweet: favTweets.length,
    video: favVideos.length,
  };

  const totalFavorites = favorites.length;

  const renderItems = () => {
    if (loading) {
      return (
        <div className="empty-state">
          <Star />
          <h3>Loading favorites...</h3>
        </div>
      );
    }

    const items = activeTab === 'task' ? favTasks
      : activeTab === 'note' ? favNotes
      : activeTab === 'tweet' ? favTweets
      : favVideos;

    if (items.length === 0) {
      return (
        <div className="empty-state">
          <Heart />
          <h3>No favorite {activeTab}s yet</h3>
          <p>Use the heart icon on items to add them here.</p>
        </div>
      );
    }

    return (
      <div className="fav-items">
        {activeTab === 'task' && favTasks.map((task) => (
          <div key={task.task_id} className="fav-item card">
            <div className="fav-item-content">
              <h4>{task.title}</h4>
              {task.description && <p>{task.description}</p>}
            </div>
            <button
              className="favorite-btn is-favorite"
              onClick={() => toggleFavorite('task', task.task_id)}
            >
              <Heart size={14} />
            </button>
          </div>
        ))}
        {activeTab === 'note' && favNotes.map((note) => (
          <div key={note.note_id} className="fav-item card">
            <div className="fav-item-content">
              <h4>{note.title}</h4>
              <p>{(note.context || '').substring(0, 100)}{(note.context || '').length > 100 ? '...' : ''}</p>
            </div>
            <button
              className="favorite-btn is-favorite"
              onClick={() => toggleFavorite('note', note.note_id)}
            >
              <Heart size={14} />
            </button>
          </div>
        ))}
        {activeTab === 'tweet' && favTweets.map((tweet) => (
          <div key={tweet.tweet_id} className="fav-item card">
            <div className="fav-item-content">
              <h4>{tweet.title}</h4>
              {tweet.description && <p>{tweet.description}</p>}
            </div>
            <button
              className="favorite-btn is-favorite"
              onClick={() => toggleFavorite('tweet', tweet.tweet_id)}
            >
              <Heart size={14} />
            </button>
          </div>
        ))}
        {activeTab === 'video' && favVideos.map((video) => (
          <div key={video.video_id} className="fav-item card">
            <div className="fav-item-content">
              <h4>{video.title}</h4>
              {video.description && <p>{video.description}</p>}
            </div>
            <button
              className="favorite-btn is-favorite"
              onClick={() => toggleFavorite('video', video.video_id)}
            >
              <Heart size={14} />
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="favorites-page">
      <div className="page-header">
        <div>
          <h1>Favorites</h1>
          <p>{totalFavorites} items saved</p>
        </div>
      </div>

      {/* Category tabs */}
      <div className="fav-categories">
        {categoryMeta.map((cat) => (
          <button
            key={cat.type}
            className={`fav-category ${activeTab === cat.type ? 'fav-category--active' : ''}`}
            onClick={() => setActiveTab(cat.type)}
          >
            <div className="fav-cat-icon" style={{ background: cat.bg, color: cat.color }}>
              <cat.icon size={16} />
            </div>
            <span className="fav-cat-label">{cat.label}</span>
            <span className="fav-cat-count">{counts[cat.type]}</span>
          </button>
        ))}
      </div>

      {renderItems()}
    </div>
  );
};

export default Favorites;
