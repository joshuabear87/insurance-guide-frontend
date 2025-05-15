import React, { createContext, useState, useEffect } from 'react';
import API from '../axios';

export const FacilityContext = createContext();

export const FacilityProvider = ({ children }) => {
  const [facility, setFacility] = useState(localStorage.getItem('activeFacility') || '');
  const [facilityTheme, setFacilityTheme] = useState({
    primaryColor: '#005b7f', // Default blue fallback
  });

  useEffect(() => {
    if (facility) {
      localStorage.setItem('activeFacility', facility);

      const fetchTheme = async () => {
        try {
          const res = await API.get(`/facilities/${encodeURIComponent(facility)}`);
          setFacilityTheme(res.data);
        } catch (err) {
          console.error('❌ Failed to load facility theme:', err);
        }
      };

      fetchTheme();
    }
  }, [facility]);

  return (
    <FacilityContext.Provider value={{ facility, setFacility, facilityTheme }}>
      {children}
    </FacilityContext.Provider>
  );
};
