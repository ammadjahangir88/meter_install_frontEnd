import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/Axios';
import './User.css'; // Ensure this file is updated with new class names
import AddUserModal from './AddUserModal';

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchUsers();
  }, []);

  const fetchCurrentUser = () => {
    axiosInstance.get('/v1/users/current')
      .then(response => setCurrentUser(response.data))
      .catch(error => console.error('Error fetching current user:', error));
  };

  const fetchUsers = () => {
    axiosInstance.get('/v1/users')
      .then(response => {
        console.log(response)
        setUsers(response.data)
      })
      .catch(error => console.error('Error fetching users:', error));
  };

  const addUser = (user) => {
    axiosInstance.post('/v1/users', { user })
      .then(() => {
        alert('User added successfully');
        fetchUsers();
        setIsModalOpen(false);
      })
      .catch(error => alert('Error adding user:', error));
  };

  const deleteUser = (userId) => {
    axiosInstance.delete(`/v1/users/${userId}`)
      .then(() => {
        alert('User deleted successfully');
        fetchUsers();
      })
      .catch(error => alert('Error deleting user:', error));
  };

  const updateUser = (user) => {
    axiosInstance.put(`/v1/users/${user.id}`, user)
      .then(() => {
        alert('User updated successfully');
        fetchUsers();
      })
      .catch(error => alert('Error updating user:', error));
  };

  return (
    <div className="usersTable">
      <button onClick={() => setIsModalOpen(true)} className="usersTable__addButton">Add User</button>
      {isModalOpen && <AddUserModal onClose={() => setIsModalOpen(false)} onSubmit={addUser} />}
      <table className="usersTable__table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.filter(user => user.id !== currentUser?.id).map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => deleteUser(user.id)} className="usersTable__deleteButton">Delete</button>
                <Link to={`/users/edit/${user.id}`} className="usersTable__editLink">Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
