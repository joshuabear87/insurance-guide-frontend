import React from 'react';

const PlanPortalLinks = ({ formData, setFormData }) => {
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

  return (
    <div className="col-12">
      <h5 className="text-center my-4">Portal / Website Links</h5>

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

      <button type="button" className="btn btn-primary btn-sm mt-2" onClick={addPortalLink}>
        + Add Portal Link
      </button>
    </div>
  );
};

export default PlanPortalLinks;
