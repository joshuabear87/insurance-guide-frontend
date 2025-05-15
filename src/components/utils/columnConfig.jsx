const columnConfig = [
  { key: 'financialClass', label: 'Financial Class' },
  { key: 'descriptiveName', label: 'Descriptive Name' },
  { key: 'payerName', label: 'Payer Name' },
  { key: 'payerCode', label: 'Payer Code' },
  { key: 'planName', label: 'Plan Name' },
  { key: 'planCode', label: 'Plan Code' },

  // Removed SAMC and SAMF Contracted columns, now using facilityContracts
  {
    key: 'facilityContracts',
    label: 'Facility Contracts',
    render: (contracts) =>
      contracts?.length > 0 ? (
        <ul className="mb-0 ps-3">
          {contracts.map((contract, i) => (
            <li key={i}>
              <strong>{contract.facilityName}:</strong> {contract.contractStatus}
            </li>
          ))}
        </ul>
      ) : (
        '-'
      ),
  },

  {
    key: 'prefixes',
    label: 'Prefixes',
    render: (val) =>
      val?.length > 0 ? val.map((p) => p.value).join(', ') : '-',
  },

  {
    key: 'notes',
    label: 'Notes',
    render: (val) => {
      const text = val || '-';
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
      const text = val || '-';
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
    key: 'portalLinks',
    label: 'Portal Links',
    render: (links) =>
      links?.length > 0 ? (
        <ul className="mb-0 ps-3">
          {links.map((link, i) => (
            <li key={i}>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {link.title}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        '-'
      ),
  },

  {
    key: 'phoneNumbers',
    label: 'Phone Numbers',
    render: (phones) =>
      phones?.length > 0 ? (
        <ul className="mb-0 ps-3">
          {phones.map((phone, i) => (
            <li key={i}>
              {phone.title}: {phone.number}
            </li>
          ))}
        </ul>
      ) : (
        '-'
      ),
  },

  {
    key: 'facilityAddress',
    label: 'Facility Address',
    render: (addr) => {
      if (!addr || typeof addr !== 'object') return '-';

      const { street, street2, city, state, zip } = addr;
      const parts = [];

      if (street) parts.push(street.trim());
      if (street2) parts.push(street2.trim());

      if (city || state || zip) {
        const location = [city?.trim(), state?.trim(), zip?.trim()]
          .filter(Boolean)
          .join(' ');
        parts.push(location);
      }

      return parts.length > 0 ? parts.join(', ') : '-';
    },
  },

  {
    key: 'providerAddress',
    label: 'Provider Address',
    render: (addr) => {
      if (!addr || typeof addr !== 'object') return '-';

      const { street, street2, city, state, zip } = addr;
      const parts = [];

      if (street) parts.push(street.trim());
      if (street2) parts.push(street2.trim());

      if (city || state || zip) {
        const location = [city?.trim(), state?.trim(), zip?.trim()]
          .filter(Boolean)
          .join(' ');
        parts.push(location);
      }

      return parts.length > 0 ? parts.join(', ') : '-';
    },
  },

  { key: 'payerId', label: 'Payer ID' },
  { key: 'ipaPayerId', label: 'IPA Payer ID' },

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
        '-'
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
        '-'
      ),
  },
];

export default columnConfig;
