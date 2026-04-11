import { Star, CheckSquare, FileText, MessageSquareText, Video } from 'lucide-react';
import './Favorites.css';

const Favorites = () => {
  const contentTypes = [
    { type: 'Task', icon: CheckSquare, color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
    { type: 'Note', icon: FileText, color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
    { type: 'Tweet', icon: MessageSquareText, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
    { type: 'Video', icon: Video, color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  ];

  return (
    <div className="favorites-page">
      <div className="page-header">
        <div>
          <h1>Favorites</h1>
          <p>Your bookmarked content across all categories</p>
        </div>
      </div>

      {/* Category tabs */}
      <div className="fav-categories">
        {contentTypes.map((ct) => (
          <div key={ct.type} className="fav-category card">
            <div className="fav-cat-icon" style={{ background: ct.bg, color: ct.color }}>
              <ct.icon size={20} />
            </div>
            <span className="fav-cat-label">{ct.type}s</span>
            <span className="fav-cat-count">0</span>
          </div>
        ))}
      </div>

      <div className="empty-state">
        <Star />
        <h3>No favorites yet</h3>
        <p>Mark tasks, notes, tweets, or videos as favorites to see them here.</p>
      </div>
    </div>
  );
};

export default Favorites;
