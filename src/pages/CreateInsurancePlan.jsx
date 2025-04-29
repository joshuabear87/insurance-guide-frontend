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
    facilityAddress: '',
    providerAddress: '',
    portalLinks: [{ title: '', url: '' }],
    phoneNumbers: [{ title: '', number: '' }],
    image: '',
    secondaryImage: '',
    imagePublicId: '',
    secondaryImagePublicId: '',
  });

  const [loading, setLoading] = useState(false);
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
      console.log('UPLOAD RESULT', data);
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

  const handleSavePlan = async () => {
    const newPlan = {
      ...formData,
      payerCode: Number(formData.payerCode),
      planCode: Number(formData.planCode),
      ipaPayerId: formData.ipaPayerId?.trim(),
      payerId: formData.payerId?.trim(),
      portalLinks: formData.portalLinks.filter(link => link.title && link.url),
      phoneNumbers: formData.phoneNumbers.filter(phone => phone.title && phone.number),
    };

    try {
      setLoading(true);
      console.log('Saving plan with data', newPlan);
      await API.post('/books', newPlan);
      enqueueSnackbar('Insurance plan created successfully!', { variant: 'success' });
      navigate('/');
    } catch (error) {
      console.error(error);
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
      facilityAddress: '',
      providerAddress: '',
      portalLinks: [{ title: '', url: '' }],
      phoneNumbers: [{ title: '', number: '' }],
      image: '',
      secondaryImage: '',
      imagePublicId: '',
      secondaryImagePublicId: '',
    });
  };

  return (
    <div className="container-fluid py-5 min-vh-100 bg-grey">
      <BackButton />
      <div className="d-flex justify-content-center">
        {loading && <Spinner />}
        <div className="card border-0 w-75 shadow-sm rounded-4 p-4 mt-4">
          <h1 className="text-center mb-4 text-blue">Create Insurance Plan</h1>
          <hr className="divider" />

          <PlanBasicInfoForm formData={formData} handleChange={handleChange} />
          <PlanAddressSection formData={formData} handleChange={handleChange} />
          <PlanPortalLinks formData={formData} setFormData={setFormData} />
          <PlanPhoneNumbers formData={formData} setFormData={setFormData} />
          <PlanImageUploads formData={formData} setFormData={setFormData} handleImageUpload={handleImageUpload} />

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
  );
};

export default CreateInsurancePlan;
