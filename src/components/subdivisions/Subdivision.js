import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axiosInstance from '../utils/Axios';
import './Subdivisions.css';

const Subdivisions = () => {
  const [subdivisions, setSubdivisions] = useState([]);

  useEffect(() => {
    fetchSubdivisions();
  }, []);

  const fetchSubdivisions = async () => {
    try {
      const response = await axiosInstance.get('/v1/subdivisions');
      const data = await response.data;
      setSubdivisions(data);
    } catch (error) {
      console.error('Error fetching subdivisions:', error);
    }
  };

  const handleEdit = (subdivision) => {
    console.log('Editing subdivision:', subdivision);
    // Implement edit functionality here
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/v1/subdivisions/${id}`);
      // After successful deletion, fetch subdivisions again to update the list
      fetchSubdivisions();
    } catch (error) {
      console.error('Error deleting subdivision:', error);
    }
  };

  return (
    <div className="subdivisions-container">
      <h1>All Subdivisions</h1>
      <table className="subdivisions-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Division</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {subdivisions.map((subdivision) => (
            <tr key={subdivision.id}>
              <td>{subdivision.id}</td>
              <td>{subdivision.name}</td>
              <td>{subdivision.division}</td>
              <td>
                <FaEdit className="edit-icon" onClick={() => handleEdit(subdivision)} />
              </td>
              <td>
                <FaTrash className="delete-icon" onClick={() => handleDelete(subdivision.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Subdivisions;
