import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import columnConfig from '../utils/columnConfig';
import { isAdmin } from '../utils/auth';
import InsurancePlanModalContent from '../InsurancePlanModalContent';
import { getNestedValue, getContractColor } from '../../components/utils/helpers';
import { FacilityContext } from '../../context/FacilityContext';

const InsurancePlanTable = ({ books, visibleColumns, sortConfig, setSortConfig }) => {
  const [selectedBook, setSelectedBook] = useState(null);
  const admin = isAdmin();
  const { facilityTheme } = useContext(FacilityContext);

  const handleSort = (key) => {
    if (!setSortConfig) return;
    setSortConfig(prev => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { key, direction: 'asc' };
    });
  };

  return (
    <>
      <div className="table-responsive">
        <table className="table table-bordered align-middle responsive-table" style={{ fontSize: '0.75rem', tableLayout: 'auto' }}>
          <thead>
            <tr>
              {admin && (
                <th style={{ backgroundColor: facilityTheme.primaryColor, color: 'white' }}>Operations</th>
              )}
              {columnConfig.map(({ key, label }) =>
                visibleColumns[key] ? (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    style={{
                      backgroundColor: facilityTheme.primaryColor,
                      color: 'white',
                      cursor: 'pointer',
                      userSelect: 'none',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '180px',
                    }}
                  >
                    {label}
                    {sortConfig?.key === key && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
                  </th>
                ) : null
              )}
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book._id} onClick={() => setSelectedBook(book)} style={{ cursor: 'pointer' }}>
                {admin && (
                  <td onClick={(e) => e.stopPropagation()}>
                    <Link to={`/books/edit/${book._id}`}>
                      <AiOutlineEdit className="fs-5 text-primary" />
                    </Link>
                  </td>
                )}
                {columnConfig.map(({ key, render, component: Comp }) => {
                  if (!visibleColumns[key]) return null;

                  const value = getNestedValue(book, key);
                  let renderedValue;

                  if (key === 'facilityContracts') {
                    renderedValue =
                      value?.length > 0 ? (
                        <ul className="list-unstyled mb-0">
                          {value.map((contract, idx) => (
                            <li key={idx} style={{ color: getContractColor(contract.contractStatus) }}>
                              <strong>{contract.facilityName}</strong>: {contract.contractStatus}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        '-'
                      );
                  } else if (render) {
                    renderedValue = render(value);
                  } else if (Comp) {
                    renderedValue = <Comp status={value} />;
                  } else {
                    renderedValue = value || '-';
                  }

                  const isObject = typeof value === 'object' && value !== null;

                  return (
                    <td
                      key={key}
                      title={!isObject ? String(value) : ''}
                      style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '300px',
                      }}
                    >
                      {renderedValue}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedBook && (
        <InsurancePlanModalContent book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </>
  );
};

export default InsurancePlanTable;
