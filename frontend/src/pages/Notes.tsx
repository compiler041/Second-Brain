import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Plus,
  Search,
  FileText,
  Eye,
  EyeOff,
  X,
  Clock,
} from 'lucide-react';
import type { Note } from '../types';
import './Notes.css';

const Notes = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showViewer, setShowViewer] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newNote, setNewNote] = useState({ title: '', content: '', visibility: 'private' as 'private' | 'public' });
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.title.trim()) return;

    setLoading(true);
    try {
      const note: Note = {
        note_id: Date.now(),
        title: newNote.title,
        content: newNote.content,
        visibility: newNote.visibility,
        user_id: user?.user_id || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setNotes((prev) => [note, ...prev]);
      setNewNote({ title: '', content: '', visibility: 'private' });
      setShowModal(false);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = (id: number) => {
    setNotes((prev) => prev.filter((n) => n.note_id !== id));
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="notes-page">
      <div className="page-header">
        <div>
          <h1>Notes</h1>
          <p>{notes.length} notes</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          New Note
        </button>
      </div>

      <div className="notes-toolbar">
        <div className="search-bar">
          <Search size={18} />
          <input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredNotes.length === 0 ? (
        <div className="empty-state">
          <FileText />
          <h3>{notes.length === 0 ? 'No notes yet' : 'No matching notes'}</h3>
          <p>
            {notes.length === 0
              ? 'Write your first note — like a Notion doc.'
              : 'Try different search terms.'}
          </p>
          {notes.length === 0 && (
            <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => setShowModal(true)}>
              <Plus size={16} /> Create Note
            </button>
          )}
        </div>
      ) : (
        <div className="notes-grid">
          {filteredNotes.map((note, i) => (
            <div
              key={note.note_id}
              className="note-card card"
              style={{ animationDelay: `${i * 0.05}s` }}
              onClick={() => setShowViewer(note)}
            >
              <div className="note-card-header">
                <h3>{note.title}</h3>
                <button
                  className="note-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note.note_id);
                  }}
                >
                  <X size={14} />
                </button>
              </div>
              <p className="note-preview">
                {note.content.substring(0, 120) || 'No content'}
                {note.content.length > 120 ? '...' : ''}
              </p>
              <div className="note-footer">
                <span className="note-time">
                  <Clock size={12} />
                  {new Date(note.created_at).toLocaleDateString()}
                </span>
                <span className={`badge ${note.visibility === 'public' ? 'badge-info' : 'badge-accent'}`}>
                  {note.visibility === 'public' ? <Eye size={11} /> : <EyeOff size={11} />}
                  {note.visibility}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Note viewer */}
      {showViewer && (
        <div className="modal-overlay" onClick={() => setShowViewer(null)}>
          <div className="modal-content note-viewer" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{showViewer.title}</h2>
              <button className="modal-close" onClick={() => setShowViewer(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="note-viewer-meta">
              <span className={`badge ${showViewer.visibility === 'public' ? 'badge-info' : 'badge-accent'}`}>
                {showViewer.visibility}
              </span>
              <span className="note-time">
                <Clock size={12} />
                {new Date(showViewer.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="note-viewer-content">
              {showViewer.content || 'No content'}
            </div>
          </div>
        </div>
      )}

      {/* Create modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Note</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="modal-form">
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  className="form-input"
                  placeholder="Note title"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label className="form-label">Content</label>
                <textarea
                  className="form-textarea"
                  placeholder="Write your note..."
                  rows={6}
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Visibility</label>
                <div className="visibility-toggle">
                  <button
                    type="button"
                    className={`vis-btn ${newNote.visibility === 'private' ? 'vis-btn--active' : ''}`}
                    onClick={() => setNewNote({ ...newNote, visibility: 'private' })}
                  >
                    <EyeOff size={14} /> Private
                  </button>
                  <button
                    type="button"
                    className={`vis-btn ${newNote.visibility === 'public' ? 'vis-btn--active' : ''}`}
                    onClick={() => setNewNote({ ...newNote, visibility: 'public' })}
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
                  {loading ? 'Creating...' : 'Create Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
