import React from 'react';

const Searchbar = ({ showType, setShowType, searchQuery, setSearchQuery }) => {
  return (
    <div className="d-flex align-items-center justify-content-between gap-3">
      {/* Left-aligned buttons */}
      <div className="btn-group">
        <button
          onClick={() => setShowType('table')}
          className={`toggle-btn btn ${showType === 'table' ? 'btn-primary' : 'btn-secondary'}`}
        >
          📋
        </button>
        <button
          onClick={() => setShowType('card')}
          className={`toggle-btn btn ${showType === 'card' ? 'btn-primary' : 'btn-secondary'}`}
        >
          🗂️
        </button>
      </div>

      {/* Centered search bar */}
      <div className="d-flex align-items-center justify-content-center w-100">
        <input
          type="text"
          placeholder="Search insurance plans..."
          className="form-control search-bar w-100"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Searchbar;
