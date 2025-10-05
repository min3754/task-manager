import React, { useState, useEffect } from 'react';
import { taskService } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsResponse, tasksResponse] = await Promise.all([
        taskService.getStats(),
        taskService.getAll()
      ]);
      setStats(statsResponse.data);
      setRecentTasks(tasksResponse.data.slice(0, 5));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard">
      <div className="container">
        <h1>Dashboard</h1>
        
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Tasks</h3>
            <p className="stat-number">{stats?.total || 0}</p>
          </div>
          <div className="stat-card">
            <h3>To Do</h3>
            <p className="stat-number">{stats?.todo || 0}</p>
          </div>
          <div className="stat-card">
            <h3>In Progress</h3>
            <p className="stat-number">{stats?.in_progress || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Done</h3>
            <p className="stat-number">{stats?.done || 0}</p>
          </div>
        </div>

        <div className="progress-section">
          <h2>Overall Progress</h2>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${stats?.progress || 0}%` }}
            >
              {stats?.progress || 0}%
            </div>
          </div>
        </div>

        <div className="recent-tasks">
          <h2>Recent Tasks</h2>
          {recentTasks.length === 0 ? (
            <p>No tasks yet. Create your first task!</p>
          ) : (
            <div className="task-list">
              {recentTasks.map(task => (
                <div key={task.id} className="task-item">
                  <div className="task-info">
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                  </div>
                  <div className="task-meta">
                    <span className={`badge status-${task.status.toLowerCase().replace('_', '-')}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                    {task.assignee_name && (
                      <span className="assignee">{task.assignee_name}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
