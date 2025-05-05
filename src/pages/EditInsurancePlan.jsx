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
  const [formData, setFormData] = useState({
    financialClass: '',
    descriptiveName: '',
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchPlan = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/books/${id}`);
        const plan = res.data;
        setFormData({
          financialClass: plan.financialClass || '',
          descriptiveName: plan.descriptiveName || '',
          payerName: plan.payerName || '',
          payerCode: plan.payerCode || '',
          planName: plan.planName || '',
          planCode: plan.planCode || '',
          samcContracted: plan.samcContracted || '',
          samfContracted: plan.samfContracted || '',
          notes: plan.notes || '',
          authorizationNotes: plan.authorizationNotes || '',
          ipaPayerId: plan.ipaPayerId || '',
          payerId: plan.payerId || '',
          facilityAddress: plan.facilityAddress || { street: '', street2: '', city: '', state: '', zip: '' },
          providerAddress: plan.providerAddress || { street: '', street2: '', city: '', state: '', zip: '' },
          portalLinks: Array.isArray(plan.portalLinks) && plan.portalLinks.length > 0 ? plan.portalLinks : [{ title: '', url: '' }],
          phoneNumbers: Array.isArray(plan.phoneNumbers) && plan.phoneNumbers.length > 0 ? plan.phoneNumbers : [{ title: '', number: '' }],
          prefixes: Array.isArray(plan.prefixes) && plan.prefixes.length > 0
            ? plan.prefixes.map((p) => p?.value || '')
            : [],
          image: plan.image || '',
          secondaryImage: plan.secondaryImage || '',
          imagePublicId: plan.imagePublicId || '',
          secondaryImagePublicId: plan.secondaryImagePublicId || '',
        });              } catch (error) {
        enqueueSnackbar('Failed to load plan details!', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [id, enqueueSnackbar]);

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
    const [section, field] = name.split('.');
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
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

  const handleSubmit = async () => {
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
  
    const updatedData = {
      ...formData,
      payerCode: Number(formData.payerCode),
      planCode: Number(formData.planCode),
      ipaPayerId: formData.ipaPayerId?.trim(),
      payerId: formData.payerId?.trim(),
      facilityAddress: {
        street: formData.facilityAddress?.street || '',
        street2: formData.facilityAddress?.street2 || '',
        city: formData.facilityAddress?.city || '',
        state: formData.facilityAddress?.state || '',
        zip: formData.facilityAddress?.zip || '',
      },
      providerAddress: {
        street: formData.providerAddress?.street || '',
        street2: formData.providerAddress?.street2 || '',
        city: formData.providerAddress?.city || '',
        state: formData.providerAddress?.state || '',
        zip: formData.providerAddress?.zip || '',
      },
      portalLinks: formData.portalLinks.filter((link) => link.title && link.url),
      phoneNumbers: formData.phoneNumbers.filter((phone) => phone.title && phone.number),
      prefixes: formData.prefixes
        .map((val) => val?.trim().toUpperCase())
        .filter((val) => /^[A-Z0-9]{3}$/.test(val))
        .map((val) => ({ value: val })),
    };
  
    try {
      setLoading(true);
      await API.put(`/books/${id}`, updatedData);
      enqueueSnackbar('Insurance plan updated successfully!', { variant: 'success' });
      navigate('/');
    } catch (error) {
      console.error('PUT error:', error.response?.data || error.message);
      enqueueSnackbar('Error updating insurance plan!', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };
    
  const handleDelete = async () => {
    setLoading(true);
    try {
      await API.delete(`/books/${id}`);
      enqueueSnackbar('Insurance plan deleted successfully!', { variant: 'success' });
      navigate('/');
    } catch (error) {
      console.error('Error deleting plan:', error);
      enqueueSnackbar('Error deleting insurance plan.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      financialClass: '',
      descriptiveName: '',
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
    <div className="container my-5">
    <div className="d-flex justify-content-start my-3">
      <BackButton />
    </div>
      <div className="d-flex justify-content-center">
        {loading && <Spinner />}
        <div className="card w-75 border-0 shadow-lg mt-4 overflow-hidden">
          {/* Blue Header Section */}
          <div className="text-white py-3 px-4" style={{ backgroundColor: '#005b7f' }}>
            <h2 className="text-center m-0">Edit Insurance Plan</h2>
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
                <div className="bg-light p-3 shadow-sm h-100">
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
              handleChange={handleChange}
              handleAddressChange={handleAddressChange}
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
            <div className="d-flex justify-content-between mt-4">
              <button className="btn btn-cancel" type="button" onClick={handleReset}>
                Reset
              </button>
              <button className="btn btn-login" type="button" onClick={handleSubmit}>
                Save Changes
              </button>
            </div>
            <div className='d-flex justify-content-end'>

              <button className="btn p-0 m-2 text-danger" onClick={() => setShowDeleteModal(true)}>
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* DELETE MODAL */}

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
              <h5 className="text-center text-danger mb-3">Are you sure you would like to delete this plan?</h5>
              <p className="text-center text-muted mb-4">This action cannot be undone.</p>
              <div className="d-flex justify-content-center gap-3">
                <button className="btn btn-secondary px-4" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-danger px-4" onClick={handleDelete}>
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default EditInsurancePlan;
