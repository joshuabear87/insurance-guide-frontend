import React, { useState, useContext, useEffect } from 'react';
import API from '../axios';
import { useSnackbar } from 'notistack';
import { AuthContext } from '../context/AuthContexts';
import Spinner from './Spinner'; 

const RequestUpdateForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useContext(AuthContext);

  const [loadingScreen, setLoadingScreen] = useState(true);
  const [submitting, setSubmitting] = useState(false); 

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    position: user?.department || '',
    message: '',
  });

  const [broadcast, setBroadcast] = useState({
    subject: '',
    message: '',
    attachment: null,
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
          <h3 className="text-center mb-4 text-brand">
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
        
      {user?.role === 'admin' && (
  <div className="mt-5">
    <div className="card shadow-lg border-0 p-4" style={{ borderLeft: '5px solid #005b7f' }}>
      <h3 className="text-center mb-4 text-brand">📣 Broadcast Message to All Users</h3>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setSubmitting(true);
          const form = new FormData();
          form.append('subject', broadcast.subject);
          form.append('message', broadcast.message);
          if (broadcast.attachment) {
            form.append('attachment', broadcast.attachment);
          }

          try {
            await API.post('/admin/broadcast-email', form, {
              headers: { 'Content-Type': 'multipart/form-data' },
            });
            enqueueSnackbar('Broadcast email sent!', { variant: 'success' });
            setBroadcast({ subject: '', message: '', attachment: null });
          } catch (err) {
            console.error(err);
            enqueueSnackbar('Failed to send broadcast.', { variant: 'error' });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        <div className="mb-3">
          <label className="form-label fw-semibold">Subject</label>
          <input
            type="text"
            className="form-control"
            required
            value={broadcast.subject}
            onChange={(e) => setBroadcast(prev => ({ ...prev, subject: e.target.value }))}
            disabled={submitting}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Message</label>
          <textarea
            rows="5"
            className="form-control"
            required
            value={broadcast.message}
            onChange={(e) => setBroadcast(prev => ({ ...prev, message: e.target.value }))}
            disabled={submitting}
          />
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">Optional Attachment</label>
          <input
            type="file"
            className="form-control"
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            onChange={(e) => setBroadcast(prev => ({ ...prev, attachment: e.target.files[0] }))}
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
            '📧 Send Email to All Users'
          )}
        </button>
      </form>
    </div>
  </div>
)}
      </div>

    </div>
  );
};

export default RequestUpdateForm;
