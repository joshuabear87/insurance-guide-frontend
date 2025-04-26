import { AiOutlineClose } from 'react-icons/ai';
import { PiBookOpenTextLight } from 'react-icons/pi';

const ModalContent = ({ book, onClose }) => {
  return (
    <div className="bg-white rounded sha p-4 position-relative">
      {/* Close Button */}
      <AiOutlineClose
        className="position-absolute top-0 end-0 m-3 text-danger"
        size={30}
        style={{ cursor: 'pointer' }}
        onClick={onClose}
      />

      {/* Images Section */}
      <div className="d-flex flex-column flex-md-row gap-3 mb-4">
        {book.image && (
          <img 
            src={book.image} 
            alt="Primary Book Image" 
            className="img-fluid rounded"
            style={{ maxHeight: '300px', objectFit: 'cover', width: '100%' }}
          />
        )}
        {book.secondaryImage && (
          <img 
            src={book.secondaryImage} 
            alt="Secondary Book Image" 
            className="img-fluid rounded"
            style={{ maxHeight: '300px', objectFit: 'cover', width: '100%' }}
          />
        )}
      </div>

      {/* Main Title with Book Icon */}
      <div className="d-flex align-items-center gap-2 mb-3">
        <PiBookOpenTextLight className="text-danger" size={24} />
        <h4 className="fw-bold mb-0">{book.descriptiveName}</h4>
      </div>

      {/* Financial Class */}
      <p><strong>Financial Class:</strong> {book.financialClass}</p>

      {/* Payer Code */}
      <p><strong>Payer Code:</strong> {book.payerCode}</p>

      {/* Payer Name */}
      <p><strong>Payer Name:</strong> {book.payerName}</p>

      {/* Plan Code */}
      <p><strong>Plan Code:</strong> {book.planCode}</p>

      {/* Plan Name */}
      <p><strong>Plan Name:</strong> {book.planName}</p>

      {/* SAMC Contracted */}
      <p><strong>SAMC Contracted:</strong> {book.samcContracted ? 'Yes' : 'No'}</p>

      {/* SAMF Contracted */}
      <p><strong>SAMF Contracted:</strong> {book.samfContracted ? 'Yes' : 'No'}</p>

      {/* Notes */}
      <p><strong>Notes:</strong> {book.notes || 'No notes available.'}</p>
    </div>
  );
};

export default ModalContent;
