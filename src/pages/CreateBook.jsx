import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';

const CreateBooks = () => {
  const [financialClass, setFinancialClass] = useState('');
  const [descriptiveName, setDescriptiveName] = useState('');
  const [payerName, setPayerName] = useState('');
  const [payerCode, setPayerCode] = useState('');
  const [planName, setPlanName] = useState('');
  const [planCode, setPlanCode] = useState('');
  const [samcContracted, setSamcContracted] = useState(false);
  const [samfContracted, setSamfContracted] = useState(false);
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSaveBook = async () => {
    const data = {
      financialClass,
      descriptiveName,
      payerName,
      payerCode,
      planName,
      planCode,
      samcContracted,
      samfContracted,
      notes,
      image
    };
    setLoading(true);
    try {
      await axios.post(`${API_URL}/books`, data);
      setLoading(false);
      enqueueSnackbar('Book created successfully!', { variant: 'success' });
      navigate('/');
    } catch (err) {
      setLoading(false);
      enqueueSnackbar('Error creating book!', { variant: 'error' });
      console.error(err);
    }
  };

  return (
    <div className="container-fluid py-5 bg-parchment min-vh-100">
      <BackButton />
      <h1 className="text-center mb-4" style={{ color: '#6c4c2b' }}>Create Book</h1>

      {loading && <Spinner />}

      <div className="d-flex justify-content-center">
        <div
          className="card border-0 shadow-sm rounded-4 p-4"
          style={{ backgroundColor: '#fefcf6', maxWidth: '500px', width: '100%' }}
        >
          {/* Financial Class */}
          <div className="mb-3">
            <label className="form-label text-muted">Financial Class</label>
            <input
              type="text"
              className="form-control"
              value={financialClass}
              onChange={(e) => setFinancialClass(e.target.value)}
            />
          </div>

          {/* Descriptive Name */}
          <div className="mb-3">
            <label className="form-label text-muted">Descriptive Name</label>
            <input
              type="text"
              className="form-control"
              value={descriptiveName}
              onChange={(e) => setDescriptiveName(e.target.value)}
            />
          </div>

          {/* Payer Name */}
          <div className="mb-3">
            <label className="form-label text-muted">Payer Name</label>
            <input
              type="text"
              className="form-control"
              value={payerName}
              onChange={(e) => setPayerName(e.target.value)}
            />
          </div>

          {/* Payer Code */}
          <div className="mb-3">
            <label className="form-label text-muted">Payer Code</label>
            <input
              type="text"
              className="form-control"
              value={payerCode}
              onChange={(e) => setPayerCode(e.target.value)}
            />
          </div>

          {/* Plan Name */}
          <div className="mb-3">
            <label className="form-label text-muted">Plan Name</label>
            <input
              type="text"
              className="form-control"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
            />
          </div>

          {/* Plan Code */}
          <div className="mb-3">
            <label className="form-label text-muted">Plan Code</label>
            <input
              type="text"
              className="form-control"
              value={planCode}
              onChange={(e) => setPlanCode(e.target.value)}
            />
          </div>

          {/* SAMC Contracted */}
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              checked={samcContracted}
              onChange={() => setSamcContracted(!samcContracted)}
            />
            <label className="form-check-label text-muted">SAMC Contracted</label>
          </div>

          {/* SAMF Contracted */}
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              checked={samfContracted}
              onChange={() => setSamfContracted(!samfContracted)}
            />
            <label className="form-check-label text-muted">SAMF Contracted</label>
          </div>

          {/* Notes */}
          <div className="mb-3">
            <label className="form-label text-muted">Notes</label>
            <textarea
              className="form-control"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>

          {/* Image URL */}
          <div className="mb-3">
            <label className="form-label text-muted">Image URL</label>
            <input
              type="text"
              className="form-control"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>

          {/* Save Button */}
          <button
            className="btn btn-outline-dark w-100"
            style={{ backgroundColor: '#e1bba5', color: '#3f2b1c' }}
            onClick={handleSaveBook}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBooks;
