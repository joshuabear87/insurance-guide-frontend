const columnConfig = [
    { key: 'financialClass', label: 'Financial Class' },
    { key: 'descriptiveName', label: 'Descriptive Name' },
    { key: 'payerName', label: 'Payer Name', truncate: false }, // ✅ no truncate
    { key: 'payerCode', label: 'Payer Code' },
    { key: 'planName', label: 'Plan Name', truncate: false }, // ✅ no truncate
    { key: 'planCode', label: 'Plan Code' },
    { key: 'samcContracted', label: 'SAMC' },
    { key: 'samfContracted', label: 'SAMF' },
    { key: 'prefixes', label: 'Prefixes', render: (val) => val?.map(p => p.value).join(', ') },
    { key: 'ipaPayerId', label: 'IPA Payer ID' },
    { key: 'payerId', label: 'Payer ID' },
    { key: 'authorizationNotes', label: 'Auth Notes', truncate: true }, // ✅ truncation wanted
    { key: 'notes', label: 'Notes', truncate: true }, // ✅ truncation wanted
    { key: 'facilityAddress.street', label: 'Facility Street' },
    { key: 'facilityAddress.city', label: 'Facility City' },
    { key: 'facilityAddress.state', label: 'Facility State' },
    { key: 'facilityAddress.zip', label: 'Facility ZIP' },
    { key: 'providerAddress.street', label: 'Provider Street' },
    { key: 'providerAddress.city', label: 'Provider City' },
    { key: 'providerAddress.state', label: 'Provider State' },
    { key: 'providerAddress.zip', label: 'Provider ZIP' },
    {
      key: 'image',
      label: 'Front',
      render: (val) =>
        val ? <img src={val} alt="card" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }} /> : 'N/A',
    },
    {
      key: 'secondaryImage',
      label: 'Back',
      render: (val) =>
        val ? <img src={val} alt="card" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }} /> : 'N/A',
    },
      ];
  
  export default columnConfig;
  