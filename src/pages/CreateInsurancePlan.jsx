import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const CreateInsurancePlan = () => {
  const [formData, setFormData] = useState({
    financialClass: '',
    descriptiveName: '',
    prefix: '',
    payerName: '',
    payerCode: '',
    planName: '',
    planCode: '',
    samcContracted: '',
    samfContracted: '',
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
  });

  const [loading, setLoading] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);

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
      if (isSecondary) {
        setFormData((prev) => ({
          ...prev,
          secondaryImage: data.secure_url,
          secondaryImagePublicId: data.public_id,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          image: data.secure_url,
          imagePublicId: data.public_id,
        }));
      }
    } catch (error) {
      console.error('Cloudinary upload error:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'ipaPayerId' || name === 'payerId') {
      setFormData({ ...formData, [name]: value.toUpperCase() });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    const [field, key] = name.split('.');
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [key]: value,
      },
    }));
  };

  const handlePrefixChange = (index, newValue) => {
    if (!/^[A-Z0-9]{0,3}$/i.test(newValue)) return;
    const updated = [...formData.prefixes];
    updated[index] = newValue.toUpperCase();
    setFormData({ ...formData, prefixes: updated });
  };

  const addPrefix = () => {
    setFormData({ ...formData, prefixes: [...formData.prefixes, ''] });
  };

  const removePrefix = (index) => {
    const updated = formData.prefixes.filter((_, i) => i !== index);
    setFormData({ ...formData, prefixes: updated });
  };

  const handleSavePlan = async () => {
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
      samcContracted: '',
      samfContracted: '',
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
    });
    setShowValidationError(false);
  };

  return (
    <div className="container-fluid min-vh-100 py-5 bg-grey">
      <BackButton />
      <div className="d-flex justify-content-center">
        {loading && <Spinner />}
        <div className="card w-75 border-0 shadow-sm mt-4 overflow-hidden">
          {/* Blue Header Section */}
          <div className="text-white py-3 px-4" style={{ backgroundColor: '#005b7f' }}>
            <h2 className="text-center m-0">Create Insurance Plan</h2>
          </div>

          {/* Card Body */}
          <div className="p-4">
            {showValidationError && (
              <div className="alert alert-danger">
                Please complete all required fields marked with <span className="text-danger">*</span>.
              </div>
            )}
            <h3 className="text-center mb-4 text-blue">Plan Details</h3>
            <PlanBasicInfoForm
              formData={formData}
              handleChange={handleChange}
              showValidationError={showValidationError}
            />
            <div className="row g-4">
              {/* Left column: Portals + Phones */}
              <div className="col-md-6">
                <div className="bg-light p-3 rounded shadow-sm h-100">
                  <PlanPortalLinks formData={formData} setFormData={setFormData} />
                  <hr />
                  <PlanPhoneNumbers formData={formData} setFormData={setFormData} />
                </div>
              </div>

              {/* Right column: Prefixes */}
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

            <PlanAddressSection
              formData={formData}
              handleAddressChange={handleAddressChange}
              handleChange={handleChange}
            />
            <h3 className="text-center my-4 text-blue">Important Notes</h3>

            <PlanNotesSection formData={formData} handleChange={handleChange} />
            <h3 className="text-center my-4 text-blue">Insurance Card Examples</h3>

            <PlanImageUploads
              formData={formData}
              setFormData={setFormData}
              handleImageUpload={handleImageUpload}
            />

            <hr className="divider my-4" />
            <div className="d-flex justify-content-between">
              <button className="btn btn-secondary" type="button" onClick={handleReset}>
                Reset
              </button>
              <button className="btn btn-primary" type="button" onClick={handleSavePlan}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInsurancePlan;
