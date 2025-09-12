import { useRef, useEffect, useState } from 'react';

const Searchbar = ({
  searchQuery,
  setSearchQuery,
  columnConfig,
  visibleColumns,
  toggleColumn,
  columnSettingsOpen,
  setColumnSettingsOpen,
  resetColumns,
  restoreAllColumns,
}) => {
  const settingsRef = useRef(null);
  const buttonRef = useRef(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        setColumnSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setColumnSettingsOpen]);

  useEffect(() => {
    if (columnSettingsOpen) {
      setDropdownVisible(true);
    } else {
      const timeout = setTimeout(() => setDropdownVisible(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [columnSettingsOpen]);

  return (
    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
      {/* Search input */}
      <div className="d-flex align-items-center gap-2 position-relative">
        <input
          type="text"
          placeholder="Search insurance plans..."
          className="form-control form-control-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            minWidth: '300px',
            maxWidth: '300px',
            fontSize: '0.85rem',
            borderRadius: '6px',
          }}
        />

        {/* Column settings button */}
        <button
          ref={buttonRef}
          className="btn btn-sm border fw-semibold text-dark bg-light border-secondary"
          style={{
            borderRadius: '6px',
            fontSize: '0.75rem',
            backgroundColor: columnSettingsOpen ? '#005b7f' : undefined,
            color: columnSettingsOpen ? 'white' : undefined,
          }}
          onClick={() => setColumnSettingsOpen(!columnSettingsOpen)}
          title="Column settings"
        >
          ⚙️
        </button>

        {/* Dropdown */}
        {dropdownVisible && (
          <div
            ref={settingsRef}
            className="bg-white shadow p-3 border rounded position-absolute"
            style={{
              top: 'calc(100% + 4px)',
              right: 0,
              zIndex: 9999,
              minWidth: '240px',
              maxHeight: '60vh',
              overflowY: 'auto',
              transition: 'opacity 0.2s ease, transform 0.2s ease',
              opacity: columnSettingsOpen ? 1 : 0,
              transform: columnSettingsOpen ? 'translateY(0)' : 'translateY(-10px)',
            }}
          >
            <h6 className="fw-bold mb-2 text-blue">Table Columns</h6>

            {columnConfig.map(({ key, label }) => (
              <div key={key} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`column-toggle-${key}`}
                  checked={!!visibleColumns[key]}
                  onChange={() => toggleColumn(key)}
                />
                <label className="form-check-label" htmlFor={`column-toggle-${key}`}>
                  {label}
                </label>
              </div>
            ))}

            <hr />

            <button
              type="button"
              className="btn btn-outline-info btn-sm w-100 mb-2"
              onClick={() => resetColumns()}
            >
              🔄 Reset to Default
            </button>
            <button
              type="button"
              className="btn btn-outline-success btn-sm w-100"
              onClick={restoreAllColumns}
            >
              🔁 Show All Columns
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Searchbar;
