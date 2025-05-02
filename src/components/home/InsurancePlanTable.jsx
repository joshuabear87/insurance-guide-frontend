import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import InsurancePlanModalContent from '../InsurancePlanModalContent';
import columnConfig from '../utils/columnConfig';

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
          style={{ fontSize: '0.75rem', tableLayout: 'auto' }}
        >
          <thead className="table-primary">
            <tr>
              {isAuthenticated && (
                <th
                  style={{
                    backgroundColor: '#005b7f',
                    color: 'white',
                    userSelect: 'none',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '180px',
                  }}
                >
                  Operations
                </th>
              )}
              {columnConfig.map(({ key, label }) =>
                visibleColumns[key] ? (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    style={{
                      backgroundColor: '#005b7f',
                      color: 'white',
                      cursor: 'pointer',
                      userSelect: 'none',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '180px',
                    }}
                  >
                    {label} {sortColumn === key && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                ) : null
              )}
            </tr>
          </thead>
          <tbody>
            {sortedBooks.map((book) => (
              <tr
                key={book._id}
                onClick={() => setSelectedBook(book)}
                style={{ cursor: 'pointer' }}
              >
                {isAuthenticated && (
                  <td
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '180px',
                    }}
                  >
                    <Link to={`/books/edit/${book._id}`}>
                      <AiOutlineEdit className="fs-5 text-primary" />
                    </Link>
                  </td>
                )}
                {columnConfig.map(({ key, render, component: Comp }) => {
                  if (!visibleColumns[key]) return null;
                  const value = getNestedValue(book, key);
                  return (
                    <td
                      key={key}
                      title={value != null ? String(value) : ''}
                      style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '180px',
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