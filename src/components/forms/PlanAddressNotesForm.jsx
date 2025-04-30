import React from 'react';

const PlanAddressSection = ({ formData, handleAddressChange, handleChange }) => {
  const renderAddressFields = (type, label) => (
    <div className="bg-light p-3 shadow-sm">
      <h6 className="mb-3">{label}</h6>
      <div className="row g-3">
        <div className="col-12">
          <label className="form-label">Street Address</label>
          <input
            type="text"
            name={`${type}.street`}
            className="form-control"
            value={formData[type]?.street || ''}
            onChange={handleAddressChange}
          />
        </div>
        <div className="col-12">
          <label className="form-label">Address Line 2 (optional)</label>
          <input
            type="text"
            name={`${type}.street2`}
            className="form-control"
            value={formData[type]?.street2 || ''}
            onChange={handleAddressChange}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">City</label>
          <input
            type="text"
            name={`${type}.city`}
            className="form-control"
            value={formData[type]?.city || ''}
            onChange={handleAddressChange}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">State</label>
          <input
            type="text"
            name={`${type}.state`}
            maxLength={2}
            className="form-control"
            value={formData[type]?.state || ''}
            onChange={handleAddressChange}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">ZIP Code</label>
          <input
            type="text"
            name={`${type}.zip`}
            maxLength={5}
            className="form-control"
            value={formData[type]?.zip || ''}
            onChange={handleAddressChange}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="row g-4 mt-2">

      {/* Styled box for Payer IDs */}
      <div className="col-12">
        <div className="bg-light p-3 shadow-sm">
          <h5 className="text-center my-2">Electronic Payer IDs</h5>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Payer ID (IPA)</label>
              <input
                type="text"
                className="form-control"
                name="ipaPayerId"
                maxLength={5}
                value={formData.ipaPayerId}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Payer ID (Payer)</label>
              <input
                type="text"
                className="form-control"
                name="payerId"
                maxLength={5}
                value={formData.payerId}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Two-column layout for addresses */}
      <div className="col-md-6">
        {renderAddressFields('facilityAddress', 'Claims Address (Facility)')}
      </div>
      <div className="col-md-6">
        {renderAddressFields('providerAddress', 'Claims Address (Professional)')}
      </div>
    </div>
  );
};

export default PlanAddressSection;
