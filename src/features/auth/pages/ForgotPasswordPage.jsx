import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../../api/axios'; // ✅ Use centralized API (already set up)

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      await API.post('/auth/forgot-password', { email });
      setMessage('If your email exists, a password reset link has been sent.');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card p-4 shadow rounded-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4 fw-bold text-blue" style={{ color: '#007b9e' }}>
          Forgot Password
        </h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Email Address</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-login w-100">
            Send Reset Link
          </button>

          <div className="text-center mt-3">
            <small>
              Remembered your password?{' '}
              <Link to="/login" className="text-primary" style={{ color: '#007b9e' }}>
                Back to Login
              </Link>
            </small>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
