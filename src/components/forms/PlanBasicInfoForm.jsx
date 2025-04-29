import React from 'react';

const PlanBasicInfoForm = ({ formData, handleChange }) => {
  const fields = [
    ['Financial Class', 'financialClass', 'select', ['Commercial', 'Medicare', 'Medi-Cal']],
    ['Descriptive Name', 'descriptiveName'],
    ['Payer Name', 'payerName'],
    ['Payer Code', 'payerCode'],
    ['Plan Name', 'planName'],
    ['Plan Code', 'planCode'],
  ];

  const textareas = [
    ['Prefixes', 'prefix'],
    ['Eligibility and Coding Notes', 'notes'],
  ];

  const contractOptions = [
    ['SAMC Contracted', 'samcContracted', ['Contracted', 'Not Contracted', 'Must call to confirm']],
    ['SAMF Contracted', 'samfContracted', ['Contracted', 'Not Contracted', 'Must call to confirm']],
  ];

  return (
    <>
      <h5 className="text-center my-4 btn-blue">Basic Payer and Coding Information</h5>

      <div className="row g-3">
        {fields.map(([label, name, type, options], index) => (
          <div className="col-md-6" key={index}>
            <label className="form-label">{label}</label>
            {type === 'select' ? (
              <select
                className="form-select"
                name={name}
                value={formData[name]}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                className="form-control"
                name={name}
                value={formData[name]}
                onChange={handleChange}
              />
            )}
          </div>
        ))}

        {textareas.map(([label, name], index) => (
          <div className="col-12" key={index}>
            <label className="form-label">{label}</label>
            <textarea
              className="form-control"
              rows="2"
              name={name}
              value={formData[name]}
              onChange={handleChange}
            />
          </div>
        ))}

        {contractOptions.map(([label, name, options], index) => (
          <div className="col-md-6" key={index}>
            <label className="form-label">{label}</label>
            <select
              className="form-select"
              name={name}
              value={formData[name]}
              onChange={handleChange}
            >
              <option value="">Select</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </>
  );
};

export default PlanBasicInfoForm;
