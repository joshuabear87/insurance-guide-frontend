import React, { useState, useEffect, useMemo } from 'react';
import API from '../axios';
import Spinner from '../components/Spinner';
import InsurancePlanModalContent from '../components/InsurancePlanModalContent';
import PlanFilterPills from '../components/PlanFilterPills';
import BlueCardSearchbar from '../components/BlueCardSearchbar';
import BlueCardCardView from '../components/home/BlueCardCardView';
import blueCardColumnConfig from '../components/utils/blueCardColumnConfig';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';

const getNestedValue = (obj, path) =>
  path.split('.').reduce((acc, key) => acc?.[key], obj);

const BlueCardPrefixesPage = () => {
  const [prefixRows, setPrefixRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortColumn, setSortColumn] = useState('prefix');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showType, setShowType] = useState('table');
  const [columnSettingsOpen, setColumnSettingsOpen] = useState(false);

  const isAuthenticated = !!localStorage.getItem('accessToken');

  const [visibleColumns, setVisibleColumns] = useState(() => {
    const saved = localStorage.getItem('visibleBlueCardColumns');
    const initial = {};
    blueCardColumnConfig.forEach((col) => {
      initial[col.key] = col.key === 'prefix' ? true : saved ? JSON.parse(saved)[col.key] ?? true : true;
    });
    return initial;
  });

  const toggleColumn = (key) => {
    if (key === 'prefix') return; // Prefix always shown
    const updated = { ...visibleColumns, [key]: !visibleColumns[key] };
    setVisibleColumns(updated);
    localStorage.setItem('visibleBlueCardColumns', JSON.stringify(updated));
  };

  const resetColumns = () => {
    const defaults = {
      prefix: true,
      planName: true,
      planCode: true,
      samcContracted: true,
      samfContracted: true,
      authorizationNotes: true,
      notes: true,
      image: true,
    };
    blueCardColumnConfig.forEach((col) => {
      if (!defaults.hasOwnProperty(col.key)) {
        defaults[col.key] = false;
      }
    });
    setVisibleColumns(defaults);
    localStorage.setItem('visibleBlueCardColumns', JSON.stringify(defaults));
  };

  const restoreAllColumns = () => {
    const allVisible = {};
    blueCardColumnConfig.forEach((col) => {
      allVisible[col.key] = true;
    });
    setVisibleColumns(allVisible);
    localStorage.setItem('visibleBlueCardColumns', JSON.stringify(allVisible));
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await API.get('/books');
        const plans = res.data.data;
        const rows = [];
        plans.forEach((plan) => {
          const prefixes = plan.prefixes || [];
          prefixes.forEach((p) => {
            rows.push({
              ...plan,
              prefix: p.value,
              book: plan,
            });
          });
        });
        setPrefixRows(rows);
      } catch (err) {
        console.error('Failed to load plans:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleSort = (key) => {
    if (sortColumn === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(key);
      setSortDirection('asc');
    }
  };

  const filteredRows = useMemo(() => {
    return prefixRows
      .filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
      .sort((a, b) => {
        const aVal = getNestedValue(a, sortColumn) ?? '';
        const bVal = getNestedValue(b, sortColumn) ?? '';
        return sortDirection === 'asc'
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
  }, [prefixRows, sortColumn, sortDirection, searchQuery]);

  const orderedKeys = [
    ...(isAuthenticated ? [] : ['prefix']),
    ...blueCardColumnConfig.map((c) => c.key).filter((key) => key !== 'prefix'),
  ];

  return (
    <>
      <PlanFilterPills />

      <BlueCardSearchbar
        showType={showType}
        setShowType={setShowType}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        columnConfig={blueCardColumnConfig}
        visibleColumns={visibleColumns}
        toggleColumn={toggleColumn}
        columnSettingsOpen={columnSettingsOpen}
        setColumnSettingsOpen={setColumnSettingsOpen}
        resetColumns={resetColumns}
        restoreAllColumns={restoreAllColumns}
      />

      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <Spinner />
        </div>
      ) : showType === 'table' ? (
        <div className="table-responsive" style={{ fontSize: '0.75rem' }}>
          <table className="table table-bordered table-hover align-middle">
            <thead>
              <tr>
                {isAuthenticated && (
                  <th
                    style={{
                      backgroundColor: '#005b7f',
                      color: 'white',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Operations
                  </th>
                )}
                <th
                  style={{
                    backgroundColor: '#005b7f',
                    color: 'white',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Prefix
                </th>
                {orderedKeys.map((key) => {
                  const col = blueCardColumnConfig.find((c) => c.key === key);
                  if (!col || !visibleColumns[key]) return null;
                  return (
                    <th
                      key={key}
                      onClick={() => handleSort(key)}
                      style={{
                        backgroundColor: '#005b7f',
                        color: 'white',
                        cursor: 'pointer',
                        userSelect: 'none',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {col.label}{' '}
                      {sortColumn === key && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, i) => (
                <tr
                  key={`${row.prefix}-${i}`}
                  onClick={() => setSelectedBook(row.book)}
                  style={{ cursor: 'pointer' }}
                >
                  {isAuthenticated && (
                    <td onClick={(e) => e.stopPropagation()}>
                      <Link to={`/books/edit/${row.book._id}`}>
                        <AiOutlineEdit className="fs-5 text-primary" />
                      </Link>
                    </td>
                  )}
                  <td>{row.prefix}</td>
                  {orderedKeys.map((key) => {
                    const col = blueCardColumnConfig.find((c) => c.key === key);
                    if (!col || !visibleColumns[key]) return null;
                    const value = getNestedValue(row, key);
                    return (
                      <td key={key}>
                        {col.render ? col.render(value) : value || 'N/A'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <BlueCardCardView
          rows={filteredRows}
          visibleColumns={visibleColumns}
          onSelect={(book) => setSelectedBook(book)}
        />
      )}

      {selectedBook && (
        <InsurancePlanModalContent
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </>
  );
};

export default BlueCardPrefixesPage;
