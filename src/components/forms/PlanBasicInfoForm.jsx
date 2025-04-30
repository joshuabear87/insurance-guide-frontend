import React from 'react';

const PlanBasicInfoForm = ({ formData, handleChange, showValidationError }) => {
  const requiredFields = [
    'financialClass',
    'descriptiveName',
    'payerName',
    'payerCode',
    'planName',
    'planCode',
    'samcContracted',
    'samfContracted',
  ];

  const fields = [
    ['Financial Class', 'financialClass', 'select', ['Commercial', 'Medicare', 'Medi-Cal']],
    ['Descriptive Name', 'descriptiveName'],
    ['Payer Name', 'payerName'],
    ['Payer Code', 'payerCode'],
    ['Plan Name', 'planName'],
    ['Plan Code', 'planCode'],
  ];

  const contractOptions = [
    ['Is SAMC Contracted?', 'samcContracted', ['Contracted', 'Not Contracted', 'Must call to confirm']],
    ['Is SAMF Contracted?', 'samfContracted', ['Contracted', 'Not Contracted', 'Must call to confirm']],
  ];

  const isInvalid = (name) =>
    showValidationError && requiredFields.includes(name) && !formData[name];

  return (
    <div className='p-2'>
      <div className="row g-3 shadow-sm mb-4 pb-4 px-2 bg-light">
        {fields.map(([label, name, type, options], index) => (
          <div className="col-md-6" key={index}>
            <label className="form-label">
              {label} {requiredFields.includes(name) && <span className="text-danger">*</span>}
            </label>

            {type === 'select' ? (
              <select
                className={`form-select ${isInvalid(name) ? 'is-invalid' : ''}`}
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
                type={['payerCode', 'planCode'].includes(name) ? 'number' : 'text'}
                name={name}
                value={formData[name]}
                min="0"
                className={`form-control ${isInvalid(name) ? 'is-invalid' : ''}`}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (
                    ['payerCode', 'planCode'].includes(name) &&
                    ['e', 'E', '+', '-', '.'].includes(e.key)
                  ) {
                    e.preventDefault();
                  }
                }}
              />
            )}
          </div>
        ))}

        {contractOptions.map(([label, name, options], index) => (
          <div className="col-md-6" key={index}>
            <label className="form-label">
              {label} {requiredFields.includes(name) && <span className="text-danger">*</span>}
            </label>
            <select
              className={`form-select ${isInvalid(name) ? 'is-invalid' : ''}`}
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
    </div>
  );
};

export default PlanBasicInfoForm;
