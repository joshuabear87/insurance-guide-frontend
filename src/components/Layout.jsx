import React, { useEffect, useRef, useState } from 'react';
import Navbar from './NavBar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const navbarRef = useRef(null);
  const [topPadding, setTopPadding] = useState(100); // fallback if ref fails
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('bg-dark', darkMode);
    document.body.classList.toggle('text-light', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    if (navbarRef.current) {
      const updatePadding = () => {
        const height = navbarRef.current.offsetHeight;
        setTopPadding(height + 80); // ⬅️ 20px spacing under navbar
      };

      updatePadding(); // initial
      window.addEventListener('resize', updatePadding); // responsive

      return () => window.removeEventListener('resize', updatePadding);
    }
  }, []);

  return (
    <div className={`d-flex flex-column min-vh-100 mx-0 px-3 ${darkMode ? 'bg-dark text-light' : 'bg-light'}`}>
      <div ref={navbarRef}>
        <Navbar />
      </div>

      <div className="text-end px-3 pt-2">
        <button onClick={() => setDarkMode(!darkMode)} className="btn btn-sm btn-outline-secondary">
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      <main className="flex-grow-1 container-fluid" style={{ paddingTop: `${topPadding}px`, paddingBottom: '60px' }}>
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
