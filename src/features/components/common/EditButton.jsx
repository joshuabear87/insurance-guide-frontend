// components/EditButton.jsx
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';

const EditButton = ({ id, onClick }) => (
  <Link
    to={`/books/edit/${id}`}
    onClick={onClick}
    className="position-absolute top-0 end-0 m-2 text-decoration-none text-primary"
    title="Edit"
  >
    <AiOutlineEdit className="fs-5" />
  </Link>
);

export default EditButton;
