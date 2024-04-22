import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/Axios';
import ConfirmationModal from '../utils/ConfirmationModal';
import './index.css';

const TableView = ({ data, item ,updateData }) => {

 
  
  const [allItems,setSelectedAllItems]=useState([])
  const [selectedDiscoItems, setSelectedDiscoItems] = useState([]);
  const [selectedRegionItems, setSelectedRegionItems] = useState([]);
  const [selectedDivisionItems, setSelectedDivisionItems] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  const resetSelectedItems = () => {
    setSelectedAllItems([])
    setSelectedDiscoItems([]);
    setSelectedRegionItems([]);
    setSelectedDivisionItems([]);
  };

  useEffect(() => {
    resetSelectedItems();
  }, [item]);

  const handleCheckboxChange = (id, type) => {
    switch (type) {
      case 'all':
        setSelectedAllItems((prevSelectedItems) =>
          prevSelectedItems.includes(id)
            ? prevSelectedItems.filter((item) => item !== id)
            : [...prevSelectedItems, id]
        );
        break;

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
        );x
        break;
      default:
        break;
    }
  };

  const handleDelete = () => { /* Deletion logic unchanged */ };
  const confirmDelete = () => { /* Confirm deletion logic unchanged */ };
  const cancelDelete = () => { /* Cancel deletion logic unchanged */ };

  const renderContent = () => {
    let content = [];
    const contentType = item.type.charAt(0).toUpperCase() + item.type.slice(1);
    if (item.type === 'all') {
      content = data.map(disco => ({
        id: disco.id,
        name: disco.name
    }));
    
    console.log(content);

    } 
    else if (item.type === 'disco') {
      const disco = data.find((d) => d.name === item.name);
      content = disco?.regions || [];
      console.log(content)
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

    if (content.length === 0) {
      return (
        <tr>
          <td colSpan="3">No further {contentType}s are present.</td>
        </tr>
      );
    }

    return content.map((c) => (
      <tr key={c.id}>
        <td>{c.id}</td>
        <td>{c.name}</td>
        <td className="checkbox-cell">
          <input
            type="checkbox"
            checked={
              item.type === 'all'
              ? setSelectedAllItems.includes(c.id)
              : item.type === 'disco'
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
      {showConfirmation && (
        <ConfirmationModal
          message={confirmationMessage}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}

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
