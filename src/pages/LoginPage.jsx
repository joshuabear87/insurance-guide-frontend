// LoginPage.jsx
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import API from '../axios';
import { AuthContext } from '../context/AuthContexts';
import { FacilityContext } from '../context/FacilityContext';
import LoginForm from '../components/forms/LoginForm';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCard, setShowCard] = useState(false);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { login } = useContext(AuthContext);
  const { facility, setFacility } = useContext(FacilityContext);

  useEffect(() => {
    setTimeout(() => setShowCard(true), 100);
  }, []);

  const handleLogin = async (e, selectedFacility) => {
    e.preventDefault();

    if (!selectedFacility) {
      enqueueSnackbar('Please select a facility.', { variant: 'warning' });
      return;
    }

    setLoading(true);

    try {
      const { data } = await API.post('/auth/login', {
        email,
        password,
        activeFacility: selectedFacility,
      });

      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('activeFacility', selectedFacility);
      localStorage.setItem('user', JSON.stringify(data));

      setFacility(selectedFacility);
      login({ accessToken: data.accessToken });

      enqueueSnackbar('Login successful!', { variant: 'success' });
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error?.response?.data || error);
      enqueueSnackbar(
        error?.response?.data?.message || 'Invalid email or password',
        { variant: 'error' }
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <div className="m-0 p-0" style={{ position: 'absolute', top: 0, left: 0, height: '100dvh', width: '100vw', overflow: 'hidden', display: 'flex', flexDirection: 'row' }}>
      <div className="d-none d-lg-flex align-items-center justify-content-center bg-light" style={{ flex: 2 }}>
        <div className="text-center px-4">
          <h1 className="fw-bold text-brand animate-title" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>Hoken Hub</h1>
          <p className="lead text-muted animate-subtitle" style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)' }}>Simplifying Coverage. Empowering Care.</p>
        </div>
      </div>

      <div className="d-flex flex-column bg-white justify-content-center align-items-center" style={{ flex: 1, height: '100%', padding: '2rem 1rem', borderLeft: '1px solid #dee2e6', overflowY: 'auto' }}>
        <div className="d-lg-none text-center mt-5 pt-5 mb-3">
          <h1 className="fw-bold text-brand animate-title" style={{ fontSize: '2rem' }}>Hoken Hub</h1>
          <p className="text-muted mb-0 animate-subtitle" style={{ fontSize: '1rem' }}>Simplifying Coverage. Empowering Care.</p>
        </div>

        <div className={`w-100 d-lg-none ${showCard ? 'fade-in' : 'invisible'}`} style={{ maxWidth: '400px', paddingTop: '2rem', transition: 'opacity 0.5s ease-in-out' }}>
          <div className="card shadow-lg border-0 p-4">
            <LoginForm
              email={email}
              variant="mobile"
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              showPassword={showPassword}
              toggleShowPassword={toggleShowPassword}
              loading={loading}
              handleLogin={handleLogin}
            />
          </div>
        </div>

        <div className="d-none d-lg-block w-100" style={{ maxWidth: '400px' }}>
          <LoginForm
            email={email}
            variant="desktop"
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            toggleShowPassword={toggleShowPassword}
            loading={loading}
            handleLogin={handleLogin}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
