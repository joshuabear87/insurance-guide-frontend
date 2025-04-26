import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      {/* Navbar */}
      <nav className="navbar fixed-top py-3 px-5">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div>
            <h1 className="p">Saint Agnes Medical Center</h1>
            <h4 className="mb-0">Insurance Coding Guide</h4>
          </div>

          {/* Hamburger Icon */}
          <button
            className="btn hamburger"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <FaBars size={24} />
          </button>
        </div>
      </nav>

      {/* Sidebar Overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={closeSidebar}
      >
        <div className="sidebar-content" onClick={(e) => e.stopPropagation()}>
          <div className='d-flex flex-column align-items-end m-3'>
            <button className="btn btn-gray" onClick={closeSidebar}>Close X</button>
          </div>
          <div className="d-flex flex-column align-items-start">
            <hr className='divider'></hr>
            <button className="btn btn-blue">All Insurances</button>
            <hr className='divider'></hr>
            <button className="btn btn-blue">Commercial Insurances</button>
            <hr className='divider'></hr>
            <button className="btn btn-blue">Medicare Insurances</button>
            <hr className='divider'></hr>
            <button className="btn btn-blue">Medi-Cal Insurances</button>
            <hr className='divider'></hr>
            <Link to="/books/create">
              <button className="btn btn-green">+ Add New Insurance</button>
            </Link>
            <hr className='divider'></hr>
            <button className="btn btn-request">Request an update</button>
            <hr className='divider'></hr>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
