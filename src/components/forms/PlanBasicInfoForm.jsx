import React from 'react';

const PlanBasicInfoForm = ({
  formData,
  handleChange,
  showValidationError,
  addContract,
  handleContractChange,
  removeContract,
}) => {
  const requiredFields = [
    'financialClass',
    'descriptiveName',
    'payerName',
    'payerCode',
    'planName',
    'planCode',
  ];

  const fields = [
    ['Financial Class', 'financialClass', 'select', ['Commercial', 'Medicare', 'Medi-Cal']],
    ['Descriptive Name', 'descriptiveName'],
    ['Payer Name', 'payerName'],
    ['Payer Code', 'payerCode'],
    ['Plan Name', 'planName'],
    ['Plan Code', 'planCode'],
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

        {/* Facility Contracts section */}
        <div className="col-12">
          <label className="form-label">
            Facility Contracts <span className="text-danger">*</span>
          </label>

          {/* Render existing facility contracts dynamically */}
          {formData.facilityContracts?.map((contract, index) => (
            <div key={index} className="row g-3 mb-3">
              <div className="col-md-5">
                <input
                  type="text"
                  name="facilityName"
                  value={contract.facilityName}
                  className="form-control"
                  placeholder="Facility Name"
                  onChange={(e) => handleContractChange(e, index)}
                />
              </div>
              <div className="col-md-5">
                <select
                  name="contractStatus"
                  value={contract.contractStatus}
                  className="form-select"
                  onChange={(e) => handleContractChange(e, index)}
                >
                  <option value="">Select Contract Status</option>
                  <option value="Contracted">Contracted</option>
                  <option value="Not Contracted">Not Contracted</option>
                  <option value="Must Call">Must Call</option>
                  <option value="See Notes">See Notes</option>
                </select>
              </div>
              <div className="col-md-2">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => removeContract(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Button to add a new contract line */}
          <div className="d-flex justify-content-start">
            <button type="button" className="btn btn-success" onClick={addContract}>
              Add Contract Line
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanBasicInfoForm;
