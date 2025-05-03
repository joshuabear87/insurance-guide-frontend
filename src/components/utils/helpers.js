export const formatAddress = (addr) => {
    if (!addr || typeof addr !== 'object') return '-';
    const { street, street2, city, state, zip } = addr;
    const parts = [
      street?.trim(),
      street2?.trim(),
      [city?.trim(), state?.trim(), zip?.trim()].filter(Boolean).join(' ')
    ].filter(Boolean);
    return parts.length ? parts.join(', ') : '-';
  };
  
  export const getNestedValue = (obj, path) =>
    path.split('.').reduce((acc, key) => acc?.[key], obj);
  

  export const formatLabel = (key) => {
    return key
      .replace(/\./g, ' ') // Replace dots with spaces
      .replace(/([A-Z])/g, ' $1') // Add space before caps
      .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
      .replace(/\s+/g, ' ') // Clean up extra spaces
      .trim();
  };