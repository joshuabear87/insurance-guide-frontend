import React from 'react';

const FacilitySelector = ({ current, available, onChange }) => {
  return (
    <select
      className="form-select form-select-sm w-auto"
      value={current}
      onChange={(e) => onChange(e.target.value)}
    >
      {available.map((facility) => (
        <option key={facility} value={facility}>
          {facility}
        </option>
      ))}
    </select>
  );
};

export default FacilitySelector;
