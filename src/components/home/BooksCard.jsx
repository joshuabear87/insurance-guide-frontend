import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEdit } from 'react-icons/ai';
import { BiUserCircle } from 'react-icons/bi';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineDelete } from 'react-icons/md';
import { PiBookOpenTextLight } from 'react-icons/pi';

const BooksCard = ({ books }) => {
  const [selectedBook, setSelectedBook] = useState(null);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setSelectedBook(null);
    }
  };

  return (
    <>
      <div className="container py-4">
        <div className="row g-4">
          {books.map((book, index) => (
            <div key={book._id} className="col-12 col-sm-6 col-lg-4">
              <div
                className={`card h-100 border-0 rounded-4 p-3 book-card shadow-sm ${index % 2 === 0 ? 'bg-parchment' : 'bg-bambooVeryLight'}`}
              >
                <div>
                  <h5 className="fw-semibold text-scrollEdge d-flex align-items-center mb-3">
                    <PiBookOpenTextLight className="me-2 text-warning" />
                    {book.title}
                  </h5>
                  <p className="mb-1 d-flex align-items-center text-dark">
                    <BiUserCircle className="me-2" />
                    {book.author}
                  </p>
                  <p className="text-muted">Published: {book.publishYear}</p>
                </div>
                <div className="d-flex justify-content-end gap-3 fs-5 mt-3">
                  <button
                    className="btn p-0 border-0 bg-transparent text-primary hoverable-icon"
                    onClick={() => setSelectedBook(book)}
                  >
                    <AiOutlineEye />
                  </button>
                  <Link to={`/books/details/${book._id}`} className="text-success hoverable-icon">
                    <BsInfoCircle />
                  </Link>
                  <Link to={`/books/edit/${book._id}`} className="text-warning hoverable-icon">
                    <AiOutlineEdit />
                  </Link>
                  <Link to={`/books/delete/${book._id}`} className="text-danger hoverable-icon">
                    <MdOutlineDelete />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

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
            zIndex: 1050
          }}
          onClick={handleBackdropClick}
        >
          <div
            className="p-4 rounded-4 shadow-lg"
            style={{
              backgroundColor: '#fefcf6',
              color: '#3f2b1c',
              maxWidth: '500px',
              width: '90%',
              border: '3px solid #e1bba5',
            }}
          >
            <h4 className="fw-bold text-scrollEdge mb-3">{selectedBook.title}</h4>
            <p className="mb-2">
              <strong>Author:</strong> {selectedBook.author}
            </p>
            <p className="mb-3">
              <strong>Published:</strong> {selectedBook.publishYear}
            </p>
            <hr />
            <p className="mb-2">
              {selectedBook.description || 'No description available.'}
            </p>
            <p className="text-muted">
              {selectedBook.additionalInfo || 'No additional information.'}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default BooksCard;
