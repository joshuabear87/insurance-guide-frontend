import React from 'react';
import { Link } from 'react-router-dom';

const Card = ({ to, title, subtitle, emoji }) => (
  <Link
    to={to}
    className="text-decoration-none"
    style={{ color: 'inherit' }}
  >
    <div className="card shadow-sm h-100">
      <div className="card-body d-flex flex-column">
        <div className="d-flex align-items-center justify-content-between">
          <h5 className="card-title mb-0">{title}</h5>
          <span style={{ fontSize: 28 }}>{emoji}</span>
        </div>
        <p className="text-muted mt-2 mb-0">{subtitle}</p>
      </div>
    </div>
  </Link>
);

export default function AdminDashboard() {
  return (
    <div className="container py-4">
      <h2 className="mb-4">Admin Dashboard</h2>

      <div className="row g-3">
        <div className="col-md-6 col-lg-4">
          <Card
            to="/admin/payers"
            title="MANAGE PAYERS"
            subtitle="Create, edit, and review payers across facilities"
            emoji="🏥"
          />
        </div>

        <div className="col-md-6 col-lg-4">
          <Card
            to="/admin/contracts/plan"  // keep existing route to your PlanPoliciesAdmin
            title="MANAGE PLANS"
            subtitle="Create, edit, and review plan/IPA policies"
            emoji="🗂️"
          />
        </div>

        <div className="col-md-6 col-lg-4">
          <Card
            to="/admin/plan-codes"      // placeholder: no logic wired yet
            title="MANAGE PLAN CODES"
            subtitle="Define and maintain plan code lookups (coming soon)"
            emoji="🏷️"
          />
        </div>
      </div>
    </div>
  );
}
