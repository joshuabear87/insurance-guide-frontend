import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import API from '../axios';
import axios from 'axios';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import ImageUploader from '../components/ImageUploader';

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

  const handlePortalLinkChange = (index, field, value) => {
    const updatedLinks = [...formData.portalLinks];
    updatedLinks[index][field] = value;
    setFormData({ ...formData, portalLinks: updatedLinks });
  };

  const addPortalLink = () => {
    setFormData({ ...formData, portalLinks: [...formData.portalLinks, { title: '', url: '' }] });
  };

  const removePortalLink = (index) => {
    const updatedLinks = formData.portalLinks.filter((_, i) => i !== index);
    setFormData({ ...formData, portalLinks: updatedLinks });
  };

  const handlePhoneNumberChange = (index, field, value) => {
    const updatedNumbers = [...formData.phoneNumbers];
    updatedNumbers[index][field] = value;
    setFormData({ ...formData, phoneNumbers: updatedNumbers });
  };

  const addPhoneNumber = () => {
    setFormData({ ...formData, phoneNumbers: [...formData.phoneNumbers, { title: '', number: '' }] });
  };

  const removePhoneNumber = (index) => {
    const updatedNumbers = formData.phoneNumbers.filter((_, i) => i !== index);
    setFormData({ ...formData, phoneNumbers: updatedNumbers });
  };

  const handleImageUpload = async (file, isSecondary) => {
    if (!file) return;
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'insurance-card');

    try {
      setLoading(true);
      const res = await axios.post('https://api.cloudinary.com/v1_1/dxrxo2wrs/image/upload', data);
      if (isSecondary) {
        setFormData(prev => ({
          ...prev,
          secondaryImage: res.data.secure_url,
          secondaryImagePublicId: res.data.public_id,
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          image: res.data.secure_url,
          imagePublicId: res.data.public_id,
        }));
      }
      enqueueSnackbar('Image uploaded successfully!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Image upload failed!', { variant: 'error' });
    } finally {
      setLoading(false);
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
      await API.put(`/books/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
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
      <div className='d-flex justify-content-center'>
      {loading && <Spinner />}
      <div className="card w-75 border-0 shadow-sm p-4 rounded-4 mt-4">
        <h2 className="text-center mb-4">Edit Insurance Plan</h2>
        <hr className="divider" />

        {/* Form */}
        <h5 className="text-center my-4 btn-blue">Basic Payer and Coding Information</h5>

        <div className="row g-3">
          {[
            ['Financial Class', 'financialClass', 'select', ['Commercial', 'Medicare', 'Medi-Cal']],
            ['Descriptive Name', 'descriptiveName'],
            ['Payer Name', 'payerName'],
            ['Payer Code', 'payerCode'],
            ['Plan Name', 'planName'],
            ['Plan Code', 'planCode'],
          ].map(([label, name, type, options], index) => (
            <div className="col-md-6" key={index}>
              <label className="form-label">{label}</label>
              {type === 'select' ? (
                <select className="form-select" name={name} value={formData[name]} onChange={handleChange}>
                  <option value="">Select</option>
                  {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              ) : (
                <input type="text" className="form-control" name={name} value={formData[name]} onChange={handleChange} />
              )}
            </div>
          ))}

          {[
            ['Prefixes', 'prefix'],
            ['Eligibility and Coding Notes', 'notes'],
          ].map(([label, name], index) => (
            <div className="col-12" key={index}>
              <label className="form-label">{label}</label>
              <textarea className="form-control" rows="2" name={name} value={formData[name]} onChange={handleChange}></textarea>
            </div>
          ))}

          {[ 
            ['SAMC Contracted', 'samcContracted', 'select', ['Contracted', 'Not Contracted', 'Must call to confirm']],
            ['SAMF Contracted', 'samfContracted', 'select', ['Contracted', 'Not Contracted', 'Must call to confirm']],
          ].map(([label, name, type, options], index) => (
            <div className="col-md-6" key={index}>
              <label className="form-label">{label}</label>
              <select className="form-select" name={name} value={formData[name]} onChange={handleChange}>
                <option value="">Select</option>
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          ))}

          <div className="col-12">
            <h5 className="text-center my-4 btn-blue">Claims, Contact, and Authorization Information</h5>
          </div>
{/* Textareas first (Authorization Notes, Facility, Provider) */}
{[
  ['Authorization Notes', 'authorizationNotes'],
  ['Facility Claims Address', 'facilityAddress'],
  ['Provider Claims Address', 'providerAddress'],
].map(([label, name], index) => (
  <div className="col-12" key={index}>
    <label className="form-label">{label}</label>
    <textarea
      className="form-control"
      rows="2"
      name={name}
      value={formData[name]}
      onChange={handleChange}
    ></textarea>
  </div>
))}

{/* Inputs for Payer IDs (side-by-side) */}
<div className="row g-3">
  {[
    ['Payer ID (IPA)', 'ipaPayerId'],
    ['Payer ID (Payer)', 'payerId'],
  ].map(([label, name], index) => (
    <div className="col-md-6" key={index}>
      <label className="form-label">{label}</label>
      <input
        type="text"
        className="form-control"
        name={name}
        maxLength={5}
        value={formData[name]}
        onChange={handleChange}
      />
    </div>
  ))}
</div>

          {/* Portal Links */}
          <div className="col-12">
            <h5 className="text-center my-3 btn-blue">Portal / Website Links</h5>
            {formData.portalLinks.map((link, idx) => (
              <div key={idx} className="d-flex mb-2 align-items-center gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Title"
                  value={link.title}
                  onChange={e => handlePortalLinkChange(idx, 'title', e.target.value)}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="URL"
                  value={link.url}
                  onChange={e => handlePortalLinkChange(idx, 'url', e.target.value)}
                />
                <button type="button" className="btn btn-danger btn-sm" onClick={() => removePortalLink(idx)}>✖</button>
              </div>
            ))}
            <button className="btn btn-primary btn-sm mt-2" onClick={addPortalLink}>
              + Add Portal Link
            </button>
          </div>

          {/* Phone Numbers */}
          <div className="col-12">
            <h5 className="text-center my-3 btn-blue">Phone Numbers</h5>
            {formData.phoneNumbers.map((phone, idx) => (
              <div key={idx} className="d-flex mb-2 align-items-center gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Title"
                  value={phone.title}
                  onChange={e => handlePhoneNumberChange(idx, 'title', e.target.value)}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Phone Number"
                  value={phone.number}
                  onChange={e => handlePhoneNumberChange(idx, 'number', e.target.value)}
                />
                <button type="button" className="btn btn-danger btn-sm" onClick={() => removePhoneNumber(idx)}>✖</button>
              </div>
            ))}
            <button className="btn btn-primary btn-sm mt-2" onClick={addPhoneNumber}>
              + Add Phone Number
            </button>
          </div>

          {/* Image Uploads */}
          <div className="col-md-6">
            <label className="form-label">Insurance Card (Front)</label>
            <ImageUploader
              onUpload={fileOrNull => fileOrNull ? handleImageUpload(fileOrNull, false) : setFormData(prev => ({ ...prev, image: '', imagePublicId: '' }))}
              existingImage={formData.image}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Insurance Card (Back)</label>
            <ImageUploader
              onUpload={fileOrNull => fileOrNull ? handleImageUpload(fileOrNull, true) : setFormData(prev => ({ ...prev, secondaryImage: '', secondaryImagePublicId: '' }))}
              existingImage={formData.secondaryImage}
            />
          </div>
        </div>

        {/* Save / Reset */}
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
