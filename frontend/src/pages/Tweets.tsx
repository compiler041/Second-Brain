import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Plus,
  Search,
  MessageSquareText,
  ExternalLink,
  Eye,
  EyeOff,
  X,
  Clock,
  Link as LinkIcon,
} from 'lucide-react';
import type { Tweet } from '../types';
import './Tweets.css';

const Tweets = () => {
  const { user } = useAuth();
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newTweet, setNewTweet] = useState({
    tweet_link: '',
    title: '',
    description: '',
    visibility: 'private' as 'private' | 'public',
  });
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTweet.tweet_link.trim() || !newTweet.title.trim()) return;

    setLoading(true);
    try {
      const tweet: Tweet = {
        tweet_id: Date.now(),
        tweet_link: newTweet.tweet_link,
        title: newTweet.title,
        description: newTweet.description,
        visibility: newTweet.visibility,
        user_id: user?.user_id || 0,
        saved_at: new Date().toISOString(),
      };
      setTweets((prev) => [tweet, ...prev]);
      setNewTweet({ tweet_link: '', title: '', description: '', visibility: 'private' });
      setShowModal(false);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const deleteTweet = (id: number) => {
    setTweets((prev) => prev.filter((t) => t.tweet_id !== id));
  };

  const filteredTweets = tweets.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="tweets-page">
      <div className="page-header">
        <div>
          <h1>Tweets</h1>
          <p>{tweets.length} saved tweets</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Save Tweet
        </button>
      </div>

      <div className="tweets-toolbar">
        <div className="search-bar">
          <Search size={18} />
          <input
            placeholder="Search tweets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredTweets.length === 0 ? (
        <div className="empty-state">
          <MessageSquareText />
          <h3>{tweets.length === 0 ? 'No saved tweets' : 'No matching tweets'}</h3>
          <p>
            {tweets.length === 0
              ? 'Save your favorite tweets for quick reference.'
              : 'Try different search terms.'}
          </p>
          {tweets.length === 0 && (
            <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => setShowModal(true)}>
              <Plus size={16} /> Save Tweet
            </button>
          )}
        </div>
      ) : (
        <div className="tweets-grid">
          {filteredTweets.map((tweet, i) => (
            <div
              key={tweet.tweet_id}
              className="tweet-card card"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="tweet-card-header">
                <div className="tweet-icon-wrap">
                  <MessageSquareText size={18} />
                </div>
                <div className="tweet-actions-top">
                  <a
                    href={tweet.tweet_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tweet-link-btn"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={14} />
                  </a>
                  <button className="tweet-delete" onClick={() => deleteTweet(tweet.tweet_id)}>
                    <X size={14} />
                  </button>
                </div>
              </div>
              <h3>{tweet.title}</h3>
              {tweet.description && (
                <p className="tweet-desc">{tweet.description}</p>
              )}
              <div className="tweet-link-preview">
                <LinkIcon size={12} />
                <span>{new URL(tweet.tweet_link).hostname}</span>
              </div>
              <div className="tweet-footer">
                <span className="tweet-time">
                  <Clock size={12} />
                  {new Date(tweet.saved_at).toLocaleDateString()}
                </span>
                <span className={`badge ${tweet.visibility === 'public' ? 'badge-info' : 'badge-purple'}`}>
                  {tweet.visibility === 'public' ? <Eye size={11} /> : <EyeOff size={11} />}
                  {tweet.visibility}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Save Tweet</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="modal-form">
              <div className="form-group">
                <label className="form-label">Tweet Link *</label>
                <input
                  className="form-input"
                  placeholder="https://twitter.com/..."
                  value={newTweet.tweet_link}
                  onChange={(e) => setNewTweet({ ...newTweet, tweet_link: e.target.value })}
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  className="form-input"
                  placeholder="Give it a title"
                  value={newTweet.title}
                  onChange={(e) => setNewTweet({ ...newTweet, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  placeholder="Why is this tweet important?"
                  value={newTweet.description}
                  onChange={(e) => setNewTweet({ ...newTweet, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Visibility</label>
                <div className="visibility-toggle">
                  <button
                    type="button"
                    className={`vis-btn ${newTweet.visibility === 'private' ? 'vis-btn--active' : ''}`}
                    onClick={() => setNewTweet({ ...newTweet, visibility: 'private' })}
                  >
                    <EyeOff size={14} /> Private
                  </button>
                  <button
                    type="button"
                    className={`vis-btn ${newTweet.visibility === 'public' ? 'vis-btn--active' : ''}`}
                    onClick={() => setNewTweet({ ...newTweet, visibility: 'public' })}
                  >
                    <Eye size={14} /> Public
                  </button>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Tweet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tweets;
