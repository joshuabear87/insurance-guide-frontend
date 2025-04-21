import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineDelete } from 'react-icons/md';
import './BooksTable.css'; // Custom styles for bamboo colors & hover

const BooksTable = ({ books }) => {
  return (
    <div className="table-responsive">
      {/* Header Section */}
      <div className="row table-header align-items-center m-0">
        <div className="col text-center fw-semibold py-2">No</div>
        <div className="col text-center fw-semibold py-2">Title</div>
        <div className="col text-center fw-semibold d-none d-md-block py-2">Author</div>
        <div className="col text-center fw-semibold d-none d-md-block py-2">Publish Year</div>
        <div className="col text-center fw-semibold py-2">Operations</div>
      </div>

      {/* Table Rows */}
      {books.map((book, index) => (
        <div
          key={book._id}
          className={`row align-items-center m-0 ${
            index % 2 === 0 ? 'bg-bamboo-light' : 'bg-bamboo-verylight'
          } table-row-hover`}
        >
          <div className="col text-center py-3">{index + 1}</div>
          <div className="col text-center py-3">{book.title}</div>
          <div className="col text-center d-none d-md-block py-3">{book.author}</div>
          <div className="col text-center d-none d-md-block py-3">{book.publishYear}</div>
          <div className="col text-center d-flex justify-content-center gap-3 py-3">
            <Link to={`/books/details/${book._id}`}>
              <BsInfoCircle className="fs-4 text-success" />
            </Link>
            <Link to={`/books/edit/${book._id}`}>
              <AiOutlineEdit className="fs-4 text-warning" />
            </Link>
            <Link to={`/books/delete/${book._id}`}>
              <MdOutlineDelete className="fs-4 text-danger" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BooksTable;
