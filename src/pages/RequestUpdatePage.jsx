import React, { useState } from 'react';
import API from '../axios';
import { useNavigate } from 'react-router-dom';

const RequestUpdatePage = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await API.post('/request-update', { name, message });
      setShowModal(true);
    } catch (err) {
      console.error('Failed to send request:', err);
      alert('Failed to send request.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container py-5 mt-5" style={{ maxWidth: '600px' }}>
      <h2 className="text-blue mb-4">Request an Update</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Your Name</label>
          <input
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={sending}
          />
        </div>
        <div className="mb-4">
          <label className="form-label">Message</label>
          <textarea
            className="form-control"
            rows="5"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            disabled={sending}
          ></textarea>
        </div>
        <button type="submit" className="btn btn-blue w-100" disabled={sending}>
          {sending ? 'Sending...' : 'Send Request'}
        </button>
      </form>

      {/* Success Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" onClick={() => setShowModal(false)}>
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Message Sent</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <div className="modal-body">
                <p>Your message has been sent to your facility administrators.</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={() => setShowModal(false)}>
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestUpdatePage;
