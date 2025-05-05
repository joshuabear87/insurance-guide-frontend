import React, { useState, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../axios';
import styles from '../styles/NavBar.module.css';

const NavBar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'));
  const [user, setUser] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      fetchUser();
    }
  }, []);

  const fetchUser = async () => {
    try {
      const res = await API.get('/users/me');
      setUser(res.data);
    } catch (err) {
      console.error('Failed to fetch user info:', err);
    }
  };

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
      const { accessToken } = response.data;
      localStorage.setItem('accessToken', accessToken);
      API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      setIsAuthenticated(true);
      await fetchUser(); // fetch role after login
      setShowLoginForm(false);
      closeSidebar();
      alert('Login successful!');
    } catch (error) {
      console.error('Login failed', error.response || error.message);
      alert('Login failed. Please check your credentials.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setIsAuthenticated(false);
    setUser(null);
    setShowLoginForm(false);
    closeSidebar();
    alert('Logged out successfully!');
    navigate('/');
  };

  return (
    <>
      <nav className={`navbar fixed-top py-3 px-3 ${styles.navbar}`}>
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div className="text-truncate">
            <h1 className="p mb-1 text-blue">Hoken Hub</h1>
            <h4 className="mb-0 text-blue">Insurance Coding Guide (pilot)</h4>
          </div>
          <button
            className={`btn text-blue text-delete ${styles.hamburger}`}
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <FaBars size={24} />
          </button>
        </div>
      </nav>

      {/* Sidebar */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={closeSidebar}
      >
        <div className="sidebar-content" onClick={(e) => e.stopPropagation()}>
          <div className="d-flex flex-column align-items-center m-3">
            {!isAuthenticated && !showLoginForm && (
              <button className="btn btn-login w-75" onClick={handleLoginToggle}>Login</button>
            )}
            {isAuthenticated && (
              <button className="btn btn-delete w-75" onClick={handleLogout}>Logout</button>
            )}
          </div>

          <div className="d-flex flex-column align-items-start">
            <hr className="divider" />
            <Link to="/" className="btn btn-blue w-100">Home</Link>
            <hr className="divider" />
            <Link to="/account" className="btn btn-blue w-100" onClick={closeSidebar}>My Account</Link>
            <hr className="divider" />
            <Link to="/phone-numbers" className="btn btn-blue w-100" onClick={closeSidebar}>Insurance Phone Numbers</Link>
            <hr className="divider" />
            <Link to="/portal-links" className="btn btn-blue w-100" onClick={closeSidebar}>Insurance Web Portals</Link>
            <hr className="divider" />
            {user?.role === 'admin' && (
              <>
                <Link to="/books/create" className="w-100" onClick={closeSidebar}>
                  <button className="btn btn-green w-100">+ Add New Insurance</button>
                </Link>
                <hr className="divider" />
              </>
            )}
            <Link to='/request-update' className="btn btn-request w-100" onClick={closeSidebar}>Request an Update</Link>
            <hr className="divider" />
            <Link to="/printable-page" className="btn btn-request w-100" onClick={closeSidebar}>Downtime Printout</Link>
            <hr className="divider" />
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginForm && (
        <div className="modal-overlay" onClick={handleLoginToggle}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <h5 className="mb-4 text-center">Administrator Login</h5>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-login w-50">Login</button>
                <button type="button" className="btn btn-cancel w-50" onClick={handleLoginToggle}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
