// ✅ src/components/EditMyInfoModal.jsx (admin-editable version)
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import API from '../axios';
import { useSnackbar } from 'notistack';

const EditMyInfoModal = ({ user, onClose, onSave }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    username: user.username || '',
    email: user.email || '',
    phoneNumber: user.phoneNumber || '',
    facilityName: user.facilityName || '',
    department: user.department || '',
    npi: user.npi || '',
  });
  const [loading, setLoading] = useState(false);

  const isValidNPI = (npi) => /^\d{10}$/.test(npi);  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidNPI(formData.npi)) {
      enqueueSnackbar('Invalid NPI. Must be a valid 10-digit number.', { variant: 'error' });
      return;
    }

    try {
      setLoading(true);
      await API.put(`/users/${user._id}`, formData);
      enqueueSnackbar('User updated successfully.', { variant: 'success' });
      onSave();
    } catch (err) {
      console.error(err);
      enqueueSnackbar(err.response?.data?.message || 'Update failed', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show onHide={onClose} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control name="username" value={formData.username} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control name="email" type="email" value={formData.email} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Facility</Form.Label>
            <Form.Control name="facilityName" value={formData.facilityName} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Department</Form.Label>
            <Form.Control name="department" value={formData.department} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>NPI</Form.Label>
            <Form.Control name="npi" value={formData.npi} onChange={handleChange} required />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditMyInfoModal;