import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import InsurancePlanModalContent from '../InsurancePlanModalContent';
import columnConfig from '../utils/columnConfig';

// Helper to access nested fields
const getNestedValue = (obj, path) =>
  path.split('.').reduce((acc, key) => acc?.[key], obj);

const InsurancePlanTable = ({ books, visibleColumns }) => {
  const isAuthenticated = !!localStorage.getItem('accessToken');
  const [selectedBook, setSelectedBook] = useState(null);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (key) => {
    if (sortColumn === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(key);
      setSortDirection('asc');
    }
  };

  const sortedBooks = [...books].sort((a, b) => {
    if (!sortColumn) return 0;

    const aVal = getNestedValue(a, sortColumn) ?? '';
    const bVal = getNestedValue(b, sortColumn) ?? '';

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }

    return sortDirection === 'asc'
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  return (
    <>
      <div className="table-responsive">
      <table
  className="table table-bordered table-hover align-middle responsive-table"
  style={{ fontSize: '0.75rem' }}
>          <thead className="table-primary">
            <tr>
              {columnConfig.map(({ key, label }) =>
                visibleColumns[key] ? (
                  <th
  key={key}
  className="text-nowrap"
  onClick={() => handleSort(key)}
  style={{
    backgroundColor: '#005b7f',
    color: 'white',
    cursor: 'pointer',
    userSelect: 'none',
  }}
>

                    {label}{' '}
                    {sortColumn === key && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                ) : null
              )}
              {isAuthenticated && <th>Operations</th>}
            </tr>
          </thead>
          <tbody>
            {sortedBooks.map((book) => (
              <tr
                key={book._id}
                onClick={() => setSelectedBook(book)}
                style={{ cursor: 'pointer' }}
              >
                {columnConfig.map(({ key, render, component: Comp, truncate }) => {
                  if (!visibleColumns[key]) return null;
                  const value = getNestedValue(book, key);

                  return (
                    <td
                      key={key}
                      title={truncate ? value : ''}
                      className={truncate ? 'text-truncate' : ''}
                      style={{
                        whiteSpace: truncate ? 'nowrap' : 'normal',
                        overflow: truncate ? 'hidden' : 'visible',
                        textOverflow: truncate ? 'ellipsis' : 'unset',
                        maxWidth: truncate ? '200px' : undefined, // ✅ restrict width only if truncated
                      }}
                    >
                      {render
                        ? render(value)
                        : Comp
                        ? <Comp status={value} />
                        : value || 'N/A'}
                    </td>
                  );
                })}

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
