import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import API from '../../../api/axios';
import BackButton from '../../../features/components/common/BackButton';
import Spinner from '../../..//features/components/common/Spinner';
import PlanPortalLinks from '../components/forms/PlanPortalLinksForm';
import PlanPhoneNumbers from '../components/forms/PlanPhoneNumbersForm';
import PlanImageUploads from '../components/forms/PlanImageUploads';
import PlanAddressSection from '../components/forms/PlanAddressNotesForm';
import PlanBasicInfoForm from '../components/forms/PlanBasicInfoForm';
import PlanPrefixesForm from '../components/forms/PlanPrefixesForm';
import PlanNotesSection from '../components/forms/PlanNotesSection';
import { FacilityContext } from '../../../features/components/context/FacilityContext';

const CreateInsurancePlan = () => {
  const activeFacility = localStorage.getItem('activeFacility') || '';
  const [formData, setFormData] = useState({
    financialClass: '',
    descriptiveName: '',
    facilityName: activeFacility,
    prefix: '',
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
    facilityContracts: [], 
  });

  const { facility, facilityTheme } = useContext(FacilityContext);
  const [loading, setLoading] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  const [showPHIModal, setShowPHIModal] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

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
      setFormData((prev) => ({
        ...prev,
        ...(isSecondary
          ? { secondaryImage: data.secure_url, secondaryImagePublicId: data.public_id }
          : { image: data.secure_url, imagePublicId: data.public_id }),
      }));
    } catch (error) {
      console.error('Cloudinary upload error:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'ipaPayerId' || name === 'payerId' ? value.toUpperCase() : value });
  };

  const handleAddressChange = (e) => {
    const [field, key] = e.target.name.split('.');
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [key]: e.target.value,
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
    const newContracts = [...formData.facilityContracts, { facilityName: '', contractStatus: '' }];
    setFormData({ ...formData, facilityContracts: newContracts });
  };

  const handleContractChange = (e, index) => {
    const { name, value } = e.target;
    const newContracts = [...formData.facilityContracts];
    newContracts[index][name] = value;
    setFormData({ ...formData, facilityContracts: newContracts });
  };

  const removeContract = (index) => {
    const newContracts = formData.facilityContracts.filter((_, i) => i !== index);
    setFormData({ ...formData, facilityContracts: newContracts });
  };

  const handleSavePlanConfirmed = async () => {
    const requiredFields = [
      'financialClass', 'descriptiveName', 'payerName', 'payerCode',
      'planName', 'planCode',
    ];
    const hasEmpty = requiredFields.some((field) => !formData[field]);
    if (hasEmpty) {
      setShowValidationError(true);
      enqueueSnackbar('Please fill out all required fields.', { variant: 'error' });
      return;
    }

    const newPlan = {
      ...formData,
      payerCode: Number(formData.payerCode),
      planCode: Number(formData.planCode),
      ipaPayerId: formData.ipaPayerId?.trim(),
      payerId: formData.payerId?.trim(),
      portalLinks: formData.portalLinks.filter((link) => link.title && link.url),
      phoneNumbers: formData.phoneNumbers.filter((phone) => phone.title && phone.number),
      prefixes: formData.prefixes
        .map((val) => val?.trim().toUpperCase())
        .filter((val) => /^[A-Z0-9]{3}$/.test(val))
        .map((val) => ({ value: val })),
    };

    try {
      setLoading(true);
      await API.post('/books', newPlan);
      enqueueSnackbar('Insurance plan created successfully!', { variant: 'success' });
      navigate('/');
    } catch (error) {
      console.error('Save failed:', error.response?.data || error.message);
      enqueueSnackbar('Error creating insurance plan!', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      financialClass: '',
      descriptiveName: '',
      prefix: '',
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
      facilityContracts: [], // Reset contracts
    });
    setShowValidationError(false);
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-start my-3">
        <BackButton />
      </div>
      <div className="d-flex justify-content-center">
        {loading && <Spinner />}
        <div className="card w-75 border-0 shadow-lg mt-4 overflow-hidden">
          <div className="text-white py-3 px-4" style={{ backgroundColor: facilityTheme.primaryColor }}>
            <h2 className="text-center m-0">Create Insurance Plan</h2>
          </div>
          <p className="text-center text-muted mt-2" style={{ fontSize: '0.9rem' }}>
            Facility: <strong>{formData.facilityName}</strong>
          </p>

          <div className="p-4">
            {showValidationError && (
              <div className="alert alert-danger">
                Please complete all required fields marked with <span className="text-danger">*</span>.
              </div>
            )}

            <h3 className="text-center mb-4 text-blue">Plan Details</h3>
            <PlanBasicInfoForm formData={formData} handleChange={handleChange} showValidationError={showValidationError}
                               addContract={addContract} handleContractChange={handleContractChange} removeContract={removeContract} />

            <div className="row g-4">
              <div className="col-md-6">
                <div className="bg-light p-3 rounded shadow-sm h-100">
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

            <h3 className="text-center my-4 text-blue">Claims Information</h3>
            <PlanAddressSection formData={formData} handleAddressChange={handleAddressChange} handleChange={handleChange} />

            <h3 className="text-center my-4 text-blue">Important Notes</h3>
            <PlanNotesSection formData={formData} handleChange={handleChange} />

            <h3 className="text-center my-4 text-blue">Insurance Card Examples</h3>
            <PlanImageUploads formData={formData} setFormData={setFormData} handleImageUpload={handleImageUpload} />

            <hr className="divider my-4" />
            <div className="d-flex justify-content-between">
              <button className="btn btn-cancel" type="button" onClick={handleReset}>Reset</button>
              <button className="btn btn-login" type="button" onClick={() => setShowPHIModal(true)}>Save</button>
            </div>
          </div>
        </div>
      </div>

      {/* PHI MODAL */}
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
                handleSavePlanConfirmed();
              }}>
                I Understand & Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateInsurancePlan;
