import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { MdOutlineDelete } from 'react-icons/md';
import ContractStatusBadge from '../../components/ContractStatusBadge';
import ModalContent from '../ModalContent';

const BooksTable = ({ books }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    const savedSort = localStorage.getItem('booksTableSort');
    if (savedSort) {
      setSortConfig(JSON.parse(savedSort));
    }
  }, []);

  const sortedBooks = [...books].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key]?.toString().toLowerCase() || '';
    const bValue = b[sortConfig.key]?.toString().toLowerCase() || '';
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    const newSort = { key, direction };
    setSortConfig(newSort);
    localStorage.setItem('booksTableSort', JSON.stringify(newSort));
  };

  const clearSort = () => {
    setSortConfig({ key: '', direction: '' });
    localStorage.removeItem('booksTableSort');
  };

  const handleRowClick = (book) => {
    setSelectedBook(book);
  };

  const handleBackdropClick = () => {
    setSelectedBook(null);
  };

  return (
    <div className="table-responsive">
      {/* Top Row */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        {sortConfig.key && (
          <button className="btn btn-outline-secondary btn-sm" onClick={clearSort}>
            Clear Sort
          </button>
        )}
      </div>

      {/* Table Header */}
      <div className="row fw-bold border-bottom p-2 table-headers shadow-md">
        <div className="col" onClick={() => handleSort('financialClass')} style={{ cursor: 'pointer' }}>Financial Class {sortConfig.key === 'financialClass' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</div>
        <div className="col d-none d-md-block" onClick={() => handleSort('descriptiveName')} style={{ cursor: 'pointer' }}>Descriptive Name {sortConfig.key === 'descriptiveName' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</div>
        <div className="col d-none d-md-block" onClick={() => handleSort('planCode')} style={{ cursor: 'pointer' }}>Plan Code {sortConfig.key === 'planCode' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</div>
        <div className="col d-none d-md-block" onClick={() => handleSort('planName')} style={{ cursor: 'pointer' }}>Plan Name {sortConfig.key === 'planName' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</div>
        <div className="col d-none d-md-block" onClick={() => handleSort('samcContracted')} style={{ cursor: 'pointer' }}>SAMC {sortConfig.key === 'samcContracted' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</div>
        <div className="col d-none d-md-block" onClick={() => handleSort('samfContracted')} style={{ cursor: 'pointer' }}>SAMF {sortConfig.key === 'samfContracted' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</div>
        <div className="col" onClick={() => handleSort('prefix')} style={{ cursor: 'pointer' }}>Prefix {sortConfig.key === 'prefix' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</div>
        <div className="col d-none d-md-block" onClick={() => handleSort('notes')} style={{ cursor: 'pointer' }}>Notes {sortConfig.key === 'notes' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</div>
        {isAuthenticated && <div className="col text-center">Operations</div>}
      </div>

      {/* Table Rows */}
      {sortedBooks.map((book, index) => (
  <div
    key={book._id}
    className={`row align-items-center border-bottom p-2 hoverable-row ${index % 2 === 0 ? 'bg-white' : 'bg-light-blue'}`}
    onClick={() => handleRowClick(book)}
    style={{ cursor: 'pointer', transition: 'background-color 0.3s' }}
    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'white' : '#d1ecf3'}
  >

          <div className="col text-start">{book.financialClass}</div>
          <div className="col text-start d-none d-md-block">{book.descriptiveName}</div>
          <div className="col text-start d-none d-md-block">{book.planCode}</div>
          <div className="col text-start d-none d-md-block">{book.planName}</div>
          <div className="col text-start d-none d-md-block"><ContractStatusBadge status={book.samcContracted} /></div>
          <div className="col text-start d-none d-md-block"><ContractStatusBadge status={book.samfContracted} /></div>
          <div className="col text-start">{book.prefix}</div>
          <div className="col text-start d-none d-md-block">{book.notes}</div>
          {isAuthenticated && (
            <div className="col text-center d-flex justify-content-center gap-2" onClick={(e) => e.stopPropagation()}>
              <Link to={`/books/edit/${book._id}`}><AiOutlineEdit className="fs-5 text-primary" /></Link>
              <Link to={`/books/delete/${book._id}`}><MdOutlineDelete className="fs-5 text-danger" /></Link>
            </div>
          )}
        </div>
      ))}

      {/* Modal */}
      {selectedBook && (
  <div
    className="modal-backdrop d-flex justify-content-center align-items-center"
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 1050,
      padding: '1rem',
    }}
    onClick={handleBackdropClick}
  >
    <div
      className="rounded-4 shadow-lg bg-white text-dark"
      style={{ maxWidth: '700px', width: '100%', overflowY: 'auto', maxHeight: '90vh' }}
      onClick={(e) => e.stopPropagation()}
    >
      <ModalContent book={selectedBook} onClose={handleBackdropClick} />
    </div>
  </div>
)}

    </div>
  );
};

export default BooksTable;