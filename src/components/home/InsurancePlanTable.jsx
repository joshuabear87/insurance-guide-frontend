// InsurancePlanTable.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import ContractStatusBadge from '../ContractStatusBadge';
import InsurancePlanModalContent from '../InsurancePlanModalContent';

const columnConfig = [
  { key: 'financialClass', label: 'Financial Class' },
  { key: 'descriptiveName', label: 'Descriptive Name' },
  { key: 'payerName', label: 'Payer Name' },
  { key: 'payerCode', label: 'Payer Code' },
  { key: 'planName', label: 'Plan Name' },
  { key: 'planCode', label: 'Plan Code' },
  { key: 'samcContracted', label: 'SAMC', component: ContractStatusBadge },
  { key: 'samfContracted', label: 'SAMF', component: ContractStatusBadge },
  { key: 'prefixes', label: 'Prefixes', render: (val) => val?.map(p => p.value).join(', ') },
  { key: 'ipaPayerId', label: 'IPA Payer ID' },
  { key: 'payerId', label: 'Payer ID' },
  { key: 'authorizationNotes', label: 'Auth Notes', truncate: true },
  { key: 'notes', label: 'Notes', truncate: true },
  { key: 'facilityAddress.street', label: 'Facility Street' },
  { key: 'facilityAddress.city', label: 'Facility City' },
  { key: 'facilityAddress.state', label: 'Facility State' },
  { key: 'facilityAddress.zip', label: 'Facility ZIP' },
  { key: 'providerAddress.street', label: 'Provider Street' },
  { key: 'providerAddress.city', label: 'Provider City' },
  { key: 'providerAddress.state', label: 'Provider State' },
  { key: 'providerAddress.zip', label: 'Provider ZIP' },
  { key: 'image', label: 'Image', render: (val) => val ? <img src={val} alt="card" style={{ width: 60 }} /> : 'N/A' },
  { key: 'secondaryImage', label: 'Secondary', render: (val) => val ? <img src={val} alt="card" style={{ width: 60 }} /> : 'N/A' },
];

const getNestedValue = (obj, path) => path.split('.').reduce((acc, key) => acc?.[key], obj);

const InsurancePlanTable = ({ books }) => {
  const isAuthenticated = !!localStorage.getItem('accessToken');
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const saved = localStorage.getItem('visiblePlanColumns');
    if (saved) return JSON.parse(saved);
    const initial = {};
    columnConfig.forEach(col => initial[col.key] = true);
    return initial;
  });

  const [selectedBook, setSelectedBook] = useState(null);
  const [columnSettingsOpen, setColumnSettingsOpen] = useState(false);
  const settingsRef = useRef(null);
  const buttonRef = useRef(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

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
  }, []);

  const toggleColumn = (key) => {
    const updated = { ...visibleColumns, [key]: !visibleColumns[key] };
    setVisibleColumns(updated);
    localStorage.setItem('visiblePlanColumns', JSON.stringify(updated));
  };

  const handleSettingsToggle = () => {
    const rect = buttonRef.current.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + window.scrollY + 4,
      left: rect.right + window.scrollX - 260, // align left by subtracting width
    });
    setColumnSettingsOpen(prev => !prev);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="flex-grow-1" />
        <div>
          <button
            ref={buttonRef}
            className="btn btn-sm m-2 p-0 fs-4"
            onClick={handleSettingsToggle}
          >
            ⚙️
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle responsive-table">
          <thead className="table-primary">
            <tr>
              {columnConfig.map(({ key, label }) =>
                visibleColumns[key] && (
                  <th key={key} className="text-nowrap">{label}</th>
                )
              )}
              {isAuthenticated && <th>Operations</th>}
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book._id} onClick={() => setSelectedBook(book)} style={{ cursor: 'pointer' }}>
                {columnConfig.map(({ key, render, component: Comp, truncate }) =>
                  visibleColumns[key] && (
                    <td
                      key={key}
                      title={truncate ? getNestedValue(book, key) : ''}
                      className={truncate ? 'text-truncate' : ''}
                      style={{
                        maxWidth: truncate ? '180px' : 'auto',
                        whiteSpace: truncate ? 'nowrap' : 'normal',
                        overflow: 'hidden',
                        textOverflow: truncate ? 'ellipsis' : 'unset',
                      }}
                    >
                      {render
                        ? render(getNestedValue(book, key))
                        : Comp
                          ? <Comp status={getNestedValue(book, key)} />
                          : getNestedValue(book, key) || 'N/A'}
                    </td>
                  )
                )}
                {isAuthenticated && (
                  <td onClick={(e) => e.stopPropagation()}>
                    <Link to={`/books/edit/${book._id}`}>
                      <AiOutlineEdit className="fs-5 text-primary" />
                    </Link>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Floating Column Dropdown */}
      {columnSettingsOpen && (
        <div
          ref={settingsRef}
          className="bg-white shadow p-3 border rounded"
          style={{
            position: 'fixed',
            top: dropdownPos.top,
            left: dropdownPos.left,
            zIndex: 9999,
            minWidth: '240px',
            maxHeight: '50vh',
            overflowY: 'auto',
          }}
        >
          {columnConfig.map(({ key, label }) => (
            <div key={key} className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id={key}
                checked={visibleColumns[key]}
                onChange={() => toggleColumn(key)}
              />
              <label className="form-check-label" htmlFor={key}>{label}</label>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedBook && (
  <InsurancePlanModalContent
    book={selectedBook}
    onClose={() => setSelectedBook(null)}
  />
)}
    </>
  );
};

export default InsurancePlanTable;