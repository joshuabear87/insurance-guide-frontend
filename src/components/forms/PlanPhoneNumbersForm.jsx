import React from 'react';

const PlanPhoneNumbers = ({ formData, setFormData }) => {
  const handlePhoneNumberChange = (index, field, value) => {
    const updatedPhoneNumbers = [...formData.phoneNumbers];
    updatedPhoneNumbers[index][field] = value;
    setFormData({ ...formData, phoneNumbers: updatedPhoneNumbers });
  };

  const addPhoneNumber = () => {
    setFormData({ 
      ...formData, 
      phoneNumbers: [...formData.phoneNumbers, { title: '', number: '' }]
    });
  };

  const removePhoneNumber = (index) => {
    const updatedPhoneNumbers = formData.phoneNumbers.filter((_, i) => i !== index);
    setFormData({ ...formData, phoneNumbers: updatedPhoneNumbers });
  };

  return (
    <div className="col-12">
      <h5 className="text-center my-4">Phone Numbers</h5>

      {formData.phoneNumbers.map((phone, index) => (
        <div key={index} className="d-flex m-2 align-items-center gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Contact name..."
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
            className="btn btn-delete btn-sm"
            onClick={() => removePhoneNumber(index)}
          >
            ✖
          </button>
        </div>
      ))}

      <button type="button" className="btn btn-login btn-sm m-2" onClick={addPhoneNumber}>
        + Add Phone Number
      </button>
    </div>
  );
};

export default PlanPhoneNumbers;
