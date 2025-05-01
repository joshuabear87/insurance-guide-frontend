import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Spinner from '../Spinner';

const LoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  toggleShowPassword,
  loading,
  handleLogin,
}) => (
  <>
    <h2 className="text-center text-blue fw-bold mb-3" style={{ fontSize: '1.5rem' }}>
      Login
    </h2>
    <hr className="mb-4" />

    <form onSubmit={handleLogin}>
      <div className="mb-3">
        <label className="form-label fw-bold">Email</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">Password</label>
        <div className="input-group">
          <input
            type={showPassword ? 'text' : 'password'}
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
        <button className="btn btn-login" type="submit" disabled={loading}>
          {loading ? <Spinner size="sm" /> : 'Login'}
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
      <Link to="/register" className="btn btn-blue-outline btn-sm mt-2">
        Register Here
      </Link>
    </div>
  </>
);

export default LoginForm;
