import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import blueCardColumnConfig from '../utils/blueCardColumnConfig';
import { isAdmin } from '../utils/auth';
import { getNestedValue } from '../../components/utils/helpers';

const BlueCardTableView = ({
  rows,
  sortColumn,
  sortDirection,
  handleSort,
  visibleColumns,
  onSelect,
}) => {
  const admin = isAdmin();

  return (
    <div className="table-responsive" style={{ fontSize: '0.75rem' }}>
      <table className="table table-bordered table-hover align-middle">
        <thead>
          <tr>
            {admin && (
              <th style={{ backgroundColor: '#005b7f', color: 'white' }}>Operations</th>
            )}
            <th style={{ backgroundColor: '#005b7f', color: 'white' }}>Prefix</th>
            {blueCardColumnConfig.map((col) => {
              if (col.key === 'prefix' || !visibleColumns[col.key]) return null;
              return (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  style={{
                    backgroundColor: '#005b7f',
                    color: 'white',
                    cursor: 'pointer',
                    userSelect: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col.label} {sortColumn === col.key && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={`${row.prefix}-${i}`} onClick={() => onSelect(row.book)} style={{ cursor: 'pointer' }}>
              {admin && (
                <td onClick={(e) => e.stopPropagation()}>
                  <Link to={`/books/edit/${row.book._id}`}>
                    <AiOutlineEdit className="fs-5 text-primary" />
                  </Link>
                </td>
              )}
              <td>{row.prefix}</td>
              {blueCardColumnConfig.map(({ key, render }) => {
                if (key === 'prefix' || !visibleColumns[key]) return null;
                const value = getNestedValue(row, key);
                return (
                  <td
                    key={key}
                    title={typeof value === 'string' ? value : ''}
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: key.includes('image') ? '150px' : '180px',
                    }}
                  >
                    {render
                      ? render(value)
                      : typeof value === 'string' || typeof value === 'number'
                      ? value || '-'
                      : '-'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BlueCardTableView;
