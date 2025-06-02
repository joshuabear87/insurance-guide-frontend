import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import FacilitySelector from './FacilitySelector';
import { FacilityContext } from '../context/FacilityContext';
import { AuthContext } from '../context/AuthContexts';

const PlanFilterPills = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { facility, setFacility, facilityTheme, facilities } = useContext(FacilityContext);
  const { user } = useContext(AuthContext);

  const currentPath = location.pathname;

  const filterMap = {
    '/plans': 'All',
    '/plans/medicare': 'Medicare',
    '/plans/medi-cal': 'Medi-Cal',
    '/plans/commercial': 'Commercial',
    '/plans/bluecard-prefixes': 'Blue Card Prefixes',
  };

  const handleFacilityChange = (newFacility) => {
    setFacility(newFacility);
    localStorage.setItem('activeFacility', newFacility);
    window.location.reload(); // or refetch data if preferred
  };

  return (
    <div className="d-flex justify-content-between align-items-center flex-wrap mb-2">
      {/* Filter buttons */}
      <div className="btn-group btn-group-sm" role="group" aria-label="Insurance Filters">
        {Object.entries(filterMap).map(([path, label], index, array) => (
          <button
            key={path}
            type="button"
            className={`btn fw-semibold px-2 py-1 border ${
              currentPath === path ? 'text-white' : 'text-dark bg-light border-secondary'
            }`}
            style={{
              backgroundColor: currentPath === path ? facilityTheme.primaryColor : undefined,
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

      {/* Facility Selector (only if user has multiple access) */}
      {user?.facilityAccess?.length > 1 && (
        <FacilitySelector
          current={facility}
          available={facilities.filter(fac => user.facilityAccess.includes(fac.name))}
          onChange={handleFacilityChange}
        />
      )}
    </div>
  );
};

export default PlanFilterPills;
