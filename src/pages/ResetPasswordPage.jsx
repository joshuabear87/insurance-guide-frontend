import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../axios';
import PasswordFieldWithStrength from '../components/PasswordFieldWithStrength';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirm) {
      return setError('Passwords do not match');
    }

    try {
      const res = await API.post('/auth/reset-password', { token, password });
      setMessage(res.data.message || 'Password reset successful');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow p-4 rounded-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center text-blue fw-bold mb-4">Reset Your Password</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <form onSubmit={handleSubmit}>
          <PasswordFieldWithStrength
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="mb-3">
            <label className="form-label fw-bold">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-login w-100">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
