// Lightweight search & highlight helpers

import React from 'react';

export const escapeRegExp = (s = '') =>
  s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const normalize = (s = '') =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')    // strip accents
    .replace(/[^a-z0-9]+/gi, ' ')      // non-alnum → space
    .trim();

export const tokenize = (s = '') =>
  normalize(s).split(/\s+/).filter(Boolean);

// Single-term highlighter (kept for legacy use)
export const makeHighlighter = (query) => {
  const q = (query || '').trim();
  if (!q) return (txt) => txt;
  const re = new RegExp(`(${escapeRegExp(q)})`, 'gi');
  return (txt) => {
    if (txt == null) return txt;
    const str = String(txt);
    if (!str) return str;
    const parts = str.split(re);
    if (parts.length === 1) return str;
    return parts.map((part, i) =>
      part.toLowerCase() === q.toLowerCase()
        ? <mark key={i} className="hl">{part}</mark>
        : part
    );
  };
};

// Multi-term highlighter → highlights ANY of the tokens
export const makeMultiHighlighter = (terms = []) => {
  const toks = (Array.isArray(terms) ? terms : tokenize(terms));
  if (!toks.length) return (txt) => txt;
  // sort longest-first to avoid partial overshadowing
  toks.sort((a, b) => b.length - a.length);
  const re = new RegExp(`(${toks.map(escapeRegExp).join('|')})`, 'gi');

  return (txt) => {
    if (txt == null) return txt;
    const str = String(txt);
    if (!str) return str;
    const parts = str.split(re);
    if (parts.length === 1) return str;
    return parts.map((part, i) =>
      toks.includes(part.toLowerCase())
        ? <mark key={i} className="hl">{part}</mark>
        : part
    );
  };
};
