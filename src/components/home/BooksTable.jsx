import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineDelete } from 'react-icons/md';

const BooksTable = ({ books }) => {
  return (
    <div className="table-responsive">
      {/* Header Section */}
      <div className="row fw-bold border-bottom py-2">
        <div className="col text-center">No</div>
        <div className="col text-center">Financial Class</div>
        <div className="col text-center d-none d-md-block">Payer Code</div>
        <div className="col text-center d-none d-md-block">Payer Name</div>
        <div className="col text-center d-none d-md-block">Plan Code</div>
        <div className="col text-center d-none d-md-block">Plan Name</div>
        <div className="col text-center d-none d-md-block">Descriptive Name</div>
        <div className="col text-center d-none d-md-block">SAMC Contracted</div>
        <div className="col text-center d-none d-md-block">SAMF Contracted</div>
        <div className="col text-center">Operations</div>
      </div>

      {/* Table Rows */}
      {books.map((book, index) => (
        <div key={book._id} className="row align-items-center border-bottom py-2">
          <div className="col text-center">{index + 1}</div>
          <div className="col text-center">{book.financialClass}</div>
          <div className="col text-center d-none d-md-block">{book.payerCode}</div>
          <div className="col text-center d-none d-md-block">{book.payerName}</div>
          <div className="col text-center d-none d-md-block">{book.planCode}</div>
          <div className="col text-center d-none d-md-block">{book.planName}</div>
          <div className="col text-center d-none d-md-block">{book.descriptiveName}</div>
          <div className="col text-center d-none d-md-block">{book.samcContracted}</div>
          <div className="col text-center d-none d-md-block">{book.samfContracted}</div>
          <div className="col text-center d-flex justify-content-center gap-2">
            <Link to={`/books/details/${book._id}`}>
              <BsInfoCircle className="fs-5" />
            </Link>
            <Link to={`/books/edit/${book._id}`}>
              <AiOutlineEdit className="fs-5" />
            </Link>
            <Link to={`/books/delete/${book._id}`}>
              <MdOutlineDelete className="fs-5" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BooksTable;
