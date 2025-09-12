import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import CreatePayerContractModal from '../../hub/components/CreatePayerModal.jsx';
import EditPayerContractModal from '../../hub/components/EditPayerModal.jsx';

const API = import.meta.env.VITE_API_URL;

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
          <strong>{p.label || 'Portal'}:</strong>{' '}
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

export default function PayersAdmin() {
  const { enqueueSnackbar } = useSnackbar();

  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // modals
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const API_BASE = `${API}/hub/payer-contracts`;

  const fetchContracts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(API_BASE, { params: { limit: 1000 } });
      const items = Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []);
      setContracts(items);
    } catch {
      enqueueSnackbar('Failed to load payer contracts', { variant: 'error' });
      setContracts([]);
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar, API_BASE]);

  useEffect(() => { fetchContracts(); }, [fetchContracts]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return contracts;
    return contracts.filter(row => {
      const haystack = [
        row.payerName, row.facilityName, row.financialClass, row.status, row.notes,
        ...(row.phones || []).flatMap(p => [p.label, p.number, p.notes]),
        ...(row.portals || []).flatMap(p => [p.label, p.url, p.notes]),
        ...(row.addresses || []).flatMap(a => [a.label, a.line1, a.line2, a.city, a.state, a.zip, a.notes]),
      ].map(x => (x || '').toLowerCase());
      return haystack.some(x => x.includes(q));
    });
  }, [contracts, search]);

  const openEdit = (row) => { setEditing(row); setEditOpen(true); };
  const closeEdit = (changed = false) => {
    setEditOpen(false);
    setEditing(null);
    if (changed) fetchContracts();
  };

  const closeCreate = (created = false) => {
    setCreateOpen(false);
    if (created) { setSearch(''); fetchContracts(); }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="mb-0">PAYER CONTRACT MANAGER</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-success" onClick={() => setCreateOpen(true)}>
            Create New Payer
          </button>
        </div>
      </div>

      <div className="mb-3">
        <input
          className="form-control"
          placeholder="Search payer contracts… (payer, facility, class, status, notes, phones, portals, addresses)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="mb-0">All Contracts</h5>
            {loading && <span className="text-muted">Loading…</span>}
          </div>

          <div className="table-responsive">
            <table className="table table-striped align-middle w-100" style={{ tableLayout: 'auto' }}>
              <thead>
                <tr>
                  <th>Payer</th>
                  <th>Financial Class</th>
                  <th>Facility</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th>Phones</th>
                  <th>Portals</th>
                  <th>Addresses</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(row => (
                  <tr key={row._id}>
                    <td>{row.payerName || '—'}</td>
                    <td>{row.financialClass || '—'}</td>
                    <td>{row.facilityName || '—'}</td>
                    <td>{row.status || '—'}</td>
                    <td style={{ whiteSpace: 'normal' }}>{row.notes || '—'}</td>
                    <td><PhonesCell phones={row.phones} /></td>
                    <td><PortalsCell portals={row.portals} /></td>
                    <td><AddressesCell addresses={row.addresses} /></td>
                    <td className="text-end">
                      <button className="btn btn-outline-primary btn-sm" onClick={() => openEdit(row)}>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={9}><em className="text-muted">No payer contracts found.</em></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <button className="btn btn-outline-secondary btn-sm" onClick={fetchContracts}>
            Refresh
          </button>
        </div>
      </div>

      {createOpen && (
        <CreatePayerContractModal show={createOpen} onClose={closeCreate} />
      )}
      {editOpen && editing && (
        <EditPayerContractModal show={editOpen} contract={editing} onClose={closeEdit} />
      )}
    </div>
  );
}
