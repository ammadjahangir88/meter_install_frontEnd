import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axiosInstance from '../utils/Axios';
import './Discos.css';

const Discos = () => {
  const [discos, setDiscos] = useState([]);

  useEffect(() => {
    fetchDiscos();
  }, []);

  const fetchDiscos = async () => {
    try {
      const response = await axiosInstance.get('/v1/all_discos');
      const data = await response.data;
      setDiscos(data);
    } catch (error) {
      console.error('Error fetching discos:', error);
    }
  };

  const handleEdit = (disco) => {
    console.log('Editing disco:', disco);
    // Implement edit functionality here
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/v1/all_discos/${id}`);
      // After successful deletion, fetch discos again to update the list
      fetchDiscos();
    } catch (error) {
      console.error('Error deleting disco:', error);
    }
  };

  return (
    <div className="discos-container">
      <h1>All Discos</h1>
      <table className="discos-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {discos.map((disco) => (
            <tr key={disco.id}>
              <td>{disco.id}</td>
              <td>{disco.name}</td>
              <td>
                <FaEdit className="edit-icon" onClick={() => handleEdit(disco)} />
              </td>
              <td>
                <FaTrash className="delete-icon" onClick={() => handleDelete(disco.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Discos;
