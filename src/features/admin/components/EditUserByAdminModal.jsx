import React, { useState, useContext } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import API from '../../../api/axios';
import { useSnackbar } from 'notistack';
import { FacilityContext } from '../../components/context/FacilityContext';

const EditUserByAdminModal = ({ user, onClose, onSave }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { facilities, facilityTheme } = useContext(FacilityContext);

  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phoneNumber: user.phoneNumber || '',
    department: user.department || '',
    npi: user.npi || '',
    facilityAccess: user.facilityAccess || [],
    requestedFacility: user.requestedFacility || []
  });

  const [loading, setLoading] = useState(false);

  const isValidNPI = (npi) => /^\d{10}$/.test(npi);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    if (name === 'facilityAccess') {
      const updated = checked
        ? [...formData.facilityAccess, value]
        : formData.facilityAccess.filter(f => f !== value);

      setFormData((prev) => ({
        ...prev,
        facilityAccess: updated
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
        <Modal.Header closeButton className="justify-content-center" style={{ backgroundColor: facilityTheme.primaryColor, color: '#fff' }}>
          <Modal.Title className='w-100 text-center'>Edit User (Admin)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control name="firstName" value={formData.firstName} onChange={handleChange} required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control name="lastName" value={formData.lastName} onChange={handleChange} required />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Requested Facilities (Read-Only)</Form.Label>
            <div className="border rounded p-2 bg-light">
              {formData.requestedFacility.length === 0 ? (
                <em className="text-muted">None</em>
              ) : (
                formData.requestedFacility.map((facility) => (
                  <div key={facility}><em>{facility}</em></div>
                ))
              )}
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Approved Facilities</Form.Label>
            <div className="border rounded p-2">
              {facilities.map(({ _id, name }) => (
                <div key={_id} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="facilityAccess"
                    value={name}
                    checked={formData.facilityAccess.includes(name)}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">{name}</label>
                </div>
              ))}
            </div>
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Department</Form.Label>
                <Form.Control name="department" value={formData.department} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>NPI</Form.Label>
                <Form.Control name="npi" value={formData.npi} onChange={handleChange} required />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            style={{ backgroundColor: facilityTheme.primaryColor, borderColor: facilityTheme.primaryColor }}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditUserByAdminModal;
