import React, { useState } from 'react';
import API from '../axios';

const EditMyInfoModal = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        username: user.username || '',
        facilityName: user.facilityName || '',
        phoneNumber: user.phoneNumber || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
            setErrorMsg('New passwords do not match.');
            setLoading(false);
            return;
        }

        if (!isPasswordValid(formData.newPassword)) {
            setErrorMsg('Password does not meet all requirements.');
            setLoading(false);
            return;
        }

        if (!formData.currentPassword) {
            setErrorMsg('Current password is required to change your password.');
            setLoading(false);
            return;
        }
    }

    const getPasswordStrength = (password) => {
        if (!password) return { score: 0, label: '' };

        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[@$!%*?&]/.test(password)) score++;

        const labels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
        return {
            score,
            label: labels[score - 1] || 'Very Weak',
        };
    };

    const getPasswordChecklist = (password) => [
        {
            label: 'At least 8 characters',
            valid: password.length >= 8,
        },
        {
            label: 'One uppercase letter',
            valid: /[A-Z]/.test(password),
        },
        {
            label: 'One lowercase letter',
            valid: /[a-z]/.test(password),
        },
        {
            label: 'One number',
            valid: /\d/.test(password),
        },
        {
            label: 'One special character (@$!%*?&)',
            valid: /[@$!%*?&]/.test(password),
        },
    ];

    const isPasswordValid = (password) => {
        const checklist = getPasswordChecklist(password);
        return checklist.every((item) => item.valid);
    };

    return (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <form onSubmit={handleSubmit}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Edit My Info</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

                            {/* Profile Fields */}
                            <div className="mb-3">
                                <label className="form-label">Username</label>
                                <input
                                    name="username"
                                    className="form-control"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Facility Name</label>
                                <input
                                    name="facilityName"
                                    className="form-control"
                                    value={formData.facilityName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Phone Number</label>
                                <input
                                    name="phoneNumber"
                                    className="form-control"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Password Fields */}
                            <hr />
                            <p className="fw-bold mb-2">Change Password (optional)</p>
                            <div className="mb-3">
                                <label className="form-label">Current Password</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    className="form-control"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    placeholder="Enter current password"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    className="form-control"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    placeholder="Enter new password"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    className="form-control"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    placeholder="Enter new password"
                                />
                                {formData.newPassword && (
                                    <div className="mt-1">
                                        <div className="progress" style={{ height: '6px' }}>
                                            <div
                                                className={`progress-bar ${getPasswordStrength(formData.newPassword).score < 3
                                                        ? 'bg-danger'
                                                        : getPasswordStrength(formData.newPassword).score < 5
                                                            ? 'bg-warning'
                                                            : 'bg-success'
                                                    }`}
                                                style={{ width: `${(getPasswordStrength(formData.newPassword).score / 5) * 100}%` }}
                                            ></div>
                                        </div>
                                        <small className="text-muted">
                                            Strength: {getPasswordStrength(formData.newPassword).label}
                                        </small>
                                        <ul className="list-unstyled mt-2 mb-0">
                                            {getPasswordChecklist(formData.newPassword).map((item, idx) => (
                                                <li key={idx} className={item.valid ? 'text-success' : 'text-danger'}>
                                                    {item.valid ? '✅' : '❌'} {item.label}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading || (formData.newPassword && !isPasswordValid(formData.newPassword))}
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditMyInfoModal;
