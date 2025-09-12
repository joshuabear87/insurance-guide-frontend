// src/features/hub/pages/PlanPoliciesAdmin.jsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import CreatePlanPolicyModal from '../components/CreatePlanPolicyModal.jsx';
import EditPlanPolicyModal from '../components/EditPlanPolicyModal.jsx';

const API = import.meta.env.VITE_API_URL;

export default function PlanPoliciesAdmin() {
  const { enqueueSnackbar } = useSnackbar();

  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchPolicies = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/hub/plan-policies`, { params: { limit: 1000 } });
      const items = Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []);
      setPolicies(items);
    } catch {
      enqueueSnackbar('Failed to load plan policies', { variant: 'error' });
      setPolicies([]);
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => { fetchPolicies(); }, [fetchPolicies]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return policies;
    return policies.filter((r) => {
      const haystack = [
        r.planName,
        r.facilityName,
        r.networkStatus,
        r.notes,
        ...(r.phones || []).flatMap(p => [p.label, p.number, p.notes]),
        ...(r.portals || []).flatMap(p => [p.label, p.url, p.notes]),
        ...(r.addresses || []).flatMap(a => [a.label, a.line1, a.line2, a.city, a.state, a.zip, a.notes]),
        ...(r.serviceLocationPolicies || []).flatMap(s => [s.locationName, s.decision, s.notes]),
      ].map(x => (x || '').toLowerCase());
      return haystack.some(f => f.includes(q));
    });
  }, [policies, search]);

  const openEdit = (row) => { setEditing(row); setEditOpen(true); };
  const closeEdit = (changed = false) => { setEditOpen(false); setEditing(null); if (changed) fetchPolicies(); };
  const closeCreate = (created = false) => { setCreateOpen(false); if (created) { setSearch(''); fetchPolicies(); } };

  // Cell renderers (wrap nicely, links for portal URLs)
  const PhonesCell = ({ phones }) => {
    if (!phones?.length) return <span className="text-muted">—</span>;
    return (
      <ul className="mb-0 list-unstyled">
        {phones.map((p, i) => (
          <li key={p._id || i}>
            <strong>{p.label || 'General'}:</strong> {p.number}
            {p.notes ? <> — <em>{p.notes}</em></> : null}
          </li>
        ))}
      </ul>
    );
  };
  const PortalsCell = ({ portals }) => {
    if (!portals?.length) return <span className="text-muted">—</span>;
    return (
      <ul className="mb-0 list-unstyled">
        {portals.map((p, i) => (
          <li key={p._id || i}>
            <strong>{p.label}:</strong>{' '}
            {p.url ? <a href={p.url} target="_blank" rel="noreferrer">{p.url}</a> : '—'}
            {p.notes ? <> — <em>{p.notes}</em></> : null}
          </li>
        ))}
      </ul>
    );
  };
  const AddressesCell = ({ addresses }) => {
    if (!addresses?.length) return <span className="text-muted">—</span>;
    return (
      <ul className="mb-0 list-unstyled">
        {addresses.map((a, i) => (
          <li key={a._id || i}>
            <strong>{a.label || 'Mailing'}:</strong>{' '}
            {[a.line1, a.line2].filter(Boolean).join(', ')}
            {', '}
            {[a.city, a.state, a.zip].filter(Boolean).join(', ')}
            {a.notes ? <> — <em>{a.notes}</em></> : null}
          </li>
        ))}
      </ul>
    );
  };
  const SlpsCell = ({ slps }) => {
    if (!slps?.length) return <span className="text-muted">—</span>;
    return (
      <ul className="mb-0 list-unstyled">
        {slps.map((s, i) => (
          <li key={s._id || i}>
            <strong>{s.locationName}</strong> — {s.decision}
            {s.notes ? <> — <em>{s.notes}</em></> : null}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="mb-0">PLAN POLICY MANAGER</h2>
      </div>

      <div className="d-flex gap-2 align-items-start mb-3">
        <input
          className="form-control"
          placeholder="Search… (plan, facility, status, phones, portals, addresses, policies, notes)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-success" onClick={() => setCreateOpen(true)}>
          Create New Plan Policy
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="mb-0">All Plan Policies</h5>
            {loading && <span className="text-muted">Loading…</span>}
          </div>

          <div className="table-responsive">
            {/* Full width table, natural layout so values get space */}
            <table className="table table-striped align-middle w-100" style={{ tableLayout: 'auto' }}>
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Facility</th>
                  <th>Network Status</th>
                  <th>Phones</th>
                  <th>Portals</th>
                  <th>Addresses</th>
                  <th>Service Location Policies</th>
                  <th>Notes</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row._id}>
                    <td>{row.planName || '—'}</td>
                    <td>{row.facilityName || '—'}</td>
                    <td>{row.networkStatus || '—'}</td>
                    <td><PhonesCell phones={row.phones} /></td>
                    <td><PortalsCell portals={row.portals} /></td>
                    <td><AddressesCell addresses={row.addresses} /></td>
                    <td><SlpsCell slps={row.serviceLocationPolicies} /></td>
                    <td style={{ whiteSpace: 'normal' }}>{row.notes || '—'}</td>
                    <td className="text-end">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => openEdit(row)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={9}>
                      <em className="text-muted">
                        {search.trim() ? 'No plan policies match your search.' : 'No plan policies found.'}
                      </em>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <button className="btn btn-outline-secondary btn-sm" onClick={fetchPolicies}>
            Refresh
          </button>
        </div>
      </div>

      {createOpen && (
        <CreatePlanPolicyModal show={createOpen} onClose={closeCreate} />
      )}
      {editOpen && editing && (
        <EditPlanPolicyModal show={editOpen} policy={editing} onClose={closeEdit} />
      )}
    </div>
  );
}
