import React from 'react';

const PlanNotesSection = ({ formData, handleChange }) => {
  return (
    <div className="row g-3 mt-4">
      <div className="col-12">
        <div className="bg-light p-4 shadow-sm">

          <div className="mb-3">
            <label className="form-label">Eligibility and Coding Notes</label>
            <textarea
              className="form-control"
              rows="3"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Authorization Notes</label>
            <textarea
              className="form-control"
              rows="3"
              name="authorizationNotes"
              value={formData.authorizationNotes}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanNotesSection;
