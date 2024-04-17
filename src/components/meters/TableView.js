import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/Axios';
import ConfirmationModal from '../utils/ConfirmationModal';
import './index.css';

const TableView = ({ data, item }) => {
  
  const [selectedDiscoItems, setSelectedDiscoItems] = useState([]);
  const [selectedRegionItems, setSelectedRegionItems] = useState([]);
  const [selectedDivisionItems, setSelectedDivisionItems] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  const resetSelectedItems = () => {
    setSelectedDiscoItems([]);
    setSelectedRegionItems([]);
    setSelectedDivisionItems([]);
  };

  useEffect(() => {
    resetSelectedItems();
  }, [item]);

  const handleCheckboxChange = (id, type) => {
    switch (type) {
      case 'disco':
        setSelectedDiscoItems((prevSelectedItems) =>
          prevSelectedItems.includes(id)
            ? prevSelectedItems.filter((item) => item !== id)
            : [...prevSelectedItems, id]
        );
        break;
      case 'region':
        setSelectedRegionItems((prevSelectedItems) =>
          prevSelectedItems.includes(id)
            ? prevSelectedItems.filter((item) => item !== id)
            : [...prevSelectedItems, id]
        );
        break;
      case 'division':
        setSelectedDivisionItems((prevSelectedItems) =>
          prevSelectedItems.includes(id)
            ? prevSelectedItems.filter((item) => item !== id)
            : [...prevSelectedItems, id]
        );
        break;
      default:
        break;
    }
  };

  const handleDelete = async () => {
    const { type } = item;
    let url = '';
    let confirmationMsg = '';

    switch (type) {
      case 'disco':
        confirmationMsg = `Are you sure you want to delete the following regions of ${item.name}?`;
        url = '/v1/discos/delete_regions';
        break;
      case 'region':
        confirmationMsg = `Are you sure you want to delete the following divisions of ${item.name}?`;
        url = '/v1/discos/delete_divisions';
        break;
      case 'division':
        confirmationMsg = `Are you sure you want to delete the following subdivisions of ${item.name}?`;
        url = '/v1/discos/delete_subdivisions';
        break;
      default:
        return;
    }

    // Set the confirmation message based on the item type
    setShowConfirmation(true);
    setConfirmationMessage(confirmationMsg);
  };

  const confirmDelete = async () => {
    const { type } = item;
    let url = '';

    switch (type) {
      case 'disco':
        url = '/v1/discos/delete_regions';
        break;
      case 'region':
        url = '/v1/discos/delete_divisions';
        break;
      case 'division':
        url = '/v1/discos/delete_subdivisions';
        break;
      default:
        return;
    }

    try {
      switch (type) {
        case 'disco':
          await axiosInstance.delete(url, { data: { ids: selectedDiscoItems } });
          break;
        case 'region':
          await axiosInstance.delete(url, { data: { ids: selectedRegionItems } });
          break;
        case 'division':
          await axiosInstance.delete(url, { data: { ids: selectedDivisionItems } });
          break;
        default:
          break;
      }
      console.log('Deletion successful');
    } catch (error) {
      console.error('Error deleting items:', error);
    }

    // Hide confirmation modal after deletion
    setShowConfirmation(false);
  };

  const cancelDelete = () => {
    // Hide confirmation modal without deleting
    setShowConfirmation(false);
  };

  const renderContent = () => {
    let content = [];

    if (item.type === 'disco') {
      const disco = data.find((d) => d.name === item.name);
      content = disco?.regions || [];
    } else if (item.type === 'region') {
      data.forEach((disco) => {
        const region = disco.regions.find((r) => r.name === item.name);
        if (region) content = region.divisions;
      });
    } else if (item.type === 'division') {
      data.forEach((disco) => {
        disco.regions.forEach((region) => {
          const division = region.divisions.find((d) => d.name === item.name);
          if (division) content = division.subdivisions;
        });
      });
    }

    return content.map((c) => (
      <tr key={c.id}>
        <td>{c.id}</td>
        <td>{c.name}</td>
        <td className="checkbox-cell">
          <input
            type="checkbox"
            checked={
              item.type === 'disco'
                ? selectedDiscoItems.includes(c.id)
                : item.type === 'region'
                ? selectedRegionItems.includes(c.id)
                : selectedDivisionItems.includes(c.id)
            }
            onChange={() => handleCheckboxChange(c.id, item.type)}
          />
        </td>
      </tr>
    ));
  };

  return (
    <div className="table-view-container">
      {/* Confirmation modal */}
      {showConfirmation && (
        <ConfirmationModal
          message={confirmationMessage}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}

      {/* Rest of the component content */}
      <div className="table-view-buttons">
        <button className="table-view-button" onClick={() => console.log('Add new item')}>
          Add
        </button>
        <button className="table-view-button" onClick={handleDelete}>
          Delete
        </button>
      </div>
      <table className="table-view">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>{renderContent()}</tbody>
      </table>
    </div>
  );
};

export default TableView;
