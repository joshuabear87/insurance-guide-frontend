import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import blueCardColumnConfig from '../utils/blueCardColumnConfig';

const getNestedValue = (obj, path) =>
  path.split('.').reduce((acc, key) => acc?.[key], obj);

const BlueCardCardViewContent = ({ row, visibleColumns, onSelect }) => {
  const isAuthenticated = !!localStorage.getItem('accessToken');

  const orderedKeys = [
    ...(isAuthenticated ? ['_operations'] : []),
    ...blueCardColumnConfig.map((c) => c.key),
  ];

  return (
    <div
      className="card h-100 border-0 shadow-sm p-3"
      onClick={onSelect}
      style={{ cursor: 'pointer' }}
    >
      {orderedKeys.map((key) => {
        if (key !== '_operations' && !visibleColumns[key]) return null;

        if (key === '_operations') {
          return (
            <div
              key={key}
              className="d-flex justify-content-end mb-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Link to={`/books/edit/${row.book._id}`}>
                <AiOutlineEdit className="fs-5 text-primary" />
              </Link>
            </div>
          );
        }

        const col = blueCardColumnConfig.find((c) => c.key === key);
        if (!col) return null;
        const value = getNestedValue(row, key);
        const rendered = col.render ? col.render(value) : null;

        if ((key === 'image' || key === 'secondaryImage') && React.isValidElement(rendered)) {
          return (
            <div key={key} className="text-center my-2">
              {React.cloneElement(rendered, {
                style: {
                  width: '100%',
                  maxHeight: '220px',
                  objectFit: 'contain',
                  ...rendered.props?.style,
                },
              })}
            </div>
          );
        }

        return (
          <p
            key={key}
            className={col.truncate ? 'text-truncate' : ''}
            style={col.truncate ? { maxWidth: '100%' } : {}}
          >
            <strong>{col.label}:</strong>{' '}
            {rendered ?? value ?? 'N/A'}
          </p>
        );
      })}
    </div>
  );
};

export default BlueCardCardViewContent;