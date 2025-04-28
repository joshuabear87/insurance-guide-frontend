import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import API from '../axios';
import axios from 'axios';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import ImageUploader from '../components/ImageUploader';

const CreateInsurancePlan = () => {
  const [formData, setFormData] = useState({
    financialClass: '',
    descriptiveName: '',
    payerName: '',
    payerCode: '',
    planName: '',
    planCode: '',
    prefix: '',
    notes: '',
    samcContracted: '',
    samfContracted: '',
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'ipaPayerId' || name === 'payerId') {
      setFormData({ ...formData, [name]: value.toUpperCase() }); 
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

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

  const handleSaveBook = async () => {
    const data = {
      ...formData,
      payerCode: Number(formData.payerCode),
      planCode: Number(formData.planCode),
      portalLinks: formData.portalLinks.filter(link => link.title && link.url),
      phoneNumbers: formData.phoneNumbers.filter(phone => phone.title && phone.number),
    };

    setLoading(true);
    try {
      await API.post('/books', data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });
      enqueueSnackbar('Insurance plan created successfully!', { variant: 'success' });
      navigate('/');
    } catch (error) {
      enqueueSnackbar('Error creating insurance plan!', { variant: 'error' });
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
      prefix: '',
      notes: '',
      samcContracted: '',
      samfContracted: '',
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
      {loading && <Spinner />}
      <div className="d-flex justify-content-center">
        <div className="card border-0 w-75 shadow-sm rounded-4 p-4">
          <h1 className="text-center mb-4 text-blue">Create Insurance Plan</h1>
          <hr className="divider" />

          {/* Section 1 - Basic Payer and Coding Information */}
          <h5 className="text-center my-4 text-blue">Basic Payer and Coding Information</h5>

          <div className="row g-3">
            {/* Financial Class, Payer info */}
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
                    {options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input type="text" className="form-control" name={name} value={formData[name]} onChange={handleChange} />
                )}
              </div>
            ))}

            {/* Prefix and Notes */}
            {[
              ['Prefixes', 'prefix'],
              ['Eligibility and Coding Notes', 'notes'],
            ].map(([label, name], index) => (
              <div className="col-12" key={index}>
                <label className="form-label">{label}</label>
                <textarea className="form-control" rows="2" name={name} value={formData[name]} onChange={handleChange}></textarea>
              </div>
            ))}

            {/* SAMC / SAMF Contracted */}
            {[
              ['SAMC Contracted', 'samcContracted', 'select', ['Contracted', 'Not Contracted', 'Must call to confirm']],
              ['SAMF Contracted', 'samfContracted', 'select', ['Contracted', 'Not Contracted', 'Must call to confirm']],
            ].map(([label, name, type, options], index) => (
              <div className="col-md-6" key={index}>
                <label className="form-label">{label}</label>
                <select className="form-select" name={name} value={formData[name]} onChange={handleChange}>
                  <option value="">Select</option>
                  {options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            ))}

            {/* Section 2 - Claims, Contact, and Authorization Information */}
            <div className="col-12">
              <h5 className="text-center my-4 text-blue">Claims, Contact, and Authorization Information</h5>
            </div>

            {[
              ['Authorization Notes', 'authorizationNotes'],
              ['Facility Address', 'facilityAddress'],
              ['Provider Address', 'providerAddress'],
            ].map(([label, name], index) => (
              <div className="col-12" key={index}>
                <label className="form-label">{label}</label>
                <textarea className="form-control" rows="2" name={name} value={formData[name]} onChange={handleChange}></textarea>
              </div>
            ))}

            {/* Payer IDs */}
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

            {/* Portal Links */}
            <div className="col-12">
              <h5 className="text-center my-4 text-blue">Portal / Website Links</h5>
              {formData.portalLinks.map((link, index) => (
                <div key={index} className="d-flex mb-2 align-items-center gap-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Title"
                    value={link.title}
                    onChange={(e) => handlePortalLinkChange(index, 'title', e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="URL"
                    value={link.url}
                    onChange={(e) => handlePortalLinkChange(index, 'url', e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => removePortalLink(index)}
                  >
                    ✖
                  </button>
                </div>
              ))}
              <button type="button" className="btn btn-login btn-sm mt-2" onClick={addPortalLink}>
                + Add Portal Link
              </button>
            </div>

            {/* Phone Numbers */}
            <div className="col-12">
              <h5 className="text-center my-4 text-blue">Phone Numbers</h5>
              {formData.phoneNumbers.map((phone, index) => (
                <div key={index} className="d-flex mb-2 align-items-center gap-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Title"
                    value={phone.title}
                    onChange={(e) => handlePhoneNumberChange(index, 'title', e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Phone Number"
                    value={phone.number}
                    onChange={(e) => handlePhoneNumberChange(index, 'number', e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => removePhoneNumber(index)}
                  >
                    ✖
                  </button>
                </div>
              ))}
              <button type="button" className="btn btn-login btn-sm mt-2" onClick={addPhoneNumber}>
                + Add Phone Number
              </button>
            </div>

            {/* Image Uploads */}
            <div className="col-md-6 mt-4">
              <label className="form-label">Insurance Card (Front)</label>
              <ImageUploader
                onUpload={(fileOrNull) =>
                  fileOrNull
                    ? handleImageUpload(fileOrNull, false)
                    : setFormData(prev => ({ ...prev, image: '', imagePublicId: '' }))
                }
                existingImage={formData.image}
              />
            </div>

            <div className="col-md-6 mt-4">
              <label className="form-label">Insurance Card (Back)</label>
              <ImageUploader
                onUpload={(fileOrNull) =>
                  fileOrNull
                    ? handleImageUpload(fileOrNull, true)
                    : setFormData(prev => ({ ...prev, secondaryImage: '', secondaryImagePublicId: '' }))
                }
                existingImage={formData.secondaryImage}
              />
            </div>
          </div>

          <hr className="divider my-5" />
          <div className="d-flex justify-content-between">
            <button className="btn btn-cancel" type="button" onClick={handleReset}>
              Reset
            </button>
            <button className="btn btn-login" type="button" onClick={handleSaveBook}>
              Save
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CreateInsurancePlan;
