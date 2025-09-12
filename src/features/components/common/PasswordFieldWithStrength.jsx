import React, { useState } from 'react';
import PropTypes from 'prop-types';
import 'bootstrap-icons/font/bootstrap-icons.css';

const getPasswordStrength = (password) => {
  const strong = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
  const medium = /^.{6,}$/;

  if (strong.test(password)) return { level: 'Strong', value: 100, color: '#007b9e' };
  if (medium.test(password)) return { level: 'Medium', value: 60, color: '#ffc107' };
  return { level: 'Weak', value: 30, color: '#dc3545' };
};

const getPasswordChecklist = (password) => ({
  length: password.length >= 8,
  letter: /[A-Za-z]/.test(password),
  number: /\d/.test(password),
  special: /[@$!%*?&]/.test(password),
});

const PasswordFieldWithStrength = ({ value, onChange, name = 'password', label = 'Password', required = true }) => {
  const [strength, setStrength] = useState(getPasswordStrength(value || ''));
  const [checklist, setChecklist] = useState(getPasswordChecklist(value || ''));

  const handleInput = (e) => {
    const val = e.target.value;
    onChange(e); // propagate to parent
    setStrength(getPasswordStrength(val));
    setChecklist(getPasswordChecklist(val));
  };

  return (
    <div className="mb-3">
      <label className="form-label fw-bold">{label}</label>
      <input
        type="password"
        className="form-control"
        name={name}
        value={value}
        onChange={handleInput}
        required={required}
      />

      <div className="mt-2">
        <div className="progress" style={{ height: '6px' }}>
          <div
            className="progress-bar"
            role="progressbar"
            style={{
              width: `${strength.value}%`,
              backgroundColor: strength.color,
              transition: 'width 0.5s ease-in-out, background-color 0.5s ease-in-out',
            }}
            aria-valuenow={strength.value}
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>
        <small className="text-muted d-block mt-1">Strength: {strength.level}</small>

        <ul className="list-unstyled small mt-2">
          <li className={checklist.length ? 'text-success' : 'text-muted'}>
            <i className={`me-1 bi ${checklist.length ? 'bi-check-circle-fill' : 'bi-circle'}`}></i>
            At least 8 characters
          </li>
          <li className={checklist.letter ? 'text-success' : 'text-muted'}>
            <i className={`me-1 bi ${checklist.letter ? 'bi-check-circle-fill' : 'bi-circle'}`}></i>
            Contains a letter
          </li>
          <li className={checklist.number ? 'text-success' : 'text-muted'}>
            <i className={`me-1 bi ${checklist.number ? 'bi-check-circle-fill' : 'bi-circle'}`}></i>
            Contains a number
          </li>
          <li className={checklist.special ? 'text-success' : 'text-muted'}>
            <i className={`me-1 bi ${checklist.special ? 'bi-check-circle-fill' : 'bi-circle'}`}></i>
            Contains a special character
          </li>
        </ul>
      </div>
    </div>
  );
};

PasswordFieldWithStrength.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
};

export default PasswordFieldWithStrength;
