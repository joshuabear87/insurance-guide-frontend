import React, { useEffect, useState } from 'react';
import Navbar from './NavBar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.body.classList.toggle('bg-dark', darkMode);
    document.body.classList.toggle('text-light', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <div className={`d-flex flex-column min-vh-100 mx-5 ${darkMode ? 'bg-dark text-light' : 'bg-light'}`}>
      <Navbar />
      <div className="text-end px-3 pt-2">
        <button onClick={() => setDarkMode(!darkMode)} className="btn btn-sm btn-outline-secondary">
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
      <main className="flex-grow-1 container-fluid" style={{ paddingTop: '120px', paddingBottom: '60px' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
