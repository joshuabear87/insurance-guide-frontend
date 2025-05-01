import React from 'react';

const Searchbar = ({ showType, setShowType, searchQuery, setSearchQuery }) => {
  return (
    <div className="d-flex align-items-center gap-2 flex-nowrap w-100 mb-3">
      {/* Toggle Buttons */}
      <div className="btn-group flex-shrink-0">
        <button
          onClick={() => setShowType('table')}
          className={`btn ${showType === 'table' ? 'btn-primary' : 'btn-secondary'}`}
        >
          📋
        </button>
        <button
          onClick={() => setShowType('card')}
          className={`btn ${showType === 'card' ? 'btn-primary' : 'btn-secondary'}`}
        >
          🗂️
        </button>
      </div>

      {/* Shrinkable search input */}
      <input
        type="text"
        placeholder="Search insurance plans..."
        className="form-control search-bar flex-grow-1"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ minWidth: '100px' }} // prevents disappearing
      />
    </div>
  );
};

export default Searchbar;
