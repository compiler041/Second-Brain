import { useState, useEffect } from 'react';
import {
  Plus,
  CheckCircle2,
  Circle,
  Search,
  Calendar,
  X,
  Heart,
} from 'lucide-react';
import type { Task } from '../types';
import * as tasksApi from '../api/tasks';
import { useFavorites } from '../context/useFavorites';
import './Tasks.css';

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all');
  const [newTask, setNewTask] = useState({ title: '', description: '', due_date: '' });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const { isFavorite, toggleFavorite } = useFavorites();

  // Fetch all tasks on mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await tasksApi.getAllTasks();
        setTasks(data);
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
      } finally {
        setFetchLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    setLoading(true);
    try {
      const created = await tasksApi.createTask(newTask.title, newTask.description);
      setTasks((prev) => [created, ...prev]);
      setNewTask({ title: '', description: '', due_date: '' });
      setShowModal(false);
    } catch (err) {
      console.error('Failed to create task:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: number) => {
    const task = tasks.find((t) => t.task_id === id);
    if (!task) return;
    try {
      const updated = await tasksApi.updateTask(id, { status: !task.status });
      setTasks((prev) =>
        prev.map((t) => (t.task_id === id ? updated : t))
      );
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await tasksApi.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.task_id !== id));
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    if (filter === 'active') return !t.status && matchesSearch;
    if (filter === 'done') return t.status && matchesSearch;
    return matchesSearch;
  });

  const remainingCount = tasks.filter((t) => !t.status).length;

  if (fetchLoading) {
    return (
      <div className="tasks-page">
        <div className="empty-state">
          <CheckCircle2 />
          <h3>Loading tasks...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="tasks-page">
      <div className="page-header">
        <div>
          <h1>Tasks</h1>
          <p>{remainingCount} remaining</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} />
          New Task
        </button>
      </div>

      {/* Filter tabs */}
      <div className="tasks-toolbar">
        <div className="filter-tabs">
          {(['all', 'active', 'done'] as const).map((f) => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'filter-tab--active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className="search-bar">
          <Search size={16} />
          <input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Task list */}
      {filteredTasks.length === 0 ? (
        <div className="empty-state">
          <CheckCircle2 />
          <h3>{tasks.length === 0 ? 'No tasks yet' : 'No matching tasks'}</h3>
          <p>
            {tasks.length === 0
              ? 'Create your first task to get started'
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
                {task.status ? <CheckCircle2 size={20} /> : <Circle size={20} />}
              </button>
              <div className="task-content">
                <h3 className={task.status ? 'task-title--done' : ''}>{task.title}</h3>
                {task.description && (
                  <p className="task-desc">{task.description}</p>
                )}
                <div className="task-meta">
                  {task.due_date && (
                    <span className="task-date">
                      <Calendar size={12} />
                      {new Date(task.due_date).toLocaleDateString()}
                    </span>
                  )}
                  <span className={`badge ${task.status ? 'badge-success' : 'badge-warning'}`}>
                    {task.status ? 'Done' : 'Active'}
                  </span>
                </div>
              </div>
              <div className="task-actions">
                <button
                  className={`favorite-btn ${isFavorite('task', task.task_id) ? 'is-favorite' : ''}`}
                  onClick={() => toggleFavorite('task', task.task_id)}
                  title="Toggle favorite"
                >
                  <Heart size={14} />
                </button>
                <button className="task-delete" onClick={() => deleteTask(task.task_id)}>
                  <X size={14} />
                </button>
              </div>
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
