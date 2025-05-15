import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import API from '../axios';
import { useSnackbar } from 'notistack';

const facilities = [
  'Saint Agnes Medical Center',
  'Saint Alphonsus Health System'
];

const EditUserByAdminModal = ({ user, onClose, onSave }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',   // Replaced username with firstName
    lastName: user.lastName || '',     // Added lastName
    email: user.email || '',
    phoneNumber: user.phoneNumber || '',
    department: user.department || '',
    npi: user.npi || '',
    facilityAccess: user.facilityAccess || [],
    requestedFacility: user.requestedFacility || []  // Keep requestedFacility as an array, read-only
  });
  const [loading, setLoading] = useState(false);

  const isValidNPI = (npi) => /^\d{10}$/.test(npi);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    if (name === 'facilityAccess') {
      // Handle multiple facility selections for approved facilities
      const updatedFacilities = checked
        ? [...formData.facilityAccess, value]  // Add facility to the array if checked
        : formData.facilityAccess.filter((facility) => facility !== value); // Remove if unchecked

      setFormData((prev) => ({
        ...prev,
        facilityAccess: updatedFacilities
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidNPI(formData.npi)) {
      enqueueSnackbar('Invalid NPI. Must be a valid 10-digit number.', { variant: 'error' });
      return;
    }

    try {
      setLoading(true);
      await API.put(`/users/${user._id}`, formData);  // Send both requested and approved facilities to backend
      enqueueSnackbar('User updated successfully.', { variant: 'success' });
      onSave();  // Refresh the user list after saving
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
          <Modal.Title>Edit User (Admin)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* First Name Field */}
          <Form.Group className="mb-3">
            <Form.Label>First Name</Form.Label>
            <Form.Control name="firstName" value={formData.firstName} onChange={handleChange} required />
          </Form.Group>

          {/* Last Name Field */}
          <Form.Group className="mb-3">
            <Form.Label>Last Name</Form.Label>
            <Form.Control name="lastName" value={formData.lastName} onChange={handleChange} required />
          </Form.Group>

          {/* Email Field */}
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control name="email" type="email" value={formData.email} onChange={handleChange} required />
          </Form.Group>

          {/* Phone Number Field */}
          <Form.Group className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
          </Form.Group>

          {/* Requested Facilities - Read-Only */}
          <Form.Group className="mb-3">
            <Form.Label>Requested Facilities (Read-Only)</Form.Label>
            <div>
              {formData.requestedFacility.map((facility) => (
                <div key={facility} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked
                    disabled
                    value={facility}
                  />
                  <label className="form-check-label">{facility}</label>
                </div>
              ))}
            </div>
          </Form.Group>

          {/* Approved Facilities - Editable */}
          <Form.Group className="mb-3">
            <Form.Label>Approved Facilities</Form.Label>
            <div>
              {facilities.map((facility) => (
                <div key={facility} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="facilityAccess"
                    value={facility}
                    checked={formData.facilityAccess.includes(facility)} // Check if the facility is approved
                    onChange={handleChange}
                  />
                  <label className="form-check-label">{facility}</label>
                </div>
              ))}
            </div>
          </Form.Group>

          {/* Department Field */}
          <Form.Group className="mb-3">
            <Form.Label>Department</Form.Label>
            <Form.Control name="department" value={formData.department} onChange={handleChange} />
          </Form.Group>

          {/* NPI Field */}
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

export default EditUserByAdminModal;
