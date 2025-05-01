const blueCardColumnConfig = [
  { key: 'prefix', label: 'Prefix' }, // Always visible, not toggleable

  { key: 'financialClass', label: 'Financial Class' },
  { key: 'descriptiveName', label: 'Descriptive Name' },
  { key: 'payerName', label: 'Payer Name', truncate: false },
  { key: 'payerCode', label: 'Payer Code' },
  { key: 'planName', label: 'Plan Name', truncate: false },
  { key: 'planCode', label: 'Plan Code' },
  { key: 'samcContracted', label: 'SAMC Contracted' },
  { key: 'samfContracted', label: 'SAMF Contracted' },

  {
    key: 'prefixes',
    label: 'All Prefixes',
    render: (val) => val?.map((p) => p.value).join(', '),
  },
  { key: 'ipaPayerId', label: 'IPA Payer ID' },
  { key: 'payerId', label: 'Payer ID' },
  { key: 'authorizationNotes', label: 'Authorization Notes', truncate: true },
  { key: 'notes', label: 'Notes', truncate: true },

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
    label: 'Card Front',
    render: (val) =>
      val ? (
        <img
          src={val}
          alt="card"
          style={{ width: '100%', maxHeight: '220px', objectFit: 'contain' }}
        />
      ) : (
        'N/A'
      ),
  },
  {
    key: 'secondaryImage',
    label: 'Card Back',
    render: (val) =>
      val ? (
        <img
          src={val}
          alt="card"
          style={{ width: '100%', maxHeight: '220px', objectFit: 'contain' }}
        />
      ) : (
        'N/A'
      ),
  },
];

export default blueCardColumnConfig;
