import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const API = import.meta.env.VITE_API_URL;
const NETWORK_STATUSES = ['In Network', 'Out of Network'];

export default function CreatePlanPolicyModal({ show, onClose }) {
  const { enqueueSnackbar } = useSnackbar();

  const [planName, setPlanName] = useState('');
  const [facilityName, setFacilityName] = useState('');
  const [networkStatus, setNetworkStatus] = useState(NETWORK_STATUSES[0]);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const [phones, setPhones] = useState([]);
  const [portals, setPortals] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [slps, setSlps] = useState([]);

  useEffect(() => {
    if (!show) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [show]);

  const addPhone = () => setPhones(p => [...p, { label: 'General', number: '', notes: '' }]);
  const removePhone = (i) => setPhones(p => p.filter((_, idx) => idx !== i));
  const changePhone = (i,k,v) => setPhones(p => p.map((x,idx)=> idx===i?{...x,[k]:v}:x));

  const addPortal = () => setPortals(p => [...p, { label: '', url: '', notes: '' }]);
  const removePortal = (i) => setPortals(p => p.filter((_, idx) => idx !== i));
  const changePortal = (i,k,v) => setPortals(p => p.map((x,idx)=> idx===i?{...x,[k]:v}:x));

  const addAddress = () => setAddresses(a => [...a, { label:'Mailing', line1:'', line2:'', city:'', state:'', zip:'', notes:'' }]);
  const removeAddress = (i) => setAddresses(a => a.filter((_, idx) => idx !== i));
  const changeAddress = (i,k,v) => setAddresses(a => a.map((x,idx)=> idx===i?{...x,[k]:v}:x));

  const addSlp = () => setSlps(s => [...s, { locationName:'', decision:'Accept', notes:'' }]);
  const removeSlp = (i) => setSlps(s => s.filter((_, idx) => idx !== i));
  const changeSlp = (i,k,v) => setSlps(s => s.map((x,idx)=> idx===i?{...x,[k]:v}:x));

  const canSave = planName.trim() && facilityName.trim();

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      await axios.post(`${API}/hub/plan-policies`, {
        planName: planName.trim(),
        facilityName: facilityName.trim(),
        networkStatus,
        notes,
        phones, portals, addresses,
        serviceLocationPolicies: slps,
      });
      enqueueSnackbar('Plan policy created', { variant: 'success' });
      onClose?.(true);
    } catch (e) {
      enqueueSnackbar(e?.response?.data?.message || 'Create failed', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (!show) return null;

  return ReactDOM.createPortal(
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
         style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:10000,
                  display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <div className="card shadow-lg" style={{ width:'min(1100px,96vw)', maxHeight:'92vh', overflow:'hidden' }}>
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Create Plan Policy</h5>
          <button className="btn btn-sm btn-outline-secondary" onClick={() => onClose?.(false)}>Close</button>
        </div>

        <div className="card-body" style={{ overflowY:'auto' }}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Plan Name *</label>
              <input className="form-control" value={planName} onChange={e=>setPlanName(e.target.value)} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Facility *</label>
              <input className="form-control" value={facilityName} onChange={e=>setFacilityName(e.target.value)} />
            </div>

            <div className="col-md-6">
              <label className="form-label">Network Status *</label>
              <select className="form-select" value={networkStatus} onChange={e=>setNetworkStatus(e.target.value)}>
                {NETWORK_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="col-12">
              <label className="form-label">Notes</label>
              <input className="form-control" value={notes} onChange={e=>setNotes(e.target.value)} />
            </div>
          </div>

          {/* Phones */}
          <hr className="my-4" />
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-2">Phone Numbers</h6>
            <button className="btn btn-sm btn-outline-success" onClick={addPhone}>Add Phone</button>
          </div>
          {!phones.length ? <p className="text-muted">No phone numbers added.</p> : (
            <div className="table-responsive">
              <table className="table table-sm align-middle">
                <thead><tr><th style={{width:'20%'}}>Label</th><th style={{width:'30%'}}>Number</th><th>Notes</th><th/></tr></thead>
                <tbody>
                  {phones.map((p, i) => (
                    <tr key={i}>
                      <td><input className="form-control" value={p.label} onChange={e=>changePhone(i,'label',e.target.value)} /></td>
                      <td><input className="form-control" value={p.number} onChange={e=>changePhone(i,'number',e.target.value)} /></td>
                      <td><input className="form-control" value={p.notes} onChange={e=>changePhone(i,'notes',e.target.value)} /></td>
                      <td className="text-end"><button className="btn btn-sm btn-outline-danger" onClick={()=>removePhone(i)}>Remove</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Portals */}
          <hr className="my-4" />
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-2">Portals</h6>
            <button className="btn btn-sm btn-outline-success" onClick={addPortal}>Add Portal</button>
          </div>
          {!portals.length ? <p className="text-muted">No portals added.</p> : (
            <div className="table-responsive">
              <table className="table table-sm align-middle">
                <thead><tr><th style={{width:'25%'}}>Label</th><th style={{width:'45%'}}>URL</th><th>Notes</th><th/></tr></thead>
                <tbody>
                  {portals.map((p, i) => (
                    <tr key={i}>
                      <td><input className="form-control" value={p.label} onChange={e=>changePortal(i,'label',e.target.value)} /></td>
                      <td><input className="form-control" value={p.url} onChange={e=>changePortal(i,'url',e.target.value)} /></td>
                      <td><input className="form-control" value={p.notes} onChange={e=>changePortal(i,'notes',e.target.value)} /></td>
                      <td className="text-end"><button className="btn btn-sm btn-outline-danger" onClick={()=>removePortal(i)}>Remove</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Addresses */}
          <hr className="my-4" />
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-2">Addresses</h6>
            <button className="btn btn-sm btn-outline-success" onClick={addAddress}>Add Address</button>
          </div>
          {!addresses.length ? <p className="text-muted">No addresses added.</p> : (
            <div className="table-responsive">
              <table className="table table-sm align-middle">
                <thead>
                  <tr>
                    <th style={{width:'12%'}}>Label</th>
                    <th style={{width:'20%'}}>Line 1</th>
                    <th style={{width:'15%'}}>Line 2</th>
                    <th style={{width:'12%'}}>City</th>
                    <th style={{width:'8%'}}>State</th>
                    <th style={{width:'12%'}}>ZIP</th>
                    <th>Notes</th>
                    <th/>
                  </tr>
                </thead>
                <tbody>
                  {addresses.map((a, i) => (
                    <tr key={i}>
                      <td><input className="form-control" value={a.label} onChange={e=>changeAddress(i,'label',e.target.value)} /></td>
                      <td><input className="form-control" value={a.line1} onChange={e=>changeAddress(i,'line1',e.target.value)} /></td>
                      <td><input className="form-control" value={a.line2} onChange={e=>changeAddress(i,'line2',e.target.value)} /></td>
                      <td><input className="form-control" value={a.city} onChange={e=>changeAddress(i,'city',e.target.value)} /></td>
                      <td><input className="form-control" value={a.state} onChange={e=>changeAddress(i,'state',e.target.value)} /></td>
                      <td><input className="form-control" value={a.zip} onChange={e=>changeAddress(i,'zip',e.target.value)} /></td>
                      <td><input className="form-control" value={a.notes} onChange={e=>changeAddress(i,'notes',e.target.value)} /></td>
                      <td className="text-end"><button className="btn btn-sm btn-outline-danger" onClick={()=>removeAddress(i)}>Remove</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Service Location Policies */}
          <hr className="my-4" />
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-2">Service Location Policies</h6>
            <button className="btn btn-sm btn-outline-success" onClick={addSlp}>Add Policy</button>
          </div>
          {!slps.length ? <p className="text-muted">No service location policies added.</p> : (
            <div className="table-responsive">
              <table className="table table-sm align-middle">
                <thead>
                  <tr>
                    <th style={{width:'40%'}}>Location</th>
                    <th style={{width:'20%'}}>Decision</th>
                    <th>Notes</th>
                    <th/>
                  </tr>
                </thead>
                <tbody>
                  {slps.map((s, i) => (
                    <tr key={i}>
                      <td><input className="form-control" value={s.locationName} onChange={e=>changeSlp(i,'locationName',e.target.value)} /></td>
                      <td>
                        <select className="form-select" value={s.decision} onChange={e=>changeSlp(i,'decision',e.target.value)}>
                          <option value="Accept">Accept</option>
                          <option value="Refer">Refer</option>
                        </select>
                      </td>
                      <td><input className="form-control" value={s.notes} onChange={e=>changeSlp(i,'notes',e.target.value)} /></td>
                      <td className="text-end"><button className="btn btn-sm btn-outline-danger" onClick={()=>removeSlp(i)}>Remove</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card-footer d-flex justify-content-end gap-2">
          <button className="btn btn-outline-secondary" onClick={() => onClose?.(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={!canSave || saving}>
            {saving ? 'Saving…' : 'Create'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
