import React, { useState, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../axios';

const NavBar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleLoginToggle = () => setShowLoginForm(!showLoginForm);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_URL}/auth/login`,
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      const { token } = response.data;
      localStorage.setItem('token', token);
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
      setShowLoginForm(false);
      closeSidebar();
      alert('Login successful!');
    } catch (error) {
      console.error('Login failed', error.response || error.message);
      alert('Login failed. Please check your credentials.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setShowLoginForm(false);
    closeSidebar();
    alert('Logged out successfully!');
    navigate('/');
  };

  return (
    <>
      <nav className="navbar fixed-top py-3 px-5">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div>
            <h1 className="p">Saint Agnes Medical Center</h1>
            <h4 className="mb-0">Insurance Coding Guide (pilot)</h4>
          </div>
          <button
            className="btn hamburger"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <FaBars size={24} />
          </button>
        </div>
      </nav>

      <div
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={closeSidebar}
      >
        <div className="sidebar-content" onClick={(e) => e.stopPropagation()}>
          <div className="d-flex flex-column align-items-end m-3">
            {!isAuthenticated ? (
              <button className="btn btn-login" onClick={handleLoginToggle}>
                {showLoginForm ? 'Cancel Login' : 'Login'}
              </button>
            ) : (
              <button className="btn btn-danger w-100" onClick={handleLogout}>
                Logout
              </button>
            )}

            {showLoginForm && (
              <form className="mt-3 w-100" onSubmit={handleLogin}>
                <div className="mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-2">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Login
                </button>
              </form>
            )}
          </div>

          <div className="d-flex flex-column align-items-start">
            <hr className="divider" />
            <Link to="/" className="w-100">
              <button className="btn btn-blue w-100">All Insurances</button>
            </Link>
            <hr className="divider" />
            <button className="btn btn-blue w-100">Commercial Insurances</button>
            <hr className="divider" />
            <button className="btn btn-blue w-100">Medicare Insurances</button>
            <hr className="divider" />
            <button className="btn btn-blue w-100">Medi-Cal Insurances</button>
            <hr className="divider" />
            {isAuthenticated && (
              <>
                <Link to="/books/create" className="w-100">
                  <button className="btn btn-green w-100">+ Add New Insurance</button>
                </Link>
                <hr className="divider" />
              </>
            )}
            <button className="btn btn-request w-100">Request an Update</button>
            <hr className="divider" />
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
