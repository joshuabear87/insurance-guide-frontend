import React from 'react';

const PlanPhoneNumbers = ({ phoneNumbers, handlePhoneNumberChange, addPhoneNumber, removePhoneNumber }) => {
  return (
    <div className="col-12">
      <h5 className="text-center my-4 btn-blue">Phone Numbers</h5>

      {phoneNumbers.map((phone, index) => (
        <div key={index} className="d-flex mb-2 align-items-center gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Title"
            value={phone.title}
            onChange={(e) => handlePhoneNumberChange(index, 'title', e.target.value)}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Phone Number"
            value={phone.number}
            onChange={(e) => handlePhoneNumberChange(index, 'number', e.target.value)}
          />
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => removePhoneNumber(index)}
          >
            ✖
          </button>
        </div>
      ))}

      <button type="button" className="btn btn-primary btn-sm mt-2" onClick={addPhoneNumber}>
        + Add Phone Number
      </button>
    </div>
  );
};

export default PlanPhoneNumbers;
