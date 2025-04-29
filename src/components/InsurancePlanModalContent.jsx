import { AiOutlineClose } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import ContractStatusBadge from './ContractStatusBadge'; // <-- Don't forget to import it!

const InsurancePlanModalContent = ({ book, onClose }) => {
  return (
    <div className="bg-white rounded shadow p-4 position-relative">
      {/* Close Button */}
      <AiOutlineClose
        className="position-absolute top-0 end-0 m-3 text-danger"
        size={30}
        style={{ cursor: 'pointer' }}
        onClick={onClose}
      />

      {/* Centered Title and Financial Class */}
      <div className="text-center mb-4">
        <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
          <h3 className="fw-bold mb-0 modal-main-header">{book.descriptiveName}</h3>
        </div>
        <div className="text-muted" style={{ fontSize: '0.9rem' }}>
          {book.financialClass}
        </div>
      </div>
      <hr className='divider' />

      {/* Two Column Info */}
      <div className="row mb-4">
        <div className="col-md-6 my-2">
          <p><span className="fw-bold">Payer Name:</span> {book.payerName}</p>
        </div>
        <div className="col-md-6 my-2">
          <p><span className="fw-bold">Payer Code:</span> {book.payerCode}</p>
        </div>
        <div className="col-md-6 my-2">
          <p><span className="fw-bold">Plan Name:</span> {book.planName}</p>
        </div>
        <div className="col-md-6 my-2">
          <p><span className="fw-bold">Plan Code:</span> {book.planCode}</p>
        </div>
        <div className="col-md-6 my-2">
          <p className="mb-1"><span className="fw-bold">SAMC Contracted:</span></p>
          <ContractStatusBadge status={book.samcContracted} />
        </div>
        <div className="col-md-6 my-2">
          <p className="mb-1"><span className="fw-bold">SAMF Contracted:</span></p>
          <ContractStatusBadge status={book.samfContracted} />
        </div>
      </div>

      {/* Notes Centered */}
      <div className="text-start mb-4 notes-border p-2">
        <h6 className="fw-bold">Notes:</h6>
        <p className="text-dark">{book.notes || 'No notes available.'}</p>
      </div>


      {/* Images Section */}
      <div className="d-flex justify-content-center gap-3 flex-wrap my-3">
        {book.image && (
          <img
            src={book.image}
            alt="Primary Book Image"
            className="img-fluid rounded shadow"
            style={{ maxHeight: '200px', objectFit: 'cover', width: '45%' }}
          />
        )}
        {book.secondaryImage && (
          <img
            src={book.secondaryImage}
            alt="Secondary Book Image"
            className="img-fluid rounded shadow"
            style={{ maxHeight: '200px', objectFit: 'cover', width: '45%' }}
          />
        )}
      </div>
      {/* See More Button */}
      <div className="text-center mb-2">
        <Link to={`/books/details/${book._id}`} className="btn btn-login">
          See More
        </Link>
      </div>
    </div>
  );
};

export default InsurancePlanModalContent;
