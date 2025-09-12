import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import AutocompleteInput from '../features/components/AutocompleteInput'

const API = import.meta.env.VITE_API_URL; // e.g. http://localhost:5555

const STATUSES = ['Contracted','Not Contracted','Out of Network','Termed','Pending'];
const FINANCIAL_CLASSES = ['Commercial','Medi-Cal','Medicare','Other'];

const DEFAULT_POLICIES = [
  { label: 'Scheduled Elective Services', status: 'By Auth Only', notes: 'okay with auth' },
  { label: 'Walk-in Lab',                 status: 'Restricted',   notes: 'Use Labcorp unless auth; with auth OK' },
  { label: 'ED',                          status: 'Allowed',      notes: 'emergency services okay' },
];

export default function ContractProfilesAdmin() {
  const { enqueueSnackbar } = useSnackbar();

  // Table
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form
  const [editingId, setEditingId] = useState(null);
  const [facilityName, setFacilityName] = useState('');
  const [payerName, setPayerName] = useState('');
  const [planCodeName, setPlanCodeName] = useState('');
  const [financialClass, setFinancialClass] = useState('Commercial'); // NEW
  const [payerStatus, setPayerStatus] = useState('Contracted');
  const [payerNotes, setPayerNotes] = useState('');
  const [planStatus, setPlanStatus] = useState('Not Contracted');
  const [planNotes, setPlanNotes] = useState('');
  const [policies, setPolicies] = useState(DEFAULT_POLICIES);

  // Duplicate detection (exact)
  const [duplicate, setDuplicate] = useState(null);

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/hub/contract-profiles`, { params: { populate: 1 } });
      setList(data);
    } catch (e) {
      enqueueSnackbar('Failed to load contract profiles', { variant: 'error' });
      console.error(e);
    } finally { setLoading(false); }
  }, [enqueueSnackbar]);

  useEffect(() => { fetchProfiles(); }, [fetchProfiles]);

  // Auto duplicate check (exact keys)
  useEffect(() => {
    const canCheck = facilityName.trim() && payerName.trim();
    if (!canCheck) { setDuplicate(null); return; }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const { data } = await axios.get(`${API}/hub/contract-profiles/by-names`, {
          params: {
            facilityName, payerName,
            planCodeName: planCodeName || undefined,
            financialClass
          },
          signal: ctrl.signal
        });
        setDuplicate(data && (!editingId || data._id !== editingId) ? data : null);
      } catch { /* ignore */ }
    }, 350);
    return () => { ctrl.abort(); clearTimeout(t); };
  }, [facilityName, payerName, planCodeName, financialClass, editingId]);

  // Helpers
  const addPolicyRow = () => setPolicies(p => [...p, { label: '', status: 'Allowed', notes: '' }]);
  const removePolicyRow = (idx) => setPolicies(p => p.filter((_, i) => i !== idx));
  const updatePolicy = (idx, key, val) =>
    setPolicies(p => p.map((row, i) => i === idx ? { ...row, [key]: val } : row));

  const beginEdit = (p) => {
    setEditingId(p._id);
    setFacilityName(p.facilityName || '');
    setPayerName(p.payerName || '');
    setPlanCodeName(p.planCodeName || '');
    setFinancialClass(p.financialClass || 'Commercial');
    setPayerStatus(p.payerStatus || 'Contracted');
    setPayerNotes(p.payerNotes || '');
    setPlanStatus(p.planStatus || 'Not Contracted');
    setPlanNotes(p.planNotes || '');
    setPolicies(p.servicePolicies?.length ? p.servicePolicies : DEFAULT_POLICIES);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFacilityName('');
    setPayerName('');
    setPlanCodeName('');
    setFinancialClass('Commercial');
    setPayerStatus('Contracted');
    setPayerNotes('');
    setPlanStatus('Not Contracted');
    setPlanNotes('');
    setPolicies(DEFAULT_POLICIES);
    setDuplicate(null);
  };

  // Similar-name alert (soft stop)
  const confirmPotentialDuplicate = async () => {
    if (editingId) return true; // editing existing
    // pull payer suggestions and look for close names
    const q = payerName.trim();
    if (!q) return true;
    try {
      const { data } = await axios.get(`${API}/hub/contract-profiles/lookups/payers`, { params: { q } });
      const candidates = (data || []).map(d => d.name).filter(n => n && n.toLowerCase() !== q.toLowerCase());
      if (!candidates.length && !duplicate) return true;

      const msg = duplicate
        ? `An exact profile already exists for these keys. Saving will UPDATE that record.\nProceed?`
        : `Potential duplicate payer name found:\n- ${candidates.slice(0,3).join('\n- ')}\n\nProceed anyway?`;

      return window.confirm(msg);
    } catch {
      return true;
    }
  };

  const saveProfile = async () => {
    try {
      if (!facilityName.trim() || !payerName.trim()) {
        enqueueSnackbar('Facility and Payer are required', { variant: 'warning' });
        return;
      }
      const proceed = await confirmPotentialDuplicate();
      if (!proceed) return;

      const body = {
        financialClass,
        payerStatus, payerNotes, planStatus, planNotes,
        servicePolicies: policies.filter(p => p.label?.trim()),
      };

      if (editingId) {
        await axios.put(`${API}/hub/contract-profiles/${editingId}`, body);
        enqueueSnackbar('Profile updated', { variant: 'success' });
      } else {
        await axios.post(`${API}/hub/contract-profiles/by-names`, {
          facilityName, payerName,
          planCodeName: planCodeName || undefined,
          ...body
        });
        enqueueSnackbar('Profile created', { variant: 'success' });
      }
      cancelEdit();
      fetchProfiles();
    } catch (e) {
      enqueueSnackbar(e.response?.data?.message || 'Save failed', { variant: 'error' });
      console.error(e);
    }
  };

  const deleteProfile = async (id) => {
    if (!confirm('Delete this contract profile?')) return;
    try {
      await axios.delete(`${API}/hub/contract-profiles/${id}`);
      enqueueSnackbar('Profile deleted', { variant: 'info' });
      if (editingId === id) cancelEdit();
      fetchProfiles();
    } catch (e) {
      enqueueSnackbar('Delete failed', { variant: 'error' });
      console.error(e);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-3">Contract Profiles (Admin)</h2>

      {/* Warning (non-blocking) */}
      {duplicate && !editingId && (
        <div className="alert alert-warning">
          An exact profile already exists for this Facility / Payer{planCodeName ? ' / Plan' : ''} / {financialClass}. Saving will UPDATE it.
        </div>
      )}

      {/* Form */}
      <div className="card p-3 mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <AutocompleteInput
              label="Facility *"
              value={facilityName}
              onChange={setFacilityName}
              fetchUrl={`${API}/hub/contract-profiles/lookups/facilities`}
              disabled={!!editingId}
              placeholder="Saint Agnes Medical Center"
            />
          </div>
          <div className="col-md-4">
            <AutocompleteInput
              label="Payer *"
              value={payerName}
              onChange={setPayerName}
              fetchUrl={`${API}/hub/contract-profiles/lookups/payers`}
              disabled={!!editingId}
              placeholder="HealthNet"
            />
          </div>
          <div className="col-md-4">
            <AutocompleteInput
              label="Plan/IPA (optional)"
              value={planCodeName}
              onChange={setPlanCodeName}
              fetchUrl={`${API}/hub/contract-profiles/lookups/plancodes`}
              disabled={!!editingId}
              placeholder="IPA La Salle"
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Financial Class</label>
            <select className="form-select" value={financialClass} onChange={e=>setFinancialClass(e.target.value)} disabled={!!editingId}>
              {FINANCIAL_CLASSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Payer Status</label>
            <select className="form-select" value={payerStatus} onChange={e=>setPayerStatus(e.target.value)}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Payer Notes</label>
            <input className="form-control" value={payerNotes} onChange={e=>setPayerNotes(e.target.value)} placeholder="expires 2026-09-01" />
          </div>
          <div className="col-md-3">
            <label className="form-label">Plan/IPA Status</label>
            <select className="form-select" value={planStatus} onChange={e=>setPlanStatus(e.target.value)}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="col-md-12">
            <label className="form-label">Plan/IPA Notes</label>
            <input className="form-control" value={planNotes} onChange={e=>setPlanNotes(e.target.value)} placeholder="n/a" />
          </div>

          <div className="col-12">
            <label className="form-label">Service Policies</label>
            <div className="table-responsive">
              <table className="table table-sm align-middle">
                <thead><tr><th>Label</th><th>Status</th><th>Notes</th><th /></tr></thead>
                <tbody>
                  {policies.map((p, i) => (
                    <tr key={i}>
                      <td><input className="form-control" value={p.label} onChange={e=>updatePolicy(i,'label',e.target.value)} placeholder="Walk-in Lab" /></td>
                      <td>
                        <select className="form-select" value={p.status} onChange={e=>updatePolicy(i,'status',e.target.value)}>
                          {['Allowed','By Auth Only','Restricted','Prohibited','N/A'].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td><input className="form-control" value={p.notes} onChange={e=>updatePolicy(i,'notes',e.target.value)} placeholder="Use Labcorp unless auth" /></td>
                      <td><button className="btn btn-outline-danger btn-sm" onClick={()=>removePolicyRow(i)}>Remove</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="btn btn-outline-secondary btn-sm" onClick={addPolicyRow}>+ Add Row</button>
          </div>

          <div className="col-12 d-flex gap-2">
            <button className="btn btn-primary" onClick={saveProfile}>
              {editingId ? 'Update Contract Profile' : 'Save Contract Profile'}
            </button>
            {editingId && (
              <button className="btn btn-outline-secondary" onClick={cancelEdit}>Cancel</button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <h5>Existing Profiles</h5>
      {loading ? <p>Loading…</p> : (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Facility</th><th>Payer</th><th>Plan/IPA</th><th>Financial Class</th>
                <th>Payer Status</th><th>Plan Status</th><th>Policies</th><th />
              </tr>
            </thead>
            <tbody>
              {list.map(p => (
                <tr key={p._id}>
                  <td>{p.facilityName}</td>
                  <td>{p.payerName}</td>
                  <td>{p.planCodeName || <em>ALL</em>}</td>
                  <td>{p.financialClass || 'Commercial'}</td>
                  <td>{p.payerStatus}{p.payerNotes ? ` – ${p.payerNotes}` : ''}</td>
                  <td>{p.planStatus}{p.planNotes ? ` – ${p.planNotes}` : ''}</td>
                  <td>
                    <ul className="mb-0">
                      {(p.servicePolicies || []).map((sp, i) => (
                        <li key={i}><strong>{sp.label}:</strong> {sp.status}{sp.notes ? ` – ${sp.notes}` : ''}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="text-nowrap">
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => beginEdit(p)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => deleteProfile(p._id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {!list.length && <tr><td colSpan={8}><em>No profiles yet.</em></td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
