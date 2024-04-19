import React from 'react';
import './ConfirmationModal.css';

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
    return (
      <div className="confirmation-modal">
        <p className="message" dangerouslySetInnerHTML={{ __html: message }}></p>
        <div className="button-container">
          <button className="confirm-button" onClick={onConfirm}>
            Yes
          </button>
          <button className="cancel-button" onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    );
  };
  

export default ConfirmationModal;
