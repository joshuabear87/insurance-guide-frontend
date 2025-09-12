import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

export default function AutocompleteInput({
  label, value, onChange,
  fetchUrl, placeholder = '', disabled = false, minChars = 1,
  onSelect // (item) => {_id,name} or null
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  useEffect(() => {
    if (disabled) return;
    const q = (value || '').trim();
    if (q.length < minChars) { setItems([]); return; }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(fetchUrl, { params: { q }, signal: ctrl.signal });
        setItems(Array.isArray(data) ? data : []);
      } catch { /* ignore */ }
      finally { setLoading(false); }
    }, 250);
    return () => { ctrl.abort(); clearTimeout(t); };
  }, [value, fetchUrl, disabled, minChars]);

  return (
    <div ref={boxRef} className="position-relative">
      {label && <label className="form-label">{label}</label>}
      <input
        className="form-control"
        value={value}
        placeholder={placeholder}
        onChange={(e) => { onChange(e.target.value); onSelect?.(null); }}
        onFocus={() => setOpen(true)}
        disabled={disabled}
        autoComplete="off"
      />
      {open && items.length > 0 && (
        <div className="list-group position-absolute w-100 shadow-sm" style={{ zIndex: 1000, maxHeight: 240, overflowY: 'auto' }}>
          {items.map(it => (
            <button
              key={it._id || it.name}
              type="button"
              className="list-group-item list-group-item-action"
              onClick={() => { onChange(it.name); onSelect?.(it); setOpen(false); }}
            >
              {it.name}
            </button>
          ))}
        </div>
      )}
      {loading && <div className="form-text">Loading…</div>}
    </div>
  );
}
