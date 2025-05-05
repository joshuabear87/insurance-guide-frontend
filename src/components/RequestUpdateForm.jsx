import React, { useState, useContext, useEffect } from 'react';
import API from '../axios';
import { useSnackbar } from 'notistack';
import { AuthContext } from '../context/AuthContexts';
import Spinner from './Spinner'; // ensure this points to your Spinner component

const RequestUpdateForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useContext(AuthContext);

  const [loadingScreen, setLoadingScreen] = useState(true); // for page-level spinner
  const [submitting, setSubmitting] = useState(false); // for submit button spinner

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    position: user?.department || '',
    message: '',
  });

  useEffect(() => {
    const delay = setTimeout(() => {
      setLoadingScreen(false);
    }, 400);
    return () => clearTimeout(delay);
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post('/request-update', formData);
      enqueueSnackbar('Request sent to the Administrator for review.', { variant: 'success' });
      setFormData({ name: '', email: '', position: '', message: '' });
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Failed to send request.', { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingScreen) {
    return (
      <div className="d-flex justify-content-center align-items-center m-5">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="mx-auto" style={{ maxWidth: '600px' }}>
        <div className="card shadow-lg border-0 p-4" style={{ backgroundColor: '#f8f9fa', borderLeft: '5px solid #005b7f' }}>
          <h3 className="text-center mb-4 text-blue">
            📝 Request Update or New Plan Code
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                required
                value={formData.name}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Position</label>
              <input
                type="text"
                name="position"
                className="form-control"
                required
                value={formData.position}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>
            <div className="mb-4">
              <label className="form-label fw-semibold">Message</label>
              <textarea
                name="message"
                rows="5"
                className="form-control"
                required
                value={formData.message}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>
            <button
              type="submit"
              className="btn btn-login w-100 fw-bold d-flex justify-content-center align-items-center"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                  Sending...
                </>
              ) : (
                '📤 Submit Request'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestUpdateForm;
