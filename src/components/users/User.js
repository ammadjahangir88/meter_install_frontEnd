import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/Axios'; 
import './User.css'
import AddUserModal from './AddUserModal';
const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axiosInstance.get('/v1/users')
      .then((response) =>{
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
        setIsModalOpen(false); // Close the modal after adding
      })
      .catch(error => alert('Error adding user:', error));
  };
  const deleteUser = (userId) => {
    axiosInstance.delete(`/v1/users/${userId}`)
      .then(() => {
        alert('User deleted successfully');
        fetchUsers(); // Refresh the list after delete
      })
      .catch(error => alert('Error deleting user:', error));
  };

  const updateUser = (user) => {
    axiosInstance.put(`/v1/users/${user.id}`, user)
      .then(() => {
        alert('User updated successfully');
        fetchUsers(); // Refresh the list after update
      })
      .catch(error => alert('Error updating user:', error));
  };

  return (
    <div className="users-table">
       <button onClick={() => setIsModalOpen(true)}>Add User</button>
       {isModalOpen && <AddUserModal onClose={() => setIsModalOpen(false)} onSubmit={addUser} />}
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => deleteUser(user.id)}>Delete</button>
                <Link to={`/users/edit/${user.id}`}>Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
