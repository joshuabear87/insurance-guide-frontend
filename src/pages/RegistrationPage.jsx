import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import API from '../axios';
import Spinner from '../components/Spinner';
import PasswordFieldWithStrength from '../components/PasswordFieldWithStrength';
import '../styles/_auth.css';

const isValidNPI = (npi) => /^\d{10}$/.test(npi);

const RegistrationPage = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    username: '',
    facilityName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    department: '',
    npi: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!isValidNPI(formData.npi)) {
      setError('Invalid NPI number. Please enter a valid 10-digit NPI.');
      return;
    }

    try {
      setLoading(true);
      await API.post('/auth/register', formData);
      enqueueSnackbar('Registration successful! Awaiting admin approval.', { variant: 'success' });
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card p-4 shadow rounded-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4 fw-bold text-blue">Create an Account</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Username</label>
            <input
              type="text"
              className="form-control"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Facility Name</label>
            <input
              type="text"
              className="form-control"
              name="facilityName"
              value={formData.facilityName}
              onChange={handleChange}
              placeholder="Enter your facility or organization"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Phone Number</label>
            <input
              type="tel"
              className="form-control"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Department (optional)</label>
            <input
              type="text"
              className="form-control"
              name="department"
              value={formData.department}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">NPI Number</label>
            <input
              type="text"
              className="form-control"
              name="npi"
              value={formData.npi}
              onChange={handleChange}
              required
            />
          </div>

          {/* ✅ Password Field with Strength Component */}
          <PasswordFieldWithStrength
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          <div className="mb-3">
            <label className="form-label fw-bold">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-login" disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Register'}
            </button>
          </div>

          <div className="text-center mt-3">
            <small>
              Already have an account?{' '}
              <Link to="/login" className="text-primary">
                Login
              </Link>
            </small>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
