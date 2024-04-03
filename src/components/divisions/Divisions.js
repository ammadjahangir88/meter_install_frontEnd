import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axiosInstance from '../utils/Axios';
import './Divisions.css';

const Divisions = () => {
  const [divisions, setDivisions] = useState([]);

  useEffect(() => {
    fetchDivisions();
  }, []);

  const fetchDivisions = async () => {
    try {
      const response = await axiosInstance.get('/v1/divisions');
      const data = await response.data;
      setDivisions(data);
    } catch (error) {
      console.error('Error fetching divisions:', error);
    }
  };

  const handleEdit = (division) => {
    console.log('Editing division:', division);
    // Implement edit functionality here
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/v1/divisions/${id}`);
      // After successful deletion, fetch divisions again to update the list
      fetchDivisions();
    } catch (error) {
      console.error('Error deleting division:', error);
    }
  };

  return (
    <div className="divisions-container">
      <h1>All Divisions</h1>
      <table className="divisions-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {divisions.map((division) => (
            <tr key={division.id}>
              <td>{division.id}</td>
              <td>{division.name}</td>
              <td>
                <FaEdit className="edit-icon" onClick={() => handleEdit(division)} />
              </td>
              <td>
                <FaTrash className="delete-icon" onClick={() => handleDelete(division.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Divisions;
