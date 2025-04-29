import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import API from '../axios';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import PlanPortalLinks from '../components/forms/PlanPortalLinksForm';
import PlanPhoneNumbers from '../components/forms/PlanPhoneNumbersForm';
import PlanImageUploads from '../components/forms/PlanImageUploaders';
import PlanAddressSection from '../components/forms/PlanAddressNotesForm';

const EditInsurancePlan = () => {
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
          prefix: plan.prefix || '',
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
          facilityAddress: plan.facilityAddress || '',
          providerAddress: plan.providerAddress || '',
          portalLinks: plan.portalLinks?.length ? plan.portalLinks : [{ title: '', url: '' }],
          phoneNumbers: plan.phoneNumbers?.length ? plan.phoneNumbers : [{ title: '', number: '' }],
          image: plan.image || '',
          secondaryImage: plan.secondaryImage || '',
          imagePublicId: plan.imagePublicId || '',
          secondaryImagePublicId: plan.secondaryImagePublicId || '',
        });
      } catch (error) {
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

  const handleSubmit = async () => {
    const updatedData = {
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
      await API.put(`/books/${id}`, updatedData);
      enqueueSnackbar('Insurance plan updated successfully!', { variant: 'success' });
      navigate('/');
    } catch (error) {
      enqueueSnackbar('Error updating insurance plan!', { variant: 'error' });
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
    <div className="container-fluid min-vh-100 py-5 bg-grey">
      <BackButton />
      <div className="d-flex justify-content-center">
        {loading && <Spinner />}
        <div className="card w-75 border-0 shadow-sm p-4 rounded-4 mt-4">
          <h2 className="text-center mb-4">Edit Insurance Plan</h2>
          <hr className="divider" />

          <PlanAddressSection formData={formData} handleChange={handleChange} />
          <PlanPortalLinks formData={formData} setFormData={setFormData} />
          <PlanPhoneNumbers formData={formData} setFormData={setFormData} />
          <PlanImageUploads formData={formData} setFormData={setFormData} setLoading={setLoading} />

          <hr className="divider my-4" />
          <div className="d-flex justify-content-between">
            <button className="btn btn-secondary" type="button" onClick={handleReset}>
              Reset
            </button>
            <button className="btn btn-primary" type="button" onClick={handleSubmit}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditInsurancePlan;
