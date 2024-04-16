import React from 'react';
import './index.css'
const Pagination = ({ currentPage, itemsPerPage, totalItems, onPageChange }) => {
  return (
    <div className="pagination-container">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-button"
      >
        Previous
      </button>
      <span className="pagination-text">
        Page {currentPage} of {Math.ceil(totalItems / itemsPerPage)}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={totalItems <= currentPage * itemsPerPage}
        className="pagination-button"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
