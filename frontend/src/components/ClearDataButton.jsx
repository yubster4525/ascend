import React, { useState } from 'react';
import { clearAppData } from '../utils/storageUtils';

/**
 * A button component to clear all application data with a confirmation dialog
 */
const ClearDataButton = ({ className = '', buttonText = 'Clear All Data' }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClearClick = () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete ALL your data? This action cannot be undone.'
    );

    if (confirmDelete) {
      setIsDeleting(true);
      
      // Small delay to show loading state
      setTimeout(() => {
        try {
          clearAppData();
          alert('All data has been successfully cleared. The page will now reload.');
          window.location.reload();
        } catch (error) {
          console.error('Error clearing data:', error);
          alert('There was an error clearing your data. Please try again.');
          setIsDeleting(false);
        }
      }, 500);
    }
  };

  return (
    <button
      className={`clear-data-btn ${className}`}
      onClick={handleClearClick}
      disabled={isDeleting}
    >
      {isDeleting ? 'Clearing...' : buttonText}
    </button>
  );
};

export default ClearDataButton;