import React from 'react';

const PlanPrefixesForm = ({ prefixes, handlePrefixChange, addPrefix, removePrefix }) => {
  return (
    <div className="col-12">
      <h5 className="text-center fs-5 mt-2">Blue Card Prefixes</h5>
      <h6 className='text-center mb-4' style={{ fontSize: "12px"}}>(Only for: <strong>Blue Cross</strong>, <strong>Blue Shield</strong> or <strong>Blue Cross/Blue Shield</strong>.)</h6>

      {prefixes.map((prefix, index) => (
        
        <div key={index} className="d-flex mb-2 p-2 align-items-center gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Enter prefix..."
            maxLength={3}
            value={prefix}
            onChange={(e) => handlePrefixChange(index, e.target.value)}
          />
          <button
            type="button"
            className="btn btn-delete btn-sm"
            onClick={() => removePrefix(index)}
          >
            ✖
          </button>
        </div>
      ))}

      <button type="button" className="btn btn-login btn-sm m-2" onClick={addPrefix}>
        + Add Prefix
      </button>
    </div>
  );
};

export default PlanPrefixesForm;
