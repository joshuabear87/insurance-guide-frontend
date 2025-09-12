import { ensureHttps } from '../../../utils/urlHelpers';

// NOTE: Any custom render here should accept (value, row, ctx)
// and use ctx.hl (global highlight) or ctx.hlPrefix (prefix-only highlight)
// so highlighting works consistently.
const columnConfig = [
  { key: 'financialClass', label: 'Financial Class' },

  {
    key: 'descriptiveName',
    label: 'Descriptive Name',
    render: (val, _row, ctx) => (val ? ctx?.hl?.(val) : '-'),
  },

  {
    key: 'payerName',
    label: 'Payer Name',
    render: (val, _row, ctx) => (val ? ctx?.hl?.(val) : '-'),
  },

  {
    key: 'payerCode',
    label: 'Payer Code',
    render: (val, _row, ctx) => (val ? ctx?.hl?.(String(val)) : '-'),
  },

  {
    key: 'planName',
    label: 'Plan Name',
    render: (val, _row, ctx) => (val ? ctx?.hl?.(val) : '-'),
  },

  {
    key: 'planCode',
    label: 'Plan Code',
    render: (val, _row, ctx) => (val ? ctx?.hl?.(String(val)) : '-'),
  },

  {
    key: 'facilityContracts',
    label: 'Contracting',
    render: (contracts, _row, ctx) =>
      Array.isArray(contracts) && contracts.length > 0 ? (
        <ul className="mb-0 ps-3">
          {contracts.map((c, i) => (
            <li key={i}>
              <strong>{ctx?.hl?.(c.facilityName ?? '')}:</strong>{' '}
              {ctx?.hl?.(c.contractStatus ?? '')}
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
    // IMPORTANT: use ctx.hlPrefix to highlight prefix matches
    render: (val, _row, ctx) =>
      Array.isArray(val) && val.length > 0 ? (
        val.map((p, i) => (
          <span key={i}>
            {ctx?.hlPrefix ? ctx.hlPrefix(p?.value ?? '') : (p?.value ?? '')}
            {i < val.length - 1 ? ', ' : ''}
          </span>
        ))
      ) : (
        '-'
      ),
  },

  {
    key: 'notes',
    label: 'Notes',
    render: (val, _row, ctx) => (val ? ctx?.hl?.(val) : '-'),
  },

  {
    key: 'authorizationNotes',
    label: 'Auth Notes',
    render: (val, _row, ctx) => (val ? ctx?.hl?.(val) : '-'),
  },

  {
    key: 'portalLinks',
    label: 'Portal Links',
    render: (links, _row, ctx) =>
      Array.isArray(links) && links.length > 0 ? (
        <ul className="list-unstyled mb-0">
          {links.map((link, i) => (
            <li key={i}>
              <a
                href={ensureHttps(link?.url || '')}
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* highlight the title text inside the link */}
                {ctx?.hl?.(link?.title ?? '')}
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
    render: (phones, _row, ctx) =>
      Array.isArray(phones) && phones.length > 0 ? (
        <ul className="list-unstyled mb-0">
          {phones.map((phone, i) => (
            <li key={i}>
              {ctx?.hl?.(phone?.title ?? '')}: {ctx?.hl?.(phone?.number ?? '')}
            </li>
          ))}
        </ul>
      ) : (
        '-'
      ),
  },

  {
    key: 'facilityAddress',
    label: 'Claims Address (HB)',
    render: (addr, _row, ctx) => {
      if (!addr || typeof addr !== 'object') return '-';
      const { street, street2, city, state, zip } = addr;
      const parts = [];
      if (street) parts.push(street.trim());
      if (street2) parts.push(street2.trim());
      if (city || state || zip) {
        const loc = [city?.trim(), state?.trim(), zip?.trim()]
          .filter(Boolean)
          .join(' ');
        parts.push(loc);
      }
      const joined = parts.length > 0 ? parts.join(', ') : '-';
      return ctx?.hl?.(joined);
    },
  },

  {
    key: 'providerAddress',
    label: 'Claims Address (PB)',
    render: (addr, _row, ctx) => {
      if (!addr || typeof addr !== 'object') return '-';
      const { street, street2, city, state, zip } = addr;
      const parts = [];
      if (street) parts.push(street.trim());
      if (street2) parts.push(street2.trim());
      if (city || state || zip) {
        const loc = [city?.trim(), state?.trim(), zip?.trim()]
          .filter(Boolean)
          .join(' ');
        parts.push(loc);
      }
      const joined = parts.length > 0 ? parts.join(', ') : '-';
      return ctx?.hl?.(joined);
    },
  },

  {
    key: 'payerId',
    label: 'Payer ID (HB)',
    render: (val, _row, ctx) => (val ? ctx?.hl?.(val) : '-'),
  },

  {
    key: 'ipaPayerId',
    label: 'Payer ID (PB)',
    render: (val, _row, ctx) => (val ? ctx?.hl?.(val) : '-'),
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
