
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FacilityContext } from '../../context/FacilityContext';

const LoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  toggleShowPassword,
  loading,
  handleLogin,
  variant = 'default',
}) => {
  const emailId = `login-email-${variant}`;
  const passwordId = `login-password-${variant}`;
  const { facility, setFacility, facilities } = useContext(FacilityContext);

  const defaultFacility =
    facility ||
    localStorage.getItem('requestedFacility') ||
    '';

  const [selectedFacility, setSelectedFacility] = useState(defaultFacility);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFacility) return alert('Please select a facility.');
    setFacility(selectedFacility);
    handleLogin(e, selectedFacility);
  };

  return (
    <>
      <h2 className="text-center text-brand fw-bold mb-3" style={{ fontSize: '1.5rem' }}>
        Login
      </h2>
      <hr className="mb-4" />

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-bold">Facility</label>
          <select
            className="form-select"
            value={selectedFacility}
            onChange={(e) => setSelectedFacility(e.target.value)}
            required
          >
            <option value="" disabled>
              Select facility...
            </option>
            {facilities.map((f) => (
              <option key={f._id || f.name} value={f.name}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor={emailId} className="form-label fw-bold">
            Email
          </label>
          <input
            type="email"
            id={emailId}
            name="email"
            autoComplete="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor={passwordId} className="form-label fw-bold">
            Password
          </label>
          <div className="input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              id={passwordId}
              name="password"
              autoComplete="current-password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <span
              className="input-group-text"
              style={{ cursor: 'pointer' }}
              onClick={toggleShowPassword}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>
        </div>

        <div className="d-grid mb-3">
        <button className="btn btn-brand" type="submit" disabled={loading}>
  {loading ? (
    <span className="spinner-border spinner-border-sm text-light" role="status" />
  ) : (
    'Login'
  )}
</button>
        </div>
      </form>

      <div className="text-center">
        <Link to="/forgot-password" className="text-primary" style={{ textDecoration: 'none' }}>
          Forgot Password?
        </Link>
      </div>

      <div className="text-center mt-3">
        <small className="text-muted">No account? No problem!</small>
        <br />
        <Link to="/register" className="btn btn-brand-outline btn-sm mt-2">
          Register Here
        </Link>
      </div>
    </>
  );
};

export default LoginForm;
