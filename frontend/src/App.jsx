import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import { authService } from './services/api';
import './styles/global.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await authService.getProfile();
        setUser(response.data);
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        {user && <Navbar user={user} onLogout={handleLogout} />}
        
        <Routes>
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" /> : <Register onLogin={handleLogin} />}
          />
          <Route
            path="/"
            element={user ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/tasks"
            element={user ? <Tasks currentUser={user} /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={user ? <Profile user={user} onUpdate={handleProfileUpdate} /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
