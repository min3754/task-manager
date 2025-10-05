import React, { useState, useEffect } from 'react';
import { authService } from '../services/api';
import './Profile.css';

const Profile = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({ name: '', avatar: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await authService.updateProfile(formData);
      onUpdate(response.data.user);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <h1>My Profile</h1>
        
        <div className="profile-card card">
          <div className="profile-header">
            <div className="avatar-container">
              {formData.avatar ? (
                <img src={formData.avatar} alt={formData.name} className="avatar" />
              ) : (
                <div className="avatar-placeholder">
                  {formData.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h2>{user?.name}</h2>
              <p>{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Avatar URL</label>
              <input
                type="url"
                name="avatar"
                className="form-control"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
