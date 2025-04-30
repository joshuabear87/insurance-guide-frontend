// src/pages/PrefixesPage.jsx
import React from 'react';

const PrefixesPage = () => {
  return (
    <div className="container mt-4">
      <h2>Prefix Table</h2>
      <table className="table mt-3">
        <thead>
          <tr>
            <th>Prefix</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>ABC</td>
            <td>Example Prefix</td>
          </tr>
          {/* Add real data later */}
        </tbody>
      </table>
    </div>
  );
};

export default PrefixesPage;
