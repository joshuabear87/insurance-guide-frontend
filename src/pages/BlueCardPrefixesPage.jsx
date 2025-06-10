import { useEffect, useState, useMemo, useContext } from 'react';
import API from '../axios';
import Spinner from '../components/Spinner';
import InsurancePlanModalContent from '../components/InsurancePlanModalContent';
import PlanFilterPills from '../components/PlanFilterPills';
import BlueCardSearchbar from '../components/BlueCardSearchbar';
import BlueCardCardView from '../components/home/BlueCardCardView';
import blueCardColumnConfig from '../components/utils/blueCardColumnConfig';
import BlueCardTableView from '../components/home/BlueCardTableVIew';
import { exportToExcel } from '../components/utils/exportToExcel';
import { FacilityContext } from '../context/FacilityContext';

const getNestedValue = (obj, path) =>
  path.split('.').reduce((acc, key) => acc?.[key], obj);

const BlueCardPrefixesPage = ({ setExportHandlerBlueCard }) => {
  const [prefixRows, setPrefixRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortColumn, setSortColumn] = useState('prefix');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showType, setShowType] = useState('table');
  const [columnSettingsOpen, setColumnSettingsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = showType === 'table' ? 10 : 8;
  const { facilityTheme } = useContext(FacilityContext);

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
    if (key === 'prefix') return;
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
          const facilityContracts = plan.facilityContracts || [];
          prefixes.forEach((p) => {
            rows.push({
              ...plan,
              prefix: p.value,
              book: plan,
              facilityContracts,
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

  useEffect(() => {
    if (setExportHandlerBlueCard) {
      setExportHandlerBlueCard(() => () =>
        exportToExcel(prefixRows, blueCardColumnConfig, 'BlueCardPrefixes.xlsx')
      );
    }
  }, [prefixRows]);

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

  const paginatedRows = useMemo(() => {
    return filteredRows.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredRows, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredRows.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortColumn, sortDirection, showType]);

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
        <BlueCardTableView
          rows={paginatedRows}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          handleSort={handleSort}
          visibleColumns={visibleColumns}
          isAuthenticated={isAuthenticated}
          onSelect={(book) => setSelectedBook(book)}
        />
      ) : (
        <BlueCardCardView
          rows={paginatedRows}
          visibleColumns={visibleColumns}
          onSelect={(book) => setSelectedBook(book)}
        />
      )}

{!loading && totalPages && (
  <nav className="d-flex justify-content-center mt-3">
    <ul className="pagination pagination-sm">
      {Array.from({ length: totalPages }, (_, i) => (
        <li key={i} className="page-item">
          <button
            className={`page-link ${i + 1 === currentPage ? 'text-white' : ''}`}
            style={{
              backgroundColor: i + 1 === currentPage ? facilityTheme.primaryColor : 'transparent',
              borderColor: facilityTheme.primaryColor,
              color: i + 1 === currentPage ? '#fff' : facilityTheme.primaryColor,
            }}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        </li>
      ))}
    </ul>
  </nav>
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
