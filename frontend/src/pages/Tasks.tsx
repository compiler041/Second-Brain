import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Plus,
  CheckCircle2,
  Circle,
  Search,
  Filter,
  Calendar,
  X,
} from 'lucide-react';
import type { Task } from '../types';
import './Tasks.css';

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [newTask, setNewTask] = useState({ title: '', description: '', due_date: '' });
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    setLoading(true);
    try {
      const task: Task = {
        task_id: Date.now(),
        title: newTask.title,
        description: newTask.description,
        due_date: newTask.due_date || null,
        priority_id: null,
        status: false,
        user_id: user?.user_id || 0,
        created_at: new Date().toISOString(),
      };
      setTasks((prev) => [task, ...prev]);
      setNewTask({ title: '', description: '', due_date: '' });
      setShowModal(false);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.task_id === id ? { ...t, status: !t.status } : t))
    );
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.task_id !== id));
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    if (filter === 'active') return !t.status && matchesSearch;
    if (filter === 'completed') return t.status && matchesSearch;
    return matchesSearch;
  });

  const completedCount = tasks.filter((t) => t.status).length;

  return (
    <div className="tasks-page">
      <div className="page-header">
        <div>
          <h1>Tasks</h1>
          <p>
            {tasks.length} total · {completedCount} completed
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          New Task
        </button>
      </div>

      {/* Toolbar */}
      <div className="tasks-toolbar">
        <div className="search-bar">
          <Search size={18} />
          <input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          <Filter size={16} />
          {(['all', 'active', 'completed'] as const).map((f) => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'filter-tab--active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Task list */}
      {filteredTasks.length === 0 ? (
        <div className="empty-state">
          <CheckCircle2 />
          <h3>{tasks.length === 0 ? 'No tasks yet' : 'No matching tasks'}</h3>
          <p>
            {tasks.length === 0
              ? 'Create your first task to get started.'
              : 'Try adjusting your search or filter.'}
          </p>
          {tasks.length === 0 && (
            <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => setShowModal(true)}>
              <Plus size={16} /> Create Task
            </button>
          )}
        </div>
      ) : (
        <div className="task-list">
          {filteredTasks.map((task, i) => (
            <div
              key={task.task_id}
              className={`task-item card ${task.status ? 'task-item--done' : ''}`}
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <button
                className={`task-check ${task.status ? 'task-check--checked' : ''}`}
                onClick={() => toggleStatus(task.task_id)}
              >
                {task.status ? <CheckCircle2 size={22} /> : <Circle size={22} />}
              </button>
              <div className="task-content">
                <h3 className={task.status ? 'task-title--done' : ''}>{task.title}</h3>
                {task.description && (
                  <p className="task-desc">{task.description}</p>
                )}
                <div className="task-meta">
                  {task.due_date && (
                    <span className="task-date">
                      <Calendar size={13} />
                      {new Date(task.due_date).toLocaleDateString()}
                    </span>
                  )}
                  <span className={`badge ${task.status ? 'badge-success' : 'badge-warning'}`}>
                    {task.status ? 'Completed' : 'Active'}
                  </span>
                </div>
              </div>
              <button className="task-delete" onClick={() => deleteTask(task.task_id)}>
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Task</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="modal-form">
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  className="form-input"
                  placeholder="What needs to be done?"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  placeholder="Add more details..."
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={newTask.due_date}
                  onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
