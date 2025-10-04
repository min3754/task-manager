import React, { useState, useEffect } from 'react';
import { taskService, userService } from '../services/api';
import TaskModal from '../components/TaskModal';
import { formatDate, getStatusLabel } from '../utils/helpers';
import './Tasks.css';

const Tasks = ({ currentUser }) => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', assignee_id: '', my_tasks: false });
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    try {
      const [tasksResponse, usersResponse] = await Promise.all([
        taskService.getAll(filters),
        userService.getAll()
      ]);
      setTasks(tasksResponse.data);
      setUsers(usersResponse.data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setShowModal(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.delete(id);
        loadData();
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedTask(null);
    loadData();
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  if (loading) return <div className="loading">Loading tasks...</div>;

  return (
    <div className="tasks-page">
      <div className="container">
        <div className="tasks-header">
          <h1>Tasks</h1>
          <button onClick={handleCreateTask} className="btn btn-primary">
            + New Task
          </button>
        </div>

        <div className="filters card">
          <div className="filter-group">
            <label>Status:</label>
            <select name="status" value={filters.status} onChange={handleFilterChange} className="form-control">
              <option value="">All</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Assignee:</label>
            <select name="assignee_id" value={filters.assignee_id} onChange={handleFilterChange} className="form-control">
              <option value="">All</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>
              <input 
                type="checkbox" 
                name="my_tasks" 
                checked={filters.my_tasks} 
                onChange={handleFilterChange}
              />
              My Tasks Only
            </label>
          </div>
        </div>

        <div className="tasks-list">
          {tasks.length === 0 ? (
            <div className="empty-state">
              <p>No tasks found. Create your first task!</p>
            </div>
          ) : (
            tasks.map(task => (
              <div key={task.id} className="task-card card">
                <div className="task-header">
                  <h3>{task.title}</h3>
                  <span className={`badge status-${task.status.toLowerCase().replace('_', '-')}`}>
                    {getStatusLabel(task.status)}
                  </span>
                </div>
                <p className="task-description">{task.description}</p>
                <div className="task-footer">
                  <div className="task-info">
                    {task.assignee_name && (
                      <span className="assignee">👤 {task.assignee_name}</span>
                    )}
                    {task.due_date && (
                      <span className="due-date">📅 {formatDate(task.due_date)}</span>
                    )}
                  </div>
                  <div className="task-actions">
                    <button onClick={() => handleEditTask(task)} className="btn btn-secondary btn-sm">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteTask(task.id)} className="btn btn-danger btn-sm">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {showModal && (
          <TaskModal
            task={selectedTask}
            users={users}
            onClose={handleModalClose}
          />
        )}
      </div>
    </div>
  );
};

export default Tasks;
