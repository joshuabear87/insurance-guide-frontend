import React, { useEffect, useMemo, useRef, useState } from 'react';
import { searchPortalLinks, createPortalLink } from '../../../api/portalLinks';

export default function PortalLinkSelector({ value, onChange, facilityName, canCreate=false }) {
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const timer = useRef();

  useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      setLoading(true);
      setErr('');
      try {
        const results = await searchPortalLinks(query, facilityName);
        setOptions(Array.isArray(results) ? results : []);
      } catch (e) {
        console.error('portal-links search failed', e);
        setErr('Search failed. Are you logged in?');
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer.current);
  }, [query, facilityName]);

  const selectedSet = useMemo(() => new Set(value || []), [value]);

  const toggle = (id) => {
    if (selectedSet.has(id)) onChange((value || []).filter(v => v !== id));
    else onChange([...(value || []), id]);
  };

  const createQuick = async () => {
    if (!canCreate) return;
    const name = window.prompt('Name (e.g., "Availity")');
    const url  = window.prompt('URL (e.g., https://www.availity.com/)');
    if (!name || !url) return;
    try {
      const created = await createPortalLink({ name, url, facilityName });
      onChange([...(value || []), created._id]);
      setQuery(''); // refresh
    } catch (e) {
      console.error('create portal-link failed', e);
      alert(e.message || 'Failed to create link (are you an admin and logged in?)');
    }
  };

  return (
    <div className="mb-3">
      <label className="form-label d-flex justify-content-between align-items-center">
        <span>Portal Links</span>
        {canCreate && (
          <button type="button" className="btn btn-sm btn-outline-primary" onClick={createQuick}>
            New
          </button>
        )}
      </label>
      <input
        className="form-control"
        placeholder="Search portal links…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="mt-2 border rounded p-2" style={{ maxHeight: 240, overflowY: 'auto' }}>
        {loading && <div className="form-text">Loading…</div>}
        {!loading && err && <div className="text-danger small">{err}</div>}
        {!loading && !err && options.length === 0 && <div className="text-muted">No results</div>}
        {!loading && !err && options.map((opt) => (
          <label key={opt._id} className="d-flex align-items-start gap-2 py-1">
            <input
              type="checkbox"
              checked={selectedSet.has(opt._id)}
              onChange={() => toggle(opt._id)}
            />
            <div>
              <div className="fw-semibold">{opt.name}</div>
              <div className="small text-break">{opt.url}</div>
              {opt.isActive === false && <span className="badge text-bg-warning">Inactive</span>}
            </div>
          </label>
        ))}
      </div>

      {Array.isArray(value) && value.length > 0 && (
        <div className="mt-2 d-flex flex-wrap gap-2">
          {value.map((id) => (
            <span key={id} className="badge text-bg-secondary">
              {options.find(o => o._id === id)?.name || id}
              <button
                type="button"
                className="btn-close btn-close-white btn-sm ms-2"
                aria-label="Remove"
                onClick={() => toggle(id)}
              />
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
