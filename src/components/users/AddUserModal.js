import React, { useState } from 'react';
import './AddUserModal.css';
import { FaTimes } from 'react-icons/fa'; // Import the close icon

const AddUserModal = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'Admin' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <div className="modal-header">
                    <h3 className="modal-title">Add User</h3>
                    <button onClick={onClose} className="close-button">
                        <FaTimes /> 
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="modal-body">
                    <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
                    <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
                    <select name="role" value={formData.role} onChange={handleChange}>
                        <option value="Admin">Admin</option>
                        <option value="Field Supervisor">Field Supervisor</option>
                    </select>
                    <button type="submit">Add User</button>
                </form>
            </div>
        </div>
    );
}

export default AddUserModal;
