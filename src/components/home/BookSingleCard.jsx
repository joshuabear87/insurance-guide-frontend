import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BsInfoCircle } from 'react-icons/bs';
import { AiOutlineEdit } from 'react-icons/ai';
import { MdOutlineDelete } from 'react-icons/md';
import { FaRegEye } from 'react-icons/fa';
import BookModal from './BookModal';

const BookSingleCard = ({ book, index }) => {
  const [showModal, setShowModal] = useState(false);
  const bgColor = index % 2 === 0 ? 'bg-parchment' : 'bg-bambooVeryLight';

  return (
    <>
      <div
        className={`card card-scroll ${bgColor} border-0 shadow-sm rounded-4 my-3 mx-2 book-card`}
      >
        <div className="card-body text-ink px-4 py-3">
          <h5 className="card-title fw-semibold mb-3 text-scrollEdge">{book.title}</h5>
          <p className="card-text mb-2">
            <strong>Author:</strong> {book.author}
          </p>
          <p className="card-text mb-4">
            <strong>Publish Year:</strong> {book.publishYear}
          </p>

          <div className="d-flex justify-content-center gap-4">
            <FaRegEye
              className="fs-4 text-sealRed icon-button hoverable-icon"
              onClick={() => setShowModal(true)}
              style={{ cursor: 'pointer' }}
            />
            <Link to={`/books/details/${book._id}`}>
              <BsInfoCircle className="fs-4 text-success hoverable-icon" />
            </Link>
            <Link to={`/books/edit/${book._id}`}>
              <AiOutlineEdit className="fs-4 text-warning hoverable-icon" />
            </Link>
            <Link to={`/books/delete/${book._id}`}>
              <MdOutlineDelete className="fs-4 text-danger hoverable-icon" />
            </Link>
          </div>
        </div>
      </div>

      {showModal && <BookModal book={book} onClose={() => setShowModal(false)} />}
    </>
  );
};

export default BookSingleCard;
