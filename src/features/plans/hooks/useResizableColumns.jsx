import { useEffect, useMemo, useRef, useState } from 'react';

export default function useResizableColumns(columnKeys, {
  storageKey = 'planTableColumnWidths',
  min = 120,
  max = 640,
  defaults = {},
} = {}) {
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  const activeKeyRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const [widths, setWidths] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
      const out = {};
      columnKeys.forEach((k) => {
        out[k] = typeof saved[k] === 'number'
          ? saved[k]
          : (typeof defaults[k] === 'number' ? defaults[k] : 180);
      });
      return out;
    } catch {
      const out = {};
      columnKeys.forEach((k) => (out[k] = 180));
      return out;
    }
  });

  // Persist when widths change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(widths));
  }, [storageKey, widths]);

  const onMouseDownFactory = (key) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    startXRef.current = e.clientX;
    startWidthRef.current = widths[key] ?? 180;
    activeKeyRef.current = key;
    setIsDragging(true);
    // improve UX
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const onMouseMove = (e) => {
    if (!isDragging || !activeKeyRef.current) return;
    const key = activeKeyRef.current;
    const delta = e.clientX - startXRef.current;
    const next = Math.max(min, Math.min(max, startWidthRef.current + delta));
    setWidths((prev) => ({ ...prev, [key]: next }));
  };

  const onMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    activeKeyRef.current = null;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  useEffect(() => {
    if (!isDragging) return;
    const mm = (e) => onMouseMove(e);
    const mu = () => onMouseUp();
    window.addEventListener('mousemove', mm);
    window.addEventListener('mouseup', mu);
    return () => {
      window.removeEventListener('mousemove', mm);
      window.removeEventListener('mouseup', mu);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

  const api = useMemo(() => ({
    widths,
    setWidths,
    onMouseDownFactory,
    isDragging,
  }), [widths, isDragging]);

  return api;
}
