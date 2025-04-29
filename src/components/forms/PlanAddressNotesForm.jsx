import React from 'react';

const PlanAddressSection = ({ formData, handleChange }) => {
  return (
    <div className="row g-3">
      <div className="col-12">
        <h5 className="text-center my-4 text-blue">Claims, Contact, and Authorization Information</h5>
      </div>

      {[
        ['Authorization Notes', 'authorizationNotes'],
        ['Facility Claims Address', 'facilityAddress'],
        ['Provider Claims Address', 'providerAddress'],
      ].map(([label, name], index) => (
        <div className="col-12" key={index}>
          <label className="form-label">{label}</label>
          <textarea
            className="form-control"
            rows="2"
            name={name}
            value={formData[name]}
            onChange={handleChange}
          ></textarea>
        </div>
      ))}

      {[
        ['Payer ID (IPA)', 'ipaPayerId'],
        ['Payer ID (Payer)', 'payerId'],
      ].map(([label, name], index) => (
        <div className="col-md-6" key={index}>
          <label className="form-label">{label}</label>
          <input
            type="text"
            className="form-control"
            name={name}
            maxLength={5}
            value={formData[name]}
            onChange={handleChange}
          />
        </div>
      ))}
    </div>
  );
};

export default PlanAddressSection;
