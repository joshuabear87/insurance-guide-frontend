import React from 'react';
import BlueCardCardViewContent from './BlueCardCardViewContent';

const BlueCardCardView = ({ rows, visibleColumns, onSelect }) => {
  return (
    <div className="container py-4">
      <div className="row g-4">
        {rows.map((row, i) => (
          <div key={`${row.prefix}-${i}`} className="col-12 col-sm-6 col-lg-4">
            <BlueCardCardViewContent
              row={row}
              visibleColumns={visibleColumns}
              onSelect={() => onSelect(row.book)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlueCardCardView;