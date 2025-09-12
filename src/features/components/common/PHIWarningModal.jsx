import React from 'react';

const PHIWarningModal = ({ onClose }) => {
  return (
    <div className="modal show d-block" tabIndex="-1" onClick={onClose}>
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header bg-blue text-white">
            <h5 className="modal-title">⚠️ Important Notice About PHI</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">
            <p className="mb-3">
              <strong>This application is not intended for storing or transmitting Protected Health Information (PHI).</strong>
            </p>
            <ul>
              <li>Please double-check that no PHI is entered when creating or editing insurance plan information.</li>
              <li>If you notice any PHI in the application, <strong>immediately report it to the administrator</strong>.</li>
              <li>This includes names, medical record numbers, or any patient identifiers.</li>
            </ul>
            <p className="mt-3">Thank you for helping maintain data security and HIPAA compliance.</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-primary" onClick={onClose}>
              I Understand
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PHIWarningModal;
