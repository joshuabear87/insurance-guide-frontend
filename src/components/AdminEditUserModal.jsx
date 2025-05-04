// ✅ AdminEditUserModal.jsx
import React, { useEffect, useState } from 'react';
import API from '../axios';
import Spinner from './Spinner';

const AdminEditUserModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    facilityName: '',
    phoneNumber: '',
    department: '',
    npi: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        facilityName: user.facilityName || '',
        phoneNumber: user.phoneNumber || '',
        department: user.department || '',
        npi: user.npi || '',
        password: '', // password is optional and blank by default
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.put(`/users/${user._id}`, formData);
      onSave();
      onClose();
    } catch (err) {
      console.error('Failed to update user:', err);
      alert('Failed to update user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }} onClick={onClose}>
      <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content p-4">
          <h4 className="mb-3">Edit User: {user.username}</h4>

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Name</label>
                <input type="text" name="username" value={formData.username} onChange={handleChange} className="form-control" required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Facility Name</label>
                <input type="text" name="facilityName" value={formData.facilityName} onChange={handleChange} className="form-control" required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Phone Number</label>
                <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="form-control" required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Department</label>
                <input type="text" name="department" value={formData.department} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">NPI</label>
                <input type="text" name="npi" value={formData.npi} onChange={handleChange} className="form-control" required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">New Password (optional)</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} className="form-control" />
              </div>
            </div>

            <div className="d-flex justify-content-end">
              <button type="button" className="btn btn-secondary me-2" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <Spinner size="sm" /> : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminEditUserModal;
