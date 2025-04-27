import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import API from '../axios';
import axios from 'axios';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import ImageUploader from '../components/ImageUploader';

const EditInsurancePlan = () => {
  const [financialClass, setFinancialClass] = useState('');
  const [descriptiveName, setDescriptiveName] = useState('');
  const [payerName, setPayerName] = useState('');
  const [payerCode, setPayerCode] = useState('');
  const [planName, setPlanName] = useState('');
  const [planCode, setPlanCode] = useState('');
  const [samcContracted, setSamcContracted] = useState(false);
  const [samfContracted, setSamfContracted] = useState(false);
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState('');
  const [secondaryImage, setSecondaryImage] = useState('');
  const [imagePublicId, setImagePublicId] = useState('');
  const [secondaryImagePublicId, setSecondaryImagePublicId] = useState('');
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/books/${id}`);
        const book = res.data;
        setFinancialClass(book.financialClass || '');
        setDescriptiveName(book.descriptiveName || '');
        setPayerName(book.payerName || '');
        setPayerCode(book.payerCode || '');
        setPlanName(book.planName || '');
        setPlanCode(book.planCode || '');
        setSamcContracted(book.samcContracted === 'Yes');
        setSamfContracted(book.samfContracted === 'Yes');
        setNotes(book.notes || '');
        setImage(book.image || '');
        setSecondaryImage(book.secondaryImage || '');
        setImagePublicId(book.imagePublicId || '');
        setSecondaryImagePublicId(book.secondaryImagePublicId || '');
      } catch (err) {
        enqueueSnackbar('Failed to load plan details!', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id, enqueueSnackbar]);

  const handleImageUpload = async (file, isSecondary) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'insurance-card');

    try {
      setLoading(true);
      const res = await axios.post('https://api.cloudinary.com/v1_1/dxrxo2wrs/image/upload', formData);
      if (isSecondary) {
        setSecondaryImage(res.data.secure_url);
        setSecondaryImagePublicId(res.data.public_id);
      } else {
        setImage(res.data.secure_url);
        setImagePublicId(res.data.public_id);
      }
      enqueueSnackbar('Image uploaded successfully!', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar('Image upload failed!', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFinancialClass('');
    setDescriptiveName('');
    setPayerName('');
    setPayerCode('');
    setPlanName('');
    setPlanCode('');
    setSamcContracted(false);
    setSamfContracted(false);
    setNotes('');
    setImage('');
    setSecondaryImage('');
    setImagePublicId('');
    setSecondaryImagePublicId('');
  };

  const handleEditBook = async () => {
    const data = {
      financialClass,
      descriptiveName,
      payerName,
      payerCode: Number(payerCode),
      planName,
      planCode: Number(planCode),
      samcContracted,
      samfContracted,
      notes,
      image,
      secondaryImage,
      imagePublicId,
      secondaryImagePublicId,
    };

    setLoading(true);
    try {
      await API.put(`/books/${id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      enqueueSnackbar('Insurance plan updated successfully!', { variant: 'success' });
      navigate('/');
    } catch (err) {
      enqueueSnackbar('Error updating insurance plan!', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-5 min-vh-100 bg-grey">
      <BackButton />
      {loading && <Spinner />}
      <div className="d-flex justify-content-center">
        <div className="card border-0 w-75 shadow-sm rounded-4 p-4">
          <h1 className="text-center mb-4 text-blue">Edit Insurance Plan</h1>
          <hr className="divider" />

          <div className="mb-3">
            <label className="form-label text-muted">Financial Class</label>
            <select className="form-select" value={financialClass} onChange={(e) => setFinancialClass(e.target.value)}>
              <option value="">Select a Financial Class</option>
              <option value="Commercial">Commercial</option>
              <option value="Medicare">Medicare</option>
              <option value="Medi-Cal">Medi-Cal</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label text-muted">Descriptive Name</label>
            <input type="text" className="form-control" value={descriptiveName} onChange={(e) => setDescriptiveName(e.target.value)} />
          </div>

          <div className="mb-3">
            <label className="form-label text-muted">Payer Code</label>
            <input type="text" className="form-control" value={payerCode} onChange={(e) => setPayerCode(e.target.value)} />
          </div>

          <div className="mb-3">
            <label className="form-label text-muted">Payer Name</label>
            <input type="text" className="form-control" value={payerName} onChange={(e) => setPayerName(e.target.value)} />
          </div>

          <div className="mb-3">
            <label className="form-label text-muted">Plan Code</label>
            <input type="text" className="form-control" value={planCode} onChange={(e) => setPlanCode(e.target.value)} />
          </div>

          <div className="mb-3">
            <label className="form-label text-muted">Plan Name</label>
            <input type="text" className="form-control" value={planName} onChange={(e) => setPlanName(e.target.value)} />
          </div>

          <div className="mb-3">
            <label className="form-label text-muted">SAMC Contracted</label>
            <select className="form-select" value={samcContracted ? 'Yes' : 'No'} onChange={(e) => setSamcContracted(e.target.value === 'Yes')}>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="Must call to confirm">Must call to confirm</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label text-muted">SAMF Contracted</label>
            <select className="form-select" value={samfContracted ? 'Yes' : 'No'} onChange={(e) => setSamfContracted(e.target.value === 'Yes')}>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="Must call to confirm">Must call to confirm</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label text-muted">Notes</label>
            <textarea className="form-control" value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label text-muted">Insurance Card (front)</label>
              <ImageUploader
                onUpload={(fileOrNull, isSecondary) => {
                  if (fileOrNull === null) {
                    setImage('');
                    setImagePublicId('');
                  } else {
                    handleImageUpload(fileOrNull, false);
                  }
                }}
                isSecondary={false}
                existingImage={image}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label text-muted">Insurance Card (back)</label>
              <ImageUploader
                onUpload={(fileOrNull, isSecondary) => {
                  if (fileOrNull === null) {
                    setSecondaryImage('');
                    setSecondaryImagePublicId('');
                  } else {
                    handleImageUpload(fileOrNull, true);
                  }
                }}
                isSecondary={true}
                existingImage={secondaryImage}
              />
            </div>
          </div>

          <hr className="divider mb-5" />

          <div className="d-flex justify-content-between">
            <button className="btn btn-secondary" type="button" onClick={handleReset}>
              Reset
            </button>
            <button className="btn btn-update" onClick={handleEditBook}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditInsurancePlan;
