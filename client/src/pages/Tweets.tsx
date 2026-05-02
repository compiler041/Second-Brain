import { useState, useEffect } from 'react';
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
import * as tweetsApi from '../api/tweets';
import './Tweets.css';

const Tweets = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newTweet, setNewTweet] = useState({
    tweet_link: '',
    title: '',
    description: '',
    visibility: true,
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  // Fetch all tweets on mount
  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const data = await tweetsApi.getAllTweets();
        setTweets(data);
      } catch (err) {
        console.error('Failed to fetch tweets:', err);
      } finally {
        setFetchLoading(false);
      }
    };
    fetchTweets();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTweet.tweet_link.trim() || !newTweet.title.trim()) return;

    setLoading(true);
    try {
      const created = await tweetsApi.addTweet(
        newTweet.tweet_link,
        newTweet.title,
        newTweet.description,
        newTweet.visibility
      );
      setTweets((prev) => [created, ...prev]);
      setNewTweet({ tweet_link: '', title: '', description: '', visibility: true });
      setShowModal(false);
    } catch (err) {
      console.error('Failed to save tweet:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteTweet = async (id: number) => {
    try {
      await tweetsApi.deleteTweet(id);
      setTweets((prev) => prev.filter((t) => t.tweet_id !== id));
    } catch (err) {
      console.error('Failed to delete tweet:', err);
    }
  };

  const filteredTweets = tweets.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const safeHostname = (url: string): string => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  if (fetchLoading) {
    return (
      <div className="tweets-page">
        <div className="empty-state">
          <MessageSquareText />
          <h3>Loading tweets...</h3>
        </div>
      </div>
    );
  }

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
                <span>{safeHostname(tweet.tweet_link)}</span>
              </div>
              <div className="tweet-footer">
                <span className="tweet-time">
                  <Clock size={12} />
                  {new Date(tweet.saved_at).toLocaleDateString()}
                </span>
                <span className={`badge ${tweet.visibility ? 'badge-info' : 'badge-accent'}`}>
                  {tweet.visibility ? <Eye size={11} /> : <EyeOff size={11} />}
                  {tweet.visibility ? 'public' : 'private'}
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
                    className={`vis-btn ${!newTweet.visibility ? 'vis-btn--active' : ''}`}
                    onClick={() => setNewTweet({ ...newTweet, visibility: false })}
                  >
                    <EyeOff size={14} /> Private
                  </button>
                  <button
                    type="button"
                    className={`vis-btn ${newTweet.visibility ? 'vis-btn--active' : ''}`}
                    onClick={() => setNewTweet({ ...newTweet, visibility: true })}
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
