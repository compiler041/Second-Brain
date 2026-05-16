import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  CheckSquare,
  FileText,
  MessageSquareText,
  Video,
  Plus,
  Clock,
  Star,
  Sparkles,
  Coffee,
} from 'lucide-react';
import { getAllTasks } from '../api/tasks';
import { getAllNotes } from '../api/notes';
import { getAllTweets } from '../api/tweets';
import { getAllVideos } from '../api/youtube';
import type { Task, Note, Tweet, YouTubeVideo } from '../types';
import './Home.css';

/* ── Motivational quotes (rotates daily) ── */
const QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It is not enough to be busy; so are the ants. The question is: what are we busy about?", author: "Henry David Thoreau" },
  { text: "Your mind is for having ideas, not holding them.", author: "David Allen" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "What we think, we become.", author: "Buddha" },
  { text: "An unexamined life is not worth living.", author: "Socrates" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "We shape our tools, and thereafter our tools shape us.", author: "Marshall McLuhan" },
  { text: "Knowledge is of no value unless you put it into practice.", author: "Anton Chekhov" },
  { text: "The mind is everything. What you think you become.", author: "Buddha" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "Either write something worth reading or do something worth writing.", author: "Benjamin Franklin" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { text: "A room without books is like a body without a soul.", author: "Cicero" },
];

function getDailyQuote() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return QUOTES[dayOfYear % QUOTES.length];
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function isToday(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

interface ActivityItem {
  type: 'task' | 'note' | 'tweet' | 'video';
  title: string;
  time: string;
  rawDate: Date;
}

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);

  const quote = getDailyQuote();
  const greeting = getGreeting();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [t, n, tw, v] = await Promise.all([
          getAllTasks().catch(() => []),
          getAllNotes().catch(() => []),
          getAllTweets().catch(() => []),
          getAllVideos().catch(() => []),
        ]);
        setTasks(t);
        setNotes(n);
        setTweets(tw);
        setVideos(v);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  /* ── Stats ── */
  const activeTasks = tasks.filter((t) => !t.status).length;
  const doneTasks = tasks.filter((t) => t.status).length;

  /* ── Today's Activity ── */
  const todayActivity: ActivityItem[] = [];

  tasks.filter((t) => isToday(t.created_at)).forEach((t) =>
    todayActivity.push({
      type: 'task',
      title: t.title,
      time: formatTime(t.created_at),
      rawDate: new Date(t.created_at),
    })
  );

  notes.filter((n) => isToday(n.created_at)).forEach((n) =>
    todayActivity.push({
      type: 'note',
      title: n.title,
      time: formatTime(n.created_at),
      rawDate: new Date(n.created_at),
    })
  );

  tweets.filter((t) => isToday(t.saved_at)).forEach((t) =>
    todayActivity.push({
      type: 'tweet',
      title: t.title,
      time: formatTime(t.saved_at),
      rawDate: new Date(t.saved_at),
    })
  );

  videos.filter((v) => isToday(v.saved_at)).forEach((v) =>
    todayActivity.push({
      type: 'video',
      title: v.title,
      time: formatTime(v.saved_at),
      rawDate: new Date(v.saved_at),
    })
  );

  todayActivity.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());

  /* ── Recent Favorites — we don't have a dedicated favorites API,
       so we show the most recent 4 items across all modules ── */
  const recentItems: ActivityItem[] = [];
  tasks.slice(0, 2).forEach((t) =>
    recentItems.push({
      type: 'task',
      title: t.title,
      time: formatTime(t.created_at),
      rawDate: new Date(t.created_at),
    })
  );
  notes.slice(0, 1).forEach((n) =>
    recentItems.push({
      type: 'note',
      title: n.title,
      time: formatTime(n.created_at),
      rawDate: new Date(n.created_at),
    })
  );
  tweets.slice(0, 1).forEach((t) =>
    recentItems.push({
      type: 'tweet',
      title: t.title,
      time: formatTime(t.saved_at),
      rawDate: new Date(t.saved_at),
    })
  );
  recentItems.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());

  const typeIcon = (type: string) => {
    switch (type) {
      case 'task': return <CheckSquare size={14} />;
      case 'note': return <FileText size={14} />;
      case 'tweet': return <MessageSquareText size={14} />;
      case 'video': return <Video size={14} />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="home-page">
        <div className="loading-screen" style={{ height: '60vh' }}>
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* ── Greeting ── */}
      <div className="home-greeting">
        <h1>
          {greeting}, <span>{user?.username || 'there'}</span>
        </h1>
        <p className="home-date">{formatDate(new Date())}</p>
      </div>

      {/* ── Stats Cards ── */}
      <div className="home-stats">
        <div className="stat-card stat-card--tasks" onClick={() => navigate('/tasks')}>
          <div className="stat-card-icon">
            <CheckSquare size={18} />
          </div>
          <div className="stat-card-value">{activeTasks}</div>
          <div className="stat-card-label">Active Tasks</div>
          <div className="stat-card-sub">{doneTasks} completed</div>
        </div>

        <div className="stat-card stat-card--notes" onClick={() => navigate('/notes')}>
          <div className="stat-card-icon">
            <FileText size={18} />
          </div>
          <div className="stat-card-value">{notes.length}</div>
          <div className="stat-card-label">Notes</div>
          <div className="stat-card-sub">saved ideas</div>
        </div>

        <div className="stat-card stat-card--tweets" onClick={() => navigate('/tweets')}>
          <div className="stat-card-icon">
            <MessageSquareText size={18} />
          </div>
          <div className="stat-card-value">{tweets.length}</div>
          <div className="stat-card-label">Tweets</div>
          <div className="stat-card-sub">bookmarked</div>
        </div>

        <div className="stat-card stat-card--videos" onClick={() => navigate('/videos')}>
          <div className="stat-card-icon">
            <Video size={18} />
          </div>
          <div className="stat-card-value">{videos.length}</div>
          <div className="stat-card-label">Videos</div>
          <div className="stat-card-sub">saved to watch</div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="home-quick-actions">
        <button className="quick-action-btn" onClick={() => navigate('/tasks')}>
          <Plus size={16} /> New Task
        </button>
        <button className="quick-action-btn" onClick={() => navigate('/notes')}>
          <Plus size={16} /> New Note
        </button>
        <button className="quick-action-btn" onClick={() => navigate('/tweets')}>
          <Plus size={16} /> Save Tweet
        </button>
        <button className="quick-action-btn" onClick={() => navigate('/videos')}>
          <Plus size={16} /> Save Video
        </button>
      </div>

      {/* ── Two-column: Activity + Favorites ── */}
      <div className="home-columns">
        {/* Today's Activity */}
        <div className="home-section">
          <div className="home-section-title">
            <Clock size={16} /> Today's Activity
          </div>
          {todayActivity.length > 0 ? (
            <div className="activity-timeline">
              {todayActivity.map((item, i) => (
                <div key={i} className="activity-item">
                  <div className={`activity-dot activity-dot--${item.type}`} />
                  <div className="activity-content">
                    <div className={`activity-type activity-type--${item.type}`}>
                      {typeIcon(item.type)} {item.type}
                    </div>
                    <h4>{item.title}</h4>
                    <p>{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="activity-empty">
              <Coffee size={32} />
              <p>No activity yet today. Start by creating a task or saving a note!</p>
            </div>
          )}
        </div>

        {/* Recent Items */}
        <div className="home-section">
          <div className="home-section-title">
            <Star size={16} /> Recent Items
          </div>
          {recentItems.length > 0 ? (
            <div className="recent-favs-list">
              {recentItems.map((item, i) => (
                <div key={i} className="recent-fav-item">
                  <div className={`recent-fav-icon recent-fav-icon--${item.type}`}>
                    {typeIcon(item.type)}
                  </div>
                  <div className="recent-fav-text">
                    <h4>{item.title}</h4>
                    <p>{item.type} · {item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-favs">
              <p>No items saved yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Daily Quote ── */}
      <div className="home-quote">
        <Sparkles size={16} style={{ color: 'rgba(252,249,239,0.3)', marginBottom: 8 }} />
        <blockquote>{quote.text}</blockquote>
        <cite>— {quote.author}</cite>
      </div>
    </div>
  );
};

export default Home;
