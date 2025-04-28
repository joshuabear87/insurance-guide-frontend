import React from 'react';

const ContractStatusBadge = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case 'Contracted':
        return { backgroundColor: '#d4edda', color: '#155724' }; // Light green bg, dark green text
      case 'Not Contracted':
        return { backgroundColor: '#f8d7da', color: '#721c24' }; // Light red bg, dark red text
      case 'Must call to confirm':
        return { backgroundColor: '#fff3cd', color: '#856404' }; // Light yellow bg, dark gold text
      default:
        return { backgroundColor: '#e2e3e5', color: '#383d41' }; // Light gray bg, dark gray text
    }
  };

  return (
    <div
      className="rounded-3 px-3 py-1 fw-semibold small"
      style={{
        ...getStyles(),
        borderRadius: '30px',
        padding: '5px 15px',
        display: 'inline-block',
        textAlign: 'center',
        minWidth: '120px',
      }}
    >
      {status || 'N/A'}
    </div>
  );
};

export default ContractStatusBadge;
