import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Plus,
  Search,
  Video as VideoIcon,
  ExternalLink,
  Eye,
  EyeOff,
  X,
  Clock,
  Play,
} from 'lucide-react';
import type { YouTubeVideo } from '../types';
import './Videos.css';

const extractVideoId = (url: string): string | null => {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
};

const Videos = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newVideo, setNewVideo] = useState({
    video_link: '',
    title: '',
    description: '',
    visibility: 'private' as 'private' | 'public',
  });
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideo.video_link.trim()) return;

    setLoading(true);
    try {
      const video: YouTubeVideo = {
        video_id: Date.now(),
        video_link: newVideo.video_link,
        title: newVideo.title || 'Untitled Video',
        description: newVideo.description,
        visibility: newVideo.visibility,
        user_id: user?.user_id || 0,
        saved_at: new Date().toISOString(),
      };
      setVideos((prev) => [video, ...prev]);
      setNewVideo({ video_link: '', title: '', description: '', visibility: 'private' });
      setShowModal(false);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const deleteVideo = (id: number) => {
    setVideos((prev) => prev.filter((v) => v.video_id !== id));
  };

  const filteredVideos = videos.filter(
    (v) =>
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="videos-page">
      <div className="page-header">
        <div>
          <h1>Videos</h1>
          <p>{videos.length} saved videos</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Save Video
        </button>
      </div>

      <div className="videos-toolbar">
        <div className="search-bar">
          <Search size={18} />
          <input
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredVideos.length === 0 ? (
        <div className="empty-state">
          <VideoIcon />
          <h3>{videos.length === 0 ? 'No saved videos' : 'No matching videos'}</h3>
          <p>
            {videos.length === 0
              ? 'Build your personal YouTube video library.'
              : 'Try different search terms.'}
          </p>
          {videos.length === 0 && (
            <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => setShowModal(true)}>
              <Plus size={16} /> Save Video
            </button>
          )}
        </div>
      ) : (
        <div className="videos-grid">
          {filteredVideos.map((video, i) => {
            const videoId = extractVideoId(video.video_link);
            return (
              <div
                key={video.video_id}
                className="video-card card"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="video-thumbnail">
                  {videoId ? (
                    <img
                      src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                      alt={video.title}
                    />
                  ) : (
                    <div className="video-thumb-placeholder">
                      <VideoIcon size={32} />
                    </div>
                  )}
                  <a
                    href={video.video_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="video-play-overlay"
                  >
                    <Play size={28} fill="white" />
                  </a>
                </div>
                <div className="video-info">
                  <div className="video-info-header">
                    <h3>{video.title}</h3>
                    <div className="video-actions-top">
                      <a href={video.video_link} target="_blank" rel="noopener noreferrer" className="tweet-link-btn">
                        <ExternalLink size={14} />
                      </a>
                      <button className="tweet-delete" onClick={() => deleteVideo(video.video_id)}>
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                  {video.description && <p className="video-desc">{video.description}</p>}
                  <div className="video-footer">
                    <span className="tweet-time">
                      <Clock size={12} />
                      {new Date(video.saved_at).toLocaleDateString()}
                    </span>
                    <span className={`badge ${video.visibility === 'public' ? 'badge-info' : 'badge-accent'}`}>
                      {video.visibility === 'public' ? <Eye size={11} /> : <EyeOff size={11} />}
                      {video.visibility}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Save YouTube Video</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="modal-form">
              <div className="form-group">
                <label className="form-label">YouTube Link *</label>
                <input
                  className="form-input"
                  placeholder="https://youtube.com/watch?v=..."
                  value={newVideo.video_link}
                  onChange={(e) => setNewVideo({ ...newVideo, video_link: e.target.value })}
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  className="form-input"
                  placeholder="Video title"
                  value={newVideo.title}
                  onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  placeholder="Why is this video worth saving?"
                  value={newVideo.description}
                  onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Visibility</label>
                <div className="visibility-toggle">
                  <button
                    type="button"
                    className={`vis-btn ${newVideo.visibility === 'private' ? 'vis-btn--active' : ''}`}
                    onClick={() => setNewVideo({ ...newVideo, visibility: 'private' })}
                  >
                    <EyeOff size={14} /> Private
                  </button>
                  <button
                    type="button"
                    className={`vis-btn ${newVideo.visibility === 'public' ? 'vis-btn--active' : ''}`}
                    onClick={() => setNewVideo({ ...newVideo, visibility: 'public' })}
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
                  {loading ? 'Saving...' : 'Save Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Videos;
