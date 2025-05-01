import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PlanFilterPills = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const filterMap = {
    '/plans': 'All',
    '/plans/medicare': 'Medicare',
    '/plans/medi-cal': 'Medi-Cal',
    '/plans/commercial': 'Commercial',
    '/plans/bluecard-prefixes': 'Blue Card Prefixes',
  };

  const currentPath = location.pathname;

  return (
    <div className="btn-group btn-group-sm mb-2" role="group" aria-label="Insurance Filters">
      {Object.entries(filterMap).map(([path, label], index, array) => (
        <button
          key={path}
          type="button"
          className={`btn fw-semibold px-2 py-1 border ${
            currentPath === path
              ? 'text-white'
              : 'text-dark bg-light border-secondary'
          }`}
          style={{
            backgroundColor: currentPath === path ? '#005b7f' : undefined,
            fontSize: '0.75rem',
            borderRadius:
              index === 0
                ? '5px 0 0 5px'
                : index === array.length - 1
                ? '0 5px 5px 0'
                : '0',
            boxShadow: currentPath === path ? 'inset 0 2px 4px rgba(0,0,0,0.2)' : 'none',
            transition: 'all 0.15s ease-in-out',
          }}
          onClick={() => navigate(path)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default PlanFilterPills;
