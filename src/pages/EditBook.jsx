import React, { useState, useEffect } from 'react';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const EditBooks = () => {
  const [financialClass, setFinancialClass] = useState('');
  const [descriptiveName, setDescriptiveName] = useState('');
  const [payerName, setPayerName] = useState('');
  const [payerCode, setPayerCode] = useState('');
  const [planName, setPlanName] = useState('');
  const [planCode, setPlanCode] = useState('');
  const [samcContracted, setSamcContracted] = useState(false);
  const [samfContracted, setSamfContracted] = useState(false);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/books/${id}`);
        const book = res.data;
        setFinancialClass(book.financialClass || '');
        setDescriptiveName(book.descriptiveName || '');
        setPayerName(book.payerName || '');
        setPayerCode(book.payerCode || '');
        setPlanName(book.planName || '');
        setPlanCode(book.planCode || '');
        setSamcContracted(book.samcContracted || false);
        setSamfContracted(book.samfContracted || false);
        setNotes(book.notes || '');
        setLoading(false);
      } catch (err) {
        console.error('Error fetching book:', err);
        enqueueSnackbar('Failed to load book details!', { variant: 'error' });
        setLoading(false);
      }
    };

    fetchBook();
  }, [API_URL, id, enqueueSnackbar]);

  const handleEditBook = async () => {
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
    };
    setLoading(true);
    try {
      await axios.put(`${API_URL}/books/${id}`, data);
      enqueueSnackbar('Book edited successfully!', { variant: 'success' });
      navigate('/');
    } catch (err) {
      console.error('Error editing book:', err);
      enqueueSnackbar('Error editing book!', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-5 bg-parchment min-vh-100">
      <BackButton />
      <h1 className="text-center mb-4" style={{ color: '#6c4c2b' }}>Edit Book</h1>

      {loading && <Spinner />}

      <div className="d-flex justify-content-center">
        <div
          className="card border-0 shadow-sm rounded-4 p-4"
          style={{ backgroundColor: '#fefcf6', maxWidth: '600px', width: '100%' }}
        >
          <div className="mb-3">
            <label className="form-label text-muted">Financial Class</label>
            <input
              type="text"
              className="form-control"
              value={financialClass}
              onChange={(e) => setFinancialClass(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-muted">Descriptive Name</label>
            <input
              type="text"
              className="form-control"
              value={descriptiveName}
              onChange={(e) => setDescriptiveName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-muted">Payer Name</label>
            <input
              type="text"
              className="form-control"
              value={payerName}
              onChange={(e) => setPayerName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-muted">Payer Code</label>
            <input
              type="text"
              className="form-control"
              value={payerCode}
              onChange={(e) => setPayerCode(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-muted">Plan Name</label>
            <input
              type="text"
              className="form-control"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-muted">Plan Code</label>
            <input
              type="text"
              className="form-control"
              value={planCode}
              onChange={(e) => setPlanCode(e.target.value)}
            />
          </div>

          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="samcContracted"
              checked={samcContracted}
              onChange={(e) => setSamcContracted(e.target.checked)}
            />
            <label className="form-check-label text-muted" htmlFor="samcContracted">
              SAMC Contracted
            </label>
          </div>

          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="samfContracted"
              checked={samfContracted}
              onChange={(e) => setSamfContracted(e.target.checked)}
            />
            <label className="form-check-label text-muted" htmlFor="samfContracted">
              SAMF Contracted
            </label>
          </div>

          <div className="mb-4">
            <label className="form-label text-muted">Notes</label>
            <textarea
              className="form-control"
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>

          <button
            className="btn btn-outline-dark w-100"
            style={{ backgroundColor: '#e1bba5', color: '#3f2b1c' }}
            onClick={handleEditBook}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBooks;
