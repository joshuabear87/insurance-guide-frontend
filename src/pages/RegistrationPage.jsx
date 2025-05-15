import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import API from '../axios';
import Spinner from '../components/Spinner';
import PasswordFieldWithStrength from '../components/PasswordFieldWithStrength';

const RegistrationPage = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    requestedFacility: [], // Changed to an array to hold multiple selected facilities
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    department: '',
    npi: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [facilities, setFacilities] = useState([]);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const res = await API.get('/facilities');
        console.log('Facility API response:', res.data); // 👈 Check this
        setFacilities(Array.isArray(res.data) ? res.data : res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch facilities:', err);
      }
    };
    fetchFacilities();
  }, []);
    
  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    if (name === 'requestedFacility') {
      setFormData((prev) => {
        const updatedFacilities = checked
          ? [...prev.requestedFacility, value]  // Add facility to the array
          : prev.requestedFacility.filter((facility) => facility !== value); // Remove facility from the array
        return { ...prev, requestedFacility: updatedFacilities };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      await API.post('/auth/register', formData);
      enqueueSnackbar('Registration successful! Awaiting admin approval.', { variant: 'success' });
      localStorage.setItem('requestedFacility', formData.requestedFacility); // 👈 store for login
      navigate('/login');
    } catch (err) {
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
            <label className="form-label fw-bold">First Name</label>
            <input
              type="text"
              className="form-control"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Last Name</label>
            <input
              type="text"
              className="form-control"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Select Facility</label>
            <div>
              {facilities.map((facility) => (
                <div key={facility._id} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="requestedFacility"
                    value={facility.name}
                    checked={formData.requestedFacility.includes(facility.name)} // Check if the facility is selected
                    onChange={handleChange}
                  />
                  <label className="form-check-label">
                    {facility.name}
                  </label>
                </div>
              ))}
            </div>
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
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                setFormData((prev) => ({ ...prev, npi: value }));
              }}
              maxLength={10}
              pattern="\d{10}"
              title="Enter exactly 10 digits"
              required
            />
          </div>

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
            <button type="submit" className="btn btn-login" disabled={loading || formData.npi.length !== 10}>
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
