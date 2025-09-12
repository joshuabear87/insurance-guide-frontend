import * as XLSX from 'xlsx';

const extractText = (val) => {
  if (!val) return '-';

  if (typeof val === 'string' || typeof val === 'number') return val;

  if (typeof val === 'object' && val?.props) {
    const flat = [];

    const extractFromChildren = (children) => {
      if (!children) return;
      if (typeof children === 'string') {
        flat.push(children);
      } else if (Array.isArray(children)) {
        children.forEach(extractFromChildren);
      } else if (typeof children === 'object' && children?.props) {
        extractFromChildren(children.props.children);
      }
    };

    extractFromChildren(val.props.children);
    return flat.join(' ').trim() || '-';
  }

  if (typeof val === 'object') return JSON.stringify(val);

  return '-';
};

export const exportToExcel = (rows, columnConfig, filename) => {
  const flattened = rows.map((row) => {
    const output = {};

    columnConfig.forEach((col) => {
      const raw = row[col.key] ?? row.book?.[col.key];

      // 🖼 Special case for images
      if (['image', 'secondaryImage'].includes(col.key)) {
        output[col.label] = typeof raw === 'string' ? raw : '-';
        return;
      }

      // 🌐 Special case for portalLinks
      if (col.key === 'portalLinks') {
        if (Array.isArray(raw)) {
          output[col.label] = raw
            .map((l) => `${l.title || ''}: ${l.url || ''}`)
            .join('; ');
        } else {
          output[col.label] = '-';
        }
        return;
      }

      // 📞 Handle other fields with render or fallback
      if (col.render) {
        try {
          const rendered = col.render(raw);
          output[col.label] = extractText(rendered);
        } catch {
          output[col.label] = '-';
        }
      } else {
        output[col.label] = extractText(raw);
      }
    });

    return output;
  });

  const worksheet = XLSX.utils.json_to_sheet(flattened);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Export');
  XLSX.writeFile(workbook, filename);
};
