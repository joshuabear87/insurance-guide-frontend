import React, { createContext, useState, useEffect } from 'react';
import API from '../../../api/axios';

export const FacilityContext = createContext();

export const FacilityProvider = ({ children }) => {
  const [facility, setFacility] = useState(localStorage.getItem('activeFacility') || '');
  const [facilityTheme, setFacilityTheme] = useState({
    primaryColor: '#005b7f',
  });
  const [facilities, setFacilities] = useState([]);

  useEffect(() => {
    if (facility) {
      localStorage.setItem('activeFacility', facility);

      const fetchTheme = async () => {
        try {
          const res = await API.get(`/facilities/${encodeURIComponent(facility)}`);
          setFacilityTheme(res.data.data);
        } catch (err) {
          console.error('❌ Failed to load facility theme:', err);
        }
      };

      fetchTheme();
    }
  }, [facility]);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const res = await API.get('/facilities');
        setFacilities(res.data.data); 
      } catch (err) {
        console.error('❌ Failed to load facility list:', err);
      }
    };

    fetchFacilities();
  }, []);

  return (
    <FacilityContext.Provider
      value={{ facility, setFacility, facilityTheme, facilities }}
    >
      {children}
    </FacilityContext.Provider>
  );
};