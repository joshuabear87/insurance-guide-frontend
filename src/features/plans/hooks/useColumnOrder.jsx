import { useEffect, useState } from 'react';

const sanitizeOrder = (saved, allKeys) => {
  const set = new Set(allKeys);
  const filtered = Array.isArray(saved) ? saved.filter((k) => set.has(k)) : [];
  // Add any new keys that weren't in saved
  const missing = allKeys.filter((k) => !filtered.includes(k));
  return [...filtered, ...missing];
};

export default function useColumnOrder(allKeys, {
  storageKey = 'planTableColumnOrder',
} = {}) {
  const [order, setOrder] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
      return sanitizeOrder(saved, allKeys);
    } catch {
      return allKeys.slice();
    }
  });

  // If allKeys change (you add/remove columns), re-sanitize
  useEffect(() => {
    setOrder((prev) => sanitizeOrder(prev, allKeys));
  }, [allKeys]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(order));
  }, [order, storageKey]);

  const resetOrder = () => setOrder(allKeys.slice());

  return { order, setOrder, resetOrder };
}
