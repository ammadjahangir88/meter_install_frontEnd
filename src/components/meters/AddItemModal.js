import React from 'react';
import { AiOutlineClose } from 'react-icons/ai'; // React icons
import './AddItemModal.css'; // Import the CSS styles

const AddItemModal = ({ isOpen, onClose, onSubmit, itemType }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h5>Add <strong>{itemType}</strong></h5>
          <button onClick={onClose} className="close-button"><AiOutlineClose /></button>
        </div>
        <form onSubmit={onSubmit}>
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
