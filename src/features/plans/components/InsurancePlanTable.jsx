import React, { useState, useContext, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';

import { isAdmin } from '../../../utils/auth';
import InsurancePlanModalContent from '../context/InsurancePlanModalContent';
import { getNestedValue, getContractColor } from '../../../utils/helpers';
import { FacilityContext } from '../../components/context/FacilityContext';
import { makeHighlighter } from '../../../utils/highlight';
import '../../../styles/resizable-table.css';

const InsurancePlanTable = ({
  books,
  visibleColumns,
  sortConfig,
  setSortConfig,
  searchQuery = '',
  prefixQuery = '',
  order = [],
  columnConfig = [],
}) => {
  const [selectedBook, setSelectedBook] = useState(null);
  const admin = isAdmin();
  const { facilityTheme } = useContext(FacilityContext);

  // === Highlight helpers ===
  const hl = useMemo(() => makeHighlighter(searchQuery), [searchQuery]);
  const hlPref = useMemo(() => makeHighlighter(prefixQuery), [prefixQuery]);

  // === Column widths (resizable + persisted) ===
  const DEFAULT_WIDTH = 220;
  const MIN_WIDTH = 120;

  const orderedVisibleKeys = useMemo(
    () => order.filter((k) => visibleColumns[k]),
    [order, visibleColumns]
  );

  const [colWidths, setColWidths] = useState(() => {
    const saved = localStorage.getItem('planTableColumnWidths_v1');
    if (saved) return JSON.parse(saved);
    const seed = {};
    orderedVisibleKeys.forEach((k) => (seed[k] = DEFAULT_WIDTH));
    return seed;
  });

  // Ensure a width exists for every visible key
  useEffect(() => {
    setColWidths((prev) => {
      const next = { ...prev };
      let changed = false;
      orderedVisibleKeys.forEach((k) => {
        if (next[k] == null) {
          next[k] = DEFAULT_WIDTH;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [orderedVisibleKeys]);

  useEffect(() => {
    localStorage.setItem('planTableColumnWidths_v1', JSON.stringify(colWidths));
  }, [colWidths]);

  // Drag logic (mouse + touch)
  const startXRef = useRef(0);
  const startWRef = useRef(0);
  const keyRef = useRef(null);

  const onMove = (clientX) => {
    if (!keyRef.current) return;
    const dx = clientX - startXRef.current;
    const newW = Math.max(MIN_WIDTH, startWRef.current + dx);
    setColWidths((prev) => ({ ...prev, [keyRef.current]: newW }));
  };

  const onMouseMove = (e) => onMove(e.clientX);
  const onTouchMove = (e) => {
    if (e.touches?.[0]) onMove(e.touches[0].clientX);
  };

  const stopDrag = () => {
    keyRef.current = null;
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', stopDrag);
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('touchend', stopDrag);
  };

  const startDrag = (e, key) => {
    e.preventDefault();
    e.stopPropagation();
    const clientX = e.touches?.[0]?.clientX ?? e.clientX;
    startXRef.current = clientX;
    startWRef.current = colWidths[key] ?? DEFAULT_WIDTH;
    keyRef.current = key;
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', stopDrag);
  };

  // Sorting
  const handleSort = (key) => {
    if (!setSortConfig) return;
    setSortConfig((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' }
    );
  };

  // Default renderer with highlighting + wrapping
  const renderDefault = (key, value) => {
    if (key === 'prefix') return value ? hlPref(String(value)) : '-';
    if (Array.isArray(value)) return hl(value.join(', '));
    return value ? hl(String(value)) : '-';
  };

  const colMeta = (key) => columnConfig.find((c) => c.key === key);

  return (
    <>
      <div className="table-responsive">
        <table
          className="table table-bordered align-middle responsive-table"
          style={{
            fontSize: '0.75rem',
            tableLayout: 'fixed',
            width: '100%',
          }}
        >
          <colgroup>
            {admin && <col style={{ width: 80 }} />}
            {orderedVisibleKeys.map((k) => (
              <col key={k} style={{ width: colWidths[k] ?? DEFAULT_WIDTH }} />
            ))}
          </colgroup>

          <thead>
            <tr>
              {admin && (
                <th
                  style={{
                    backgroundColor: facilityTheme.primaryColor,
                    color: 'white',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Operations
                </th>
              )}

              {orderedVisibleKeys.map((key) => {
                const meta = colMeta(key);
                if (!meta) return null;
                return (
                  <th
                    key={key}
                    className="th-resizable"
                    onClick={() => handleSort(key)}
                    title="Click to sort; drag handle to resize"
                    style={{
                      backgroundColor: facilityTheme.primaryColor,
                      color: 'white',
                      userSelect: 'none',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {meta.label}
                    {sortConfig?.key === key && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}

                    <span
                      className="col-resizer"
                      onMouseDown={(e) => startDrag(e, key)}
                      onTouchStart={(e) => startDrag(e, key)}
                    />
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {books.map((book) => (
              <tr
                key={book._id}
                onClick={() => setSelectedBook(book)}
                style={{ cursor: 'pointer' }}
              >
                {admin && (
                  <td onClick={(e) => e.stopPropagation()}>
                    <Link to={`/books/edit/${book._id}`}>
                      <AiOutlineEdit className="fs-5 text-primary" />
                    </Link>
                  </td>
                )}

                {orderedVisibleKeys.map((key) => {
                  const meta = colMeta(key);
                  if (!meta) return null;

                  const value = getNestedValue(book, key);
                  let renderedValue;

                  if (key === 'facilityContracts') {
                    renderedValue =
                      value?.length > 0 ? (
                        <ul className="list-unstyled mb-0">
                          {value.map((contract, idx) => (
                            <li
                              key={idx}
                              style={{ color: getContractColor(contract.contractStatus) }}
                            >
                              <strong>{hl(contract.facilityName ?? '')}</strong>: {hl(contract.contractStatus ?? '')}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        '-'
                      );
                  }
                  // ✅ Force Prefixes column to use the prefix highlighter, regardless of columnConfig
                  else if (key === 'prefixes') {
                    const arr = Array.isArray(value) ? value : [];
                    renderedValue =
                      arr.length > 0
                        ? arr.map((p, i) => (
                            <span key={i}>
                              {hlPref(p?.value ?? '')}
                              {i < arr.length - 1 ? ', ' : ''}
                            </span>
                          ))
                        : '-';
                  }
                  // custom render (pass hl + hlPrefix for other cells)
                  else if (typeof meta.render === 'function') {
                    renderedValue = meta.render(value, book, { hl, hlPrefix: hlPref });
                  }
                  // component renderer
                  else if (meta.component) {
                    const Comp = meta.component;
                    renderedValue = <Comp status={value} />;
                  }
                  // default
                  else {
                    renderedValue = renderDefault(key, value);
                  }

                  const isObject = typeof value === 'object' && value !== null;

                  return (
                    <td
                      key={key}
                      title={!isObject ? String(value ?? '') : ''}
                      style={{
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                        overflowWrap: 'anywhere',
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
        <InsurancePlanModalContent
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </>
  );
};

export default InsurancePlanTable;
