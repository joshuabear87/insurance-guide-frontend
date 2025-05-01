import React, { useState, useEffect, useMemo } from 'react';
import API from '../axios';
import Spinner from '../components/Spinner';
import InsurancePlanModalContent from '../components/InsurancePlanModalContent';
import { useNavigate, useLocation } from 'react-router-dom';
import PlanFilterPills from '../components/PlanFilterPills';
import Searchbar from '../components/Searchbar';
import columnConfig from '../components/utils/columnConfig';

const getNestedValue = (obj, path) => path.split('.').reduce((acc, key) => acc?.[key], obj);

const BlueCardPrefixesPage = () => {
  const [prefixRows, setPrefixRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortColumn, setSortColumn] = useState('prefix');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [columnSettingsOpen, setColumnSettingsOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const saved = localStorage.getItem('visibleBlueCardColumns');
    if (saved) return JSON.parse(saved);
    const defaults = {
      prefix: true,
      planName: true,
      planCode: true,
      descriptiveName: true,
      phoneNumbers: true,
      image: true,
    };
    return defaults;
  });

  const toggleColumn = (key) => {
    const updated = { ...visibleColumns, [key]: !visibleColumns[key] };
    setVisibleColumns(updated);
    localStorage.setItem('visibleBlueCardColumns', JSON.stringify(updated));
  };

  const resetColumns = () => {
    const defaults = {
      prefix: true,
      planName: true,
      planCode: true,
      descriptiveName: true,
      phoneNumbers: true,
      image: true,
    };
    setVisibleColumns(defaults);
    localStorage.setItem('visibleBlueCardColumns', JSON.stringify(defaults));
  };

  const restoreAllColumns = () => {
    const allVisible = {};
    columnConfig.forEach((col) => {
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
              prefix: p.value,
              planName: plan.planName,
              planCode: plan.planCode,
              descriptiveName: plan.descriptiveName,
              phoneNumbers: plan.phoneNumbers,
              image: plan.image,
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
      .filter((row) => {
        return Object.values(row).some((value) =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        );
      })
      .sort((a, b) => {
        const aVal = getNestedValue(a, sortColumn) ?? '';
        const bVal = getNestedValue(b, sortColumn) ?? '';
        return sortDirection === 'asc'
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
  }, [prefixRows, sortColumn, sortDirection, searchQuery]);

  return (
    <>
      <PlanFilterPills />

      <Searchbar
        showType="table"
        setShowType={() => {}}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        columnConfig={columnConfig}
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
      ) : (
        <div className="table-responsive" style={{ fontSize: '0.75rem' }}>
          <table className="table table-bordered table-hover align-middle">
            <thead>
              <tr>
                {[
                  { key: 'prefix', label: 'Prefix' },
                  { key: 'planName', label: 'Plan Name' },
                  { key: 'planCode', label: 'Plan Code' },
                  { key: 'descriptiveName', label: 'Descriptive Name' },
                  { key: 'phoneNumbers', label: 'Phone Numbers' },
                  { key: 'image', label: 'Card' },
                ].map(({ key, label }) => (
                  visibleColumns[key] && (
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
                      {label} {sortColumn === key && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                  )
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, i) => (
                <tr
                  key={`${row.prefix}-${i}`}
                  onClick={() => setSelectedBook(row.book)}
                  style={{ cursor: 'pointer' }}
                >
                  {visibleColumns.prefix && <td>{row.prefix}</td>}
                  {visibleColumns.planName && <td>{row.planName}</td>}
                  {visibleColumns.planCode && <td>{row.planCode}</td>}
                  {visibleColumns.descriptiveName && <td>{row.descriptiveName}</td>}
                  {visibleColumns.phoneNumbers && (
                    <td>
                      <ul className="list-unstyled mb-0">
                        {row.phoneNumbers?.map((p, idx) => (
                          <li key={idx}>
                            <strong>{p.title}:</strong> {p.number}
                          </li>
                        )) || 'N/A'}
                      </ul>
                    </td>
                  )}
                  {visibleColumns.image && (
                    <td>
                      {row.image ? (
                        <img src={row.image} alt="card" style={{ width: '60px' }} />
                      ) : (
                        'N/A'
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedBook && (
        <InsurancePlanModalContent book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </>
  );
};

export default BlueCardPrefixesPage;
