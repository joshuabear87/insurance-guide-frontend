// src/features/hub/components/EditPayerContractModal.jsx
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const API = import.meta.env.VITE_API_URL;

const FINANCIAL_CLASSES = ['Commercial', 'Medi-Cal', 'Medicare', 'Other'];
const STATUSES = ['Contracted', 'Not Contracted', 'Out of Network', 'Termed', 'Pending'];

export default function EditPayerContractModal({ show, contract, onClose }) {
  const { enqueueSnackbar } = useSnackbar();

  const [payerName, setPayerName] = useState('');
  const [facilityName, setFacilityName] = useState('');
  const [financialClass, setFinancialClass] = useState(FINANCIAL_CLASSES[0]);
  const [status, setStatus] = useState(STATUSES[0]);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // arrays
  const [phones, setPhones] = useState([]);
  const [portals, setPortals] = useState([]);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    if (!show) return;
    setPayerName(contract?.payerName || '');
    setFacilityName(contract?.facilityName || '');
    setFinancialClass(contract?.financialClass || FINANCIAL_CLASSES[0]);
    setStatus(contract?.status || STATUSES[0]);
    setNotes(contract?.notes || '');
    setPhones(Array.isArray(contract?.phones) ? contract.phones : []);
    setPortals(Array.isArray(contract?.portals) ? contract.portals : []);
    setAddresses(Array.isArray(contract?.addresses) ? contract.addresses : []);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [show, contract]);

  // phone helpers
  const addPhone = () => setPhones(prev => [...prev, { label: 'General', number: '', notes: '' }]);
  const removePhone = (idx) => setPhones(prev => prev.filter((_, i) => i !== idx));
  const changePhone = (idx, key, value) =>
    setPhones(prev => prev.map((p, i) => i === idx ? { ...p, [key]: value } : p));

  // portal helpers
  const addPortal = () => setPortals(prev => [...prev, { label: '', url: '', notes: '' }]);
  const removePortal = (idx) => setPortals(prev => prev.filter((_, i) => i !== idx));
  const changePortal = (idx, key, value) =>
    setPortals(prev => prev.map((p, i) => i === idx ? { ...p, [key]: value } : p));

  // address helpers
  const addAddress = () => setAddresses(prev => [...prev, { label: 'Mailing', line1: '', line2: '', city: '', state: '', zip: '', notes: '' }]);
  const removeAddress = (idx) => setAddresses(prev => prev.filter((_, i) => i !== idx));
  const changeAddress = (idx, key, value) =>
    setAddresses(prev => prev.map((a, i) => i === idx ? { ...a, [key]: value } : a));

  const canSave = payerName.trim() && facilityName.trim();

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      await axios.patch(`${API}/hub/payer-contracts/${contract._id}`, {
        payerName: payerName.trim(),
        facilityName: facilityName.trim(),
        financialClass,
        status,
        notes,
        phones,
        portals,
        addresses,
      });
      enqueueSnackbar('Saved', { variant: 'success' });
      onClose?.(true);
    } catch (e) {
      enqueueSnackbar(e?.response?.data?.message || 'Save failed', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this payer contract?')) return;
    setDeleting(true);
    try {
      await axios.delete(`${API}/hub/payer-contracts/${contract._id}`);
      enqueueSnackbar('Deleted', { variant: 'info' });
      onClose?.(true);
    } catch (e) {
      enqueueSnackbar(e?.response?.data?.message || 'Delete failed', { variant: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  if (!show) return null;

  return ReactDOM.createPortal(
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
         style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 10000,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div className="card shadow-lg" style={{ width: 'min(980px, 96vw)' }}>
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Edit / Manage Payer</h5>
          <button className="btn btn-sm btn-outline-secondary" onClick={() => onClose?.(false)}>Close</button>
        </div>

        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Payer Name *</label>
              <input className="form-control" value={payerName} onChange={(e)=>setPayerName(e.target.value)} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Facility *</label>
              <input className="form-control" value={facilityName} onChange={(e)=>setFacilityName(e.target.value)} />
            </div>

            <div className="col-md-4">
              <label className="form-label">Financial Class</label>
              <select className="form-select" value={financialClass} onChange={(e)=>setFinancialClass(e.target.value)}>
                {FINANCIAL_CLASSES.map(x => <option key={x} value={x}>{x}</option>)}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Status</label>
              <select className="form-select" value={status} onChange={(e)=>setStatus(e.target.value)}>
                {STATUSES.map(x => <option key={x} value={x}>{x}</option>)}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Notes</label>
              <input className="form-control" value={notes} onChange={(e)=>setNotes(e.target.value)} />
            </div>
          </div>

          {/* Phones */}
          <hr />
          <div className="d-flex align-items-center justify-content-between">
            <h6 className="mb-2">Phone Numbers</h6>
            <button className="btn btn-sm btn-outline-primary" onClick={addPhone}>Add Phone</button>
          </div>
          {!!phones.length && phones.map((p, idx) => (
            <div key={idx} className="row g-2 mb-2">
              <div className="col-3">
                <input className="form-control" placeholder="Label" value={p.label}
                       onChange={(e)=>changePhone(idx, 'label', e.target.value)} />
              </div>
              <div className="col-4">
                <input className="form-control" placeholder="Number" value={p.number}
                       onChange={(e)=>changePhone(idx, 'number', e.target.value)} />
              </div>
              <div className="col-4">
                <input className="form-control" placeholder="Notes" value={p.notes}
                       onChange={(e)=>changePhone(idx, 'notes', e.target.value)} />
              </div>
              <div className="col-1 d-flex justify-content-end">
                <button className="btn btn-outline-danger" onClick={()=>removePhone(idx)}>✕</button>
              </div>
            </div>
          ))}

          {/* Portals */}
          <hr />
          <div className="d-flex align-items-center justify-content-between">
            <h6 className="mb-2">Portals</h6>
            <button className="btn btn-sm btn-outline-primary" onClick={addPortal}>Add Portal</button>
          </div>
          {!!portals.length && portals.map((p, idx) => (
            <div key={idx} className="row g-2 mb-2">
              <div className="col-3">
                <input className="form-control" placeholder="Label" value={p.label}
                       onChange={(e)=>changePortal(idx, 'label', e.target.value)} />
              </div>
              <div className="col-6">
                <input className="form-control" placeholder="URL" value={p.url}
                       onChange={(e)=>changePortal(idx, 'url', e.target.value)} />
              </div>
              <div className="col-2">
                <input className="form-control" placeholder="Notes" value={p.notes}
                       onChange={(e)=>changePortal(idx, 'notes', e.target.value)} />
              </div>
              <div className="col-1 d-flex justify-content-end">
                <button className="btn btn-outline-danger" onClick={()=>removePortal(idx)}>✕</button>
              </div>
            </div>
          ))}

          {/* Addresses */}
          <hr />
          <div className="d-flex align-items-center justify-content-between">
            <h6 className="mb-2">Addresses</h6>
            <button className="btn btn-sm btn-outline-primary" onClick={addAddress}>Add Address</button>
          </div>
          {!!addresses.length && addresses.map((a, idx) => (
            <div key={idx} className="row g-2 mb-2">
              <div className="col-2">
                <input className="form-control" placeholder="Label" value={a.label}
                       onChange={(e)=>changeAddress(idx, 'label', e.target.value)} />
              </div>
              <div className="col-4">
                <input className="form-control" placeholder="Line 1" value={a.line1}
                       onChange={(e)=>changeAddress(idx, 'line1', e.target.value)} />
              </div>
              <div className="col-3">
                <input className="form-control" placeholder="Line 2" value={a.line2}
                       onChange={(e)=>changeAddress(idx, 'line2', e.target.value)} />
              </div>
              <div className="col-3">
                <input className="form-control" placeholder="City" value={a.city}
                       onChange={(e)=>changeAddress(idx, 'city', e.target.value)} />
              </div>
              <div className="col-2">
                <input className="form-control" placeholder="State" value={a.state}
                       onChange={(e)=>changeAddress(idx, 'state', e.target.value)} />
              </div>
              <div className="col-2">
                <input className="form-control" placeholder="ZIP" value={a.zip}
                       onChange={(e)=>changeAddress(idx, 'zip', e.target.value)} />
              </div>
              <div className="col-6">
                <input className="form-control" placeholder="Notes" value={a.notes}
                       onChange={(e)=>changeAddress(idx, 'notes', e.target.value)} />
              </div>
              <div className="col-2 d-flex justify-content-end">
                <button className="btn btn-outline-danger" onClick={()=>removeAddress(idx)}>✕</button>
              </div>
            </div>
          ))}
        </div>

        <div className="card-footer d-flex justify-content-between">
          <button className="btn btn-outline-danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary" onClick={() => onClose?.(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={!canSave || saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
