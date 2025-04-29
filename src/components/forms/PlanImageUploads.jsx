import React from 'react';
import ImageUploader from '../ImageUploader';

const PlanImageUploads = ({ formData, handleImageUpload, setFormData }) => {
  return (
    <div className="row g-3">
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
  );
};

export default PlanImageUploads;
