import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/Axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EditUser.css';

const EditUser = () => {
  const [user, setUser] = useState({ username: '', email: '', role: '' });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get(`/v1/users/${id}`)
      .then(response => {
        setUser(response.data);
      })
      .catch(error => console.log(error));
  }, [id]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axiosInstance.put(`/v1/users/${id}`, user)
      .then(() => {
        navigate('/users');
      })
      .catch(error => console.log(error));
  };

  return (
    <div className="edit-user-form">
      <h2>Edit User</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" name="username" value={user.username} onChange={handleChange} />

        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" value={user.email} onChange={handleChange} />

        <label htmlFor="role">Role:</label>
        <select id="role" name="role" value={user.role} onChange={handleChange}>
          <option value="Admin">Admin</option>
          <option value="Field Supervisor">Field Supervisor</option>
          <option value="QC">QC</option>
        </select>

        <button type="submit">Update User</button>
      </form>
    </div>
  );
};

export default EditUser;
