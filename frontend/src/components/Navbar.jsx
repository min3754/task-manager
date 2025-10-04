import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <h1>Task Manager</h1>
          </Link>
          {user && (
            <div className="navbar-menu">
              <Link to="/" className="navbar-link">Dashboard</Link>
              <Link to="/tasks" className="navbar-link">Tasks</Link>
              <Link to="/profile" className="navbar-link">Profile</Link>
              <div className="navbar-user">
                <span>{user.name}</span>
                <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
