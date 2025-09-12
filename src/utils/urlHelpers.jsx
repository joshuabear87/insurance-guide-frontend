// utils/helpers.js
export const ensureHttps = (url) => {
  if (!url) return '';
  return url.startsWith('http://') || url.startsWith('https://')
    ? url
    : `https://${url}`;
};
