import React, { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import API from '../axios';
import Spinner from '../components/Spinner';
import Searchbar from '../components/Searchbar';
import InsurancePlanTable from '../components/home/InsurancePlanTable';
import InsurancePlanCardView from '../components/home/InsurancePlanCardVIew';
import columnConfig from '../components/utils/columnConfig';
import PlanFilterPills from '../components/PlanFilterPills';

const InsurancePlanMainPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showType, setShowType] = useState('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [columnSettingsOpen, setColumnSettingsOpen] = useState(false);

  const location = useLocation();

  const filterMap = {
    '/plans': 'All',
    '/plans/medicare': 'Medicare',
    '/plans/medi-cal': 'Medi-Cal',
    '/plans/commercial': 'Commercial',
  };

  const currentPath = location.pathname;
  const currentFilter = filterMap[currentPath] || 'All';

  const [tableColumns, setTableColumns] = useState(() => {
    const saved = localStorage.getItem('visibleTableColumns');
    if (saved) return JSON.parse(saved);
    const initial = {};
    columnConfig.forEach(col => (initial[col.key] = true));
    return initial;
  });

  const [cardColumns, setCardColumns] = useState(() => {
    const saved = localStorage.getItem('visibleCardColumns');
    if (saved) return JSON.parse(saved);
    const initial = {};
    columnConfig.forEach(col => (initial[col.key] = true));
    return initial;
  });

  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');
  const [showToast, setShowToast] = useState(false);
  const [animateToast, setAnimateToast] = useState(false);

  const showToastMessage = (message, type = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setAnimateToast(true);
    setTimeout(() => setAnimateToast(false), 2600);
    setTimeout(() => setShowToast(false), 3000);
  };

  const toggleColumn = (key) => {
    if (showType === 'table') {
      const updated = { ...tableColumns, [key]: !tableColumns[key] };
      setTableColumns(updated);
      localStorage.setItem('visibleTableColumns', JSON.stringify(updated));
    } else {
      const updated = { ...cardColumns, [key]: !cardColumns[key] };
      setCardColumns(updated);
      localStorage.setItem('visibleCardColumns', JSON.stringify(updated));
    }
  };

  const resetColumns = (type) => {
    const defaultTable = {
      descriptiveName: true,
      financialClass: true,
      prefix: true,
      planName: true,
      planCode: true,
      samcContracted: true,
      samfContracted: true,
      image: true,
      secondaryImage: true,
    };

    const defaultCard = {
      descriptiveName: true,
      financialClass: true,
      prefix: true,
      planName: true,
      planCode: true,
      samcContracted: true,
      samfContracted: true,
      image: true,
      secondaryImage: true,
    };

    columnConfig.forEach(col => {
      if (!defaultTable.hasOwnProperty(col.key)) {
        defaultTable[col.key] = false;
      }
      if (!defaultCard.hasOwnProperty(col.key)) {
        defaultCard[col.key] = false;
      }
    });

    if (type === 'table') {
      setTableColumns(defaultTable);
      localStorage.setItem('visibleTableColumns', JSON.stringify(defaultTable));
    } else {
      setCardColumns(defaultCard);
      localStorage.setItem('visibleCardColumns', JSON.stringify(defaultCard));
    }

    showToastMessage(`${type === 'table' ? 'Table' : 'Card'} view reset to default`, 'info');
  };

  const restoreAllColumns = () => {
    const allVisible = {};
    columnConfig.forEach(col => {
      allVisible[col.key] = true;
    });

    if (showType === 'table') {
      setTableColumns(allVisible);
      localStorage.setItem('visibleTableColumns', JSON.stringify(allVisible));
    } else {
      setCardColumns(allVisible);
      localStorage.setItem('visibleCardColumns', JSON.stringify(allVisible));
    }

    showToastMessage(`${showType === 'table' ? 'Table' : 'Card'} view: All columns restored`, 'success');
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await API.get('/books');
        setBooks(res.data.data);
      } catch (err) {
        console.error('Error fetching books:', err);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };
    fetchBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        if (currentFilter === 'Medicare') return book.financialClass === 'Medicare';
        if (currentFilter === 'Medi-Cal') return book.financialClass === 'Medi-Cal';
        if (currentFilter === 'Commercial') return book.financialClass === 'Commercial';
        return true;
      })
      .filter((book) => {
        const search = searchQuery.toLowerCase();
  
        // Combine basic fields
        const valuesToSearch = [
          ...Object.values(book).map((v) => String(v).toLowerCase()),
          book.facilityAddress?.street?.toLowerCase() || '',
          book.facilityAddress?.city?.toLowerCase() || '',
          book.facilityAddress?.state?.toLowerCase() || '',
          book.facilityAddress?.zip?.toLowerCase() || '',
          book.providerAddress?.street?.toLowerCase() || '',
          book.providerAddress?.city?.toLowerCase() || '',
          book.providerAddress?.state?.toLowerCase() || '',
          book.providerAddress?.zip?.toLowerCase() || '',
          ...(book.prefixes || []).map((p) => p.value?.toLowerCase() || ''),
          ...(book.portalLinks || []).flatMap((l) => [
            l.title?.toLowerCase() || '',
            l.url?.toLowerCase() || '',
          ]),
          ...(book.phoneNumbers || []).flatMap((p) => [
            p.title?.toLowerCase() || '',
            p.number?.toLowerCase() || '',
          ]),
        ];
  
        return valuesToSearch.some((value) => value.includes(search));
      });
  }, [books, searchQuery, currentFilter]);
  
  return (
    <>
      <PlanFilterPills />

      <Searchbar
        showType={showType}
        setShowType={setShowType}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        columnConfig={columnConfig}
        visibleColumns={showType === 'table' ? tableColumns : cardColumns}
        toggleColumn={toggleColumn}
        columnSettingsOpen={columnSettingsOpen}
        setColumnSettingsOpen={setColumnSettingsOpen}
        resetColumns={resetColumns}
        restoreAllColumns={restoreAllColumns}
      />

      <div>
        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <Spinner />
          </div>
        ) : showType === 'table' ? (
          <InsurancePlanTable books={filteredBooks} visibleColumns={tableColumns} />
        ) : (
          <InsurancePlanCardView books={filteredBooks} visibleColumns={cardColumns} />
        )}
      </div>

      {showToast && (
        <div
          className={`toast show position-fixed shadow-lg ${
            animateToast ? 'toast-animate-in' : 'toast-animate-out'
          }`}
          role="alert"
          style={{
            bottom: '50px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            minWidth: '300px',
            maxWidth: '90vw',
            borderRadius: '0.5rem',
            overflow: 'hidden',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
            opacity: animateToast ? 1 : 0,
          }}
        >
          <div
            className="toast-header text-white justify-content-center"
            style={{
              backgroundColor: toastType === 'success' ? '#28a745' : '#005b7f',
            }}
          >
            <strong className="me-auto">Settings Updated</strong>
          </div>
          <div className="toast-body text-center">{toastMessage}</div>
        </div>
      )}
    </>
  );
};

export default InsurancePlanMainPage;
