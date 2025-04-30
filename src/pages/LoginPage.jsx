import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import API from '../axios';
import Spinner from '../components/Spinner';
import { AuthContext } from '../context/AuthContexts';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', { email, password });
      login({ accessToken: data.accessToken, refreshToken: data.refreshToken });
      enqueueSnackbar('Login successful!', { variant: 'success' });
      navigate('/');
    } catch (error) {
      enqueueSnackbar('Invalid email or password', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="card p-4 shadow rounded-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4 fw-bold">Login</h2>

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

          <div className="d-grid">
            <button className="btn btn-login" type="submit" disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Login'}
            </button>
          </div>
        </form>

        {/* Forgot password link */}
        <div className="text-center mt-3">
          <Link to="/forgot-password" className="text-primary" style={{ textDecoration: 'none' }}>
            Forgot Password?
          </Link>
        </div>

        {/* New registration section */}
        <div className="text-center mt-3">
          <small className="text-muted">No account? No problem!</small><br />
          <Link to="/register" className="btn btn-outline-primary btn-sm mt-2">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
