import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import API from '../axios';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import PlanPortalLinks from '../components/forms/PlanPortalLinksForm';
import PlanPhoneNumbers from '../components/forms/PlanPhoneNumbersForm';
import PlanImageUploads from '../components/forms/PlanImageUploads';
import PlanAddressSection from '../components/forms/PlanAddressNotesForm';
import PlanBasicInfoForm from '../components/forms/PlanBasicInfoForm';
import PlanPrefixesForm from '../components/forms/PlanPrefixesForm';
import PlanNotesSection from '../components/forms/PlanNotesSection';

const EditInsurancePlan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    facilityName: '',
    financialClass: '',
    descriptiveName: '',
    payerName: '',
    payerCode: '',
    planName: '',
    planCode: '',
    notes: '',
    authorizationNotes: '',
    ipaPayerId: '',
    payerId: '',
    facilityAddress: { street: '', street2: '', city: '', state: '', zip: '' },
    providerAddress: { street: '', street2: '', city: '', state: '', zip: '' },
    portalLinks: [{ title: '', url: '' }],
    phoneNumbers: [{ title: '', number: '' }],
    prefixes: [''],
    image: '',
    secondaryImage: '',
    imagePublicId: '',
    secondaryImagePublicId: '',
    facilityContracts: [{ facility: '', status: '' }] // New field to handle multiple facility contracts
  });

  const [loading, setLoading] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPHIModal, setShowPHIModal] = useState(false);

  useEffect(() => {
    const fetchPlan = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/books/${id}`);
        const plan = res.data;
        setFormData({
          ...plan,
          prefixes: Array.isArray(plan.prefixes) ? plan.prefixes.map(p => p?.value || '') : [''],
          portalLinks: plan.portalLinks?.length ? plan.portalLinks : [{ title: '', url: '' }],
          phoneNumbers: plan.phoneNumbers?.length ? plan.phoneNumbers : [{ title: '', number: '' }],
          facilityContracts: plan.facilityContracts || [{ facility: '', status: '' }], // Initialize facility contracts
        });
      } catch (err) {
        enqueueSnackbar('Failed to load plan details!', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [id, enqueueSnackbar]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'ipaPayerId' || name === 'payerId' ? value.toUpperCase() : value });
  };

  const handleAddressChange = (e) => {
    const [section, field] = e.target.name.split('.');
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: e.target.value,
      },
    }));
  };

  const handlePrefixChange = (index, newValue) => {
    if (!/^[A-Z0-9]{0,3}$/i.test(newValue)) return;
    const updated = [...formData.prefixes];
    updated[index] = newValue.toUpperCase();
    setFormData({ ...formData, prefixes: updated });
  };

  const addPrefix = () => setFormData({ ...formData, prefixes: [...formData.prefixes, ''] });
  const removePrefix = (index) => {
    const updated = formData.prefixes.filter((_, i) => i !== index);
    setFormData({ ...formData, prefixes: updated });
  };

  const addContract = () => {
    setFormData({
      ...formData,
      facilityContracts: [...formData.facilityContracts, { facility: '', status: '' }]
    });
  };

  const handleContractChange = (index, e) => {
    const { name, value } = e.target;
    const updatedContracts = [...formData.facilityContracts];
    updatedContracts[index][name] = value;
    setFormData({ ...formData, facilityContracts: updatedContracts });
  };

  const removeContract = (index) => {
    const updatedContracts = formData.facilityContracts.filter((_, i) => i !== index);
    setFormData({ ...formData, facilityContracts: updatedContracts });
  };

  const handleImageUpload = async (file, isSecondary = false) => {
    if (!file) return;
    const formDataCloudinary = new FormData();
    formDataCloudinary.append('file', file);
    formDataCloudinary.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dxrxo2wrs/image/upload', {
        method: 'POST',
        body: formDataCloudinary,
      });
      const data = await res.json();
      setFormData(prev => ({
        ...prev,
        ...(isSecondary
          ? { secondaryImage: data.secure_url, secondaryImagePublicId: data.public_id }
          : { image: data.secure_url, imagePublicId: data.public_id }),
      }));
    } catch (err) {
      console.error('Cloudinary upload error:', err);
    }
  };

  const handleSubmitConfirmed = async () => {
    const requiredFields = ['financialClass', 'descriptiveName', 'payerName', 'payerCode', 'planName', 'planCode'];
    const hasEmpty = requiredFields.some((field) => !formData[field]);
    if (hasEmpty) {
      setShowValidationError(true);
      enqueueSnackbar('Please fill out all required fields.', { variant: 'error' });
      return;
    }

    const updatedData = {
      ...formData,
      payerCode: Number(formData.payerCode),
      planCode: Number(formData.planCode),
      ipaPayerId: formData.ipaPayerId?.trim(),
      payerId: formData.payerId?.trim(),
      portalLinks: formData.portalLinks.filter(link => link.title && link.url),
      phoneNumbers: formData.phoneNumbers.filter(phone => phone.title && phone.number),
      prefixes: formData.prefixes
        .map(val => val?.trim().toUpperCase())
        .filter(val => /^[A-Z0-9]{3}$/.test(val))
        .map(val => ({ value: val })),
      facilityContracts: formData.facilityContracts
        .filter(contract => contract.facility && contract.status), // Ensure all contracts are filled
    };

    try {
      setLoading(true);
      await API.put(`/books/${id}`, updatedData);
      enqueueSnackbar('Insurance plan updated successfully!', { variant: 'success' });
      navigate('/');
    } catch (error) {
      console.error('Update failed:', error.response?.data || error.message);
      enqueueSnackbar('Error updating insurance plan!', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setShowValidationError(false);
    navigate(0);
  };

  const handleDeleteConfirmed = async () => {
    try {
      setLoading(true);
      await API.delete(`/books/${id}`);
      enqueueSnackbar('Insurance plan deleted.', { variant: 'success' });
      navigate('/');
    } catch (err) {
      console.error('Delete failed:', err);
      enqueueSnackbar('Failed to delete insurance plan.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-start my-3">
        <BackButton />
      </div>
      <div className="d-flex justify-content-center">
        {loading && <Spinner />}
        <div className="card w-75 border-0 shadow-lg mt-4 overflow-hidden">
          <div className="text-white py-3 px-4" style={{ backgroundColor: '#005b7f' }}>
            <h2 className="text-center m-0">Edit Insurance Plan</h2>
          </div>
          {formData.facilityName && (
            <div className="text-center mb-3 text-muted small fst-italic">
              Viewing/editing plan for: <strong>{formData.facilityName}</strong>
            </div>
          )}
          <div className="p-4">
            {showValidationError && (
              <div className="alert alert-danger">
                Please complete all required fields marked with <span className="text-danger">*</span>.
              </div>
            )}

            <h3 className="text-center mb-4 text-blue">Plan Details</h3>
            <PlanBasicInfoForm formData={formData} handleChange={handleChange} showValidationError={showValidationError} />
            <div className="row g-4">
              <div className="col-md-6">
                <div className="bg-light p-3 shadow-sm h-100">
                  <PlanPortalLinks formData={formData} setFormData={setFormData} />
                  <hr />
                  <PlanPhoneNumbers formData={formData} setFormData={setFormData} />
                </div>
              </div>
              <div className="col-md-6">
                <div className="bg-light p-3 rounded shadow-sm h-100">
                  <PlanPrefixesForm
                    prefixes={formData.prefixes}
                    handlePrefixChange={handlePrefixChange}
                    addPrefix={addPrefix}
                    removePrefix={removePrefix}
                  />
                </div>
              </div>
            </div>

            <h3 className="text-center my-4 text-blue">Facility Contract Information</h3>
            <div className="bg-light p-3 rounded shadow-sm mb-4">
              <div>
                {formData.facilityContracts.map((contract, index) => (
                  <div key={index} className="mb-3">
                    <div className="row">
                      <div className="col-6">
                        <label>Facility</label>
                        <input
                          type="text"
                          className="form-control"
                          name="facility"
                          value={contract.facility}
                          onChange={(e) => handleContractChange(index, e)}
                        />
                      </div>
                      <div className="col-6">
                        <label>Status</label>
                        <select
                          className="form-select"
                          name="status"
                          value={contract.status}
                          onChange={(e) => handleContractChange(index, e)}
                        >
                          <option value="Contracted">Contracted</option>
                          <option value="Not Contracted">Not Contracted</option>
                          <option value="Must Call to Confirm">Must Call to Confirm</option>
                        </select>
                      </div>
                    </div>
                    <button
                      className="btn btn-danger btn-sm mt-2"
                      onClick={() => removeContract(index)}
                    >
                      Remove Facility
                    </button>
                  </div>
                ))}
                <button
                  className="btn btn-primary btn-sm"
                  onClick={addContract}
                >
                  Add Facility Contract
                </button>
              </div>
            </div>

            <h3 className="text-center my-4 text-blue">Important Notes</h3>
            <PlanNotesSection formData={formData} handleChange={handleChange} />

            <h3 className="text-center my-4 text-blue">Insurance Card Examples</h3>
            <PlanImageUploads formData={formData} setFormData={setFormData} handleImageUpload={handleImageUpload} />
            <hr className="divider my-4" />
            <div className="d-flex justify-content-between">
              <button className="btn btn-cancel" type="button" onClick={handleReset}>Reset</button>
              <button className="btn btn-login" type="button" onClick={() => setShowPHIModal(true)}>Save Changes</button>
            </div>
            <div className="text-end mt-1">
              <button className="btn btn-delete" onClick={() => setShowDeleteModal(true)}>Delete Plan</button>
            </div>
          </div>
        </div>
      </div>

      {showPHIModal && (
        <div
          className="modal-backdrop-custom fade show"
          onClick={() => setShowPHIModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1050,
            animation: 'fadeInBackdrop 0.25s ease-in',
          }}
        >
          <div
            className="modal-content-custom"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              maxWidth: '500px',
              width: '90%',
              margin: 'auto',
              padding: '2rem',
              borderRadius: '1rem',
              boxShadow: '0 0 20px rgba(0,0,0,0.2)',
              animation: 'fadeInModal 0.3s ease-out',
              transform: 'translateY(20%)',
            }}
          >
            <h5 className="text-center text-blue mb-3">⚠️ Please Do Not Include PHI</h5>
            <p className="text-muted text-center">
              Ensure this insurance plan does not contain any Protected Health Information (PHI)
              such as patient names, IDs, or any personal identifiers. If you see PHI, report it to the administrator immediately.
            </p>
            <div className="d-flex justify-content-center gap-3 mt-4">
              <button className="btn btn-cancel px-4" onClick={() => setShowPHIModal(false)}>
                Cancel
              </button>
              <button className="btn btn-login px-4" onClick={() => {
                setShowPHIModal(false);
                handleSubmitConfirmed();
              }}>
                I Understand & Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div
          className="modal-backdrop-custom fade show"
          onClick={() => setShowDeleteModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1050,
          }}
        >
          <div
            className="modal-content-custom"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              maxWidth: '500px',
              width: '90%',
              margin: 'auto',
              padding: '2rem',
              borderRadius: '1rem',
              boxShadow: '0 0 20px rgba(0,0,0,0.2)',
              transform: 'translateY(20%)',
            }}
          >
            <h5 className="text-center text-danger mb-3">⚠️ Confirm Deletion</h5>
            <p className="text-muted text-center">
              Are you sure you want to delete this insurance plan? This action cannot be undone.
            </p>
            <div className="d-flex justify-content-center gap-3 mt-4">
              <button className="btn btn-cancel px-4" onClick={() => setShowDeleteModal(false)}>Cancel</button>
            </div>
            <div>

              <button className="btn btn-delete px-4 w-100" onClick={handleDeleteConfirmed}>Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default EditInsurancePlan;
