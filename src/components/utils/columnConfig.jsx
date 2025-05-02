const columnConfig = [
  { key: 'financialClass', label: 'Financial Class' },
  { key: 'descriptiveName', label: 'Descriptive Name' },
  { key: 'payerName', label: 'Payer Name' },
  { key: 'payerCode', label: 'Payer Code' },
  { key: 'planName', label: 'Plan Name' },
  { key: 'planCode', label: 'Plan Code' },
  {
    key: 'samcContracted',
    label: 'SAMC Contracted',
    render: (val) => (
      <span
        style={{
          color: val?.toLowerCase() === 'contracted' ? 'green' : 'red',
          fontWeight: 'bold',
        }}
      >
        {val || 'N/A'}
      </span>
    ),
  },
  {
    key: 'samfContracted',
    label: 'SAMF Contracted',
    render: (val) => (
      <span
        style={{
          color: val?.toLowerCase() === 'contracted' ? 'green' : 'red',
          fontWeight: 'bold',
        }}
      >
        {val || 'N/A'}
      </span>
    ),
  },
  {
    key: 'prefixes',
    label: 'Prefixes',
    render: (val) => val?.map((p) => p.value).join(', '),
  },
  {
    key: 'notes',
    label: 'Notes',
    render: (val) => {
      const text = val || 'N/A';
      return (
        <div
          style={{
            maxWidth: '150px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          title={text}
          >
          {text}
        </div>
      );
    },
  },
  {
    key: 'authorizationNotes',
    label: 'Auth Notes',
    render: (val) => {
      const text = val || 'N/A';
      return (
        <div
          style={{
            maxWidth: '150px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          title={text}
          >
          {text}
        </div>
      );
    },
  },
  {
    key: 'image',
    label: 'Card Front',
    render: (val) =>
      val ? (
        <img
          src={val}
          alt="card"
          style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }}
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
          style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }}
        />
      ) : (
        'N/A'
      ),
  },
  { key: 'payerId', label: 'Payer ID' },
  { key: 'ipaPayerId', label: 'IPA Payer ID' },
  { key: 'facilityAddress.street', label: 'Facility Street' },
  { key: 'facilityAddress.city', label: 'Facility City' },
  { key: 'facilityAddress.state', label: 'Facility State' },
  { key: 'facilityAddress.zip', label: 'Facility ZIP' },
  { key: 'providerAddress.street', label: 'Provider Street' },
  { key: 'providerAddress.city', label: 'Provider City' },
  { key: 'providerAddress.state', label: 'Provider State' },
  { key: 'providerAddress.zip', label: 'Provider ZIP' },
];

export default columnConfig;
