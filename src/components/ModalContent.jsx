import { AiOutlineClose } from 'react-icons/ai';
import { PiBookOpenTextLight } from 'react-icons/pi';
import { BiUserCircle } from 'react-icons/bi';

const ModalContent = ({ book, onClose }) => {
  return (
    <div 
      className="bg-white rounded sha p-4 position-relative"
    >
      <AiOutlineClose 
        className="position-absolute top-0 end-0 m-3 text-danger"
        size={30}
        style={{ cursor: 'pointer' }}
        onClick={onClose}
      />
      <h2 className="badge bg-danger-subtle text-dark px-3 py-2 rounded-pill">
        {book.publishYear}
      </h2>
      <h6 className="text-muted my-2">{book._id}</h6>
      
      <div className="d-flex align-items-center gap-2">
        <PiBookOpenTextLight className="text-danger" size={24} />
        <h5 className="mb-0">{book.title}</h5>
      </div>
      
      <div className="d-flex align-items-center gap-2 mt-2">
        <BiUserCircle className="text-danger" size={24} />
        <h6 className="mb-0">{book.author}</h6>
      </div>
    </div>
  );
};

export default ModalContent;
