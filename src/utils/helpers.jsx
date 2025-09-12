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
  
export const getNestedValue = (obj, path) => {
  try {
    const value = path.split('.').reduce((acc, key) => acc?.[key], obj);
    if (value === undefined || value === null) {
      console.warn(`⚠️ Missing value for path "${path}" in book ID: ${obj?._id}`);
      return '-';
    }
    return value;
  } catch (err) {
    console.error(`❌ Error accessing "${path}" in book ID: ${obj?._id}`, err);
    return '-';
  }
};


  export const formatLabel = (key) => {
    return key
      .replace(/\./g, ' ') // Replace dots with spaces
      .replace(/([A-Z])/g, ' $1') // Add space before caps
      .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
      .replace(/\s+/g, ' ') // Clean up extra spaces
      .trim();
  };

  export const getContractColor = (status) => {
  switch ((status || '').toLowerCase()) {
    case 'contracted':
      return 'green';
    case 'not contracted':
      return 'red';
    case 'must call':
    case 'must call to confirm':
      return 'orange';
    case 'see notes':
      return '#0d6efd'; // Bootstrap primary blue
    default:
      return 'inherit';
  }
};
