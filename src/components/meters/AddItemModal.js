import React from 'react';
import { AiOutlineClose } from 'react-icons/ai'; // React icons
import './AddItemModal.css'; // Import the CSS styles
import axiosInstance from '../utils/Axios';


const AddItemModal = ({ isOpen, onClose, onSubmit, itemType, parentName,updateData,itemId }) => {
  if (!isOpen) return null;
  const handleSubmit = async (event) => {
    event.preventDefault();
    const { name } = event.target.elements;
    console.log( parentName)
    console.log(itemId)

    // Define base URL dynamically based on the itemType
    let url = '';
    switch (itemType) {
        case 'Disco':
            url = '/v1/discos';
            break;
        case 'Region':
            url = '/v1/regions';
            break;
        case 'Division':
            url = '/v1/divisions';
            break;
        case 'Subdivision':
            url = '/v1/subdivisions';
            break;
        default:
            console.error('Invalid item type');
            return;
    }

    try {
        const response = await axiosInstance.post(url, { name: name.value, parentName ,itemId  });
        console.log('Creation successful:', response.data);
        updateData()
        onClose(); // Assuming onClose will close the modal and refresh the data
    } catch (error) {
        console.error('Error creating item:', error.response ? error.response.data : error.message);
    }
};

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h5>Add <strong>{itemType}</strong></h5>
          <button onClick={onClose} className="close-button"><AiOutlineClose /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="input-group">
              <label><strong>{itemType}:</strong></label>
              <input type="text" name="name" placeholder={`Enter ${itemType} name`} required />
            </div>
          </div>
          <div className="modal-footer">
            <button type="submit" className="btn btn-primary">Submit</button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;
