import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BsInfoCircle } from 'react-icons/bs';
import { AiOutlineEdit } from 'react-icons/ai';
import { MdOutlineDelete } from 'react-icons/md';
import { FaRegEye } from 'react-icons/fa';
import InsurancePlanModal from '../InsurancePlanModal';

const InsurancePlanSingleCard = ({ book, index }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="card border-0 shadow-sm rounded-4 my-3 mx-2">
        <div className="card-body px-4 py-3">
          <h5 className="card-title fw-semibold mb-3">{book.descriptiveName}</h5>
          
          <p className="mb-1"><strong>Financial Class:</strong> {book.financialClass}</p>
          <p className="mb-1"><strong>Payer Code:</strong> {book.payerCode}</p>
          <p className="mb-1"><strong>Payer Name:</strong> {book.payerName}</p>
          <p className="mb-1"><strong>Plan Code:</strong> {book.planCode}</p>
          <p className="mb-1"><strong>Plan Name:</strong> {book.planName}</p>
          <p className="mb-1"><strong>SAMC Contracted:</strong> {book.samcContracted}</p>
          <p className="mb-1"><strong>SAMF Contracted:</strong> {book.samfContracted}</p>
          <p className="mb-3"><strong>Notes:</strong> {book.notes}</p>
          
          {book.image && (
            <div className="text-center mb-3">
              <img src={book.image} alt="Book" className="img-fluid rounded" />
            </div>
          )}

          <div className="d-flex justify-content-center gap-4">
            <FaRegEye
              className="fs-4"
              onClick={() => setShowModal(true)}
              style={{ cursor: 'pointer' }}
            />
            <Link to={`/books/details/${book._id}`}>
              <BsInfoCircle className="fs-4" />
            </Link>
            <Link to={`/books/edit/${book._id}`}>
              <AiOutlineEdit className="fs-4" />
            </Link>
            <Link to={`/books/delete/${book._id}`}>
              <MdOutlineDelete className="fs-4" />
            </Link>
          </div>
        </div>
      </div>

      {showModal && <InsurancePlanModal book={book} onClose={() => setShowModal(false)} />}
    </>
  );
};

export default InsurancePlanSingleCard;
