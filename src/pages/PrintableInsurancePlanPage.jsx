import React, { useEffect, useState, useContext } from 'react';
import API from '../axios';
import { formatAddress } from '../components/utils/helpers';
import { useSnackbar } from 'notistack';
import { AuthContext } from '../context/AuthContexts';
import SendPdfButton from '../components/SendPdfButton';

const PrintableInsurancePlanPage = () => {
  const [plans, setPlans] = useState([]);
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await API.get('/books');
        setPlans(res.data.data || res.data || []);
      } catch (err) {
        console.error('Error fetching plans:', err);
      }
    };
    fetchPlans();
  }, []);

  return (
    <div className="container my-4">
      {isAdmin && (
  <div className="d-flex justify-content-end mb-3">
    <SendPdfButton />
  </div>
)}

      <h1 className="text-center mb-5">Insurance Plan Directory</h1>

      {/* --- Table 1: Insurance Plan Details --- */}
      <h4 className="mb-3">Insurance Plan Details</h4>
      <div className="table-responsive mb-5">
        <table className="table table-bordered table-sm align-middle" style={{ fontSize: '11px' }}>
          <thead className="table-light">
            <tr>
              <th>Descriptive Name</th>
              <th>Financial Class</th>
              <th>Payer Name</th>
              <th>Payer Code</th>
              <th>Plan Name</th>
              <th>Plan Code</th>
              <th>SAMC Contracted</th>
              <th>SAMF Contracted</th>
              <th style={{ minWidth: '200px' }}>Notes</th>
              <th style={{ minWidth: '200px' }}>Authorization Notes</th>
              <th>Payer ID</th>
              <th>IPA Payer ID</th>
              <th>Facility Address</th>
              <th>Provider Address</th>
              <th>Prefixes</th>
            </tr>
          </thead>
          <tbody>
            {plans.map(plan => (
              <tr key={plan._id}>
                <td>{plan.descriptiveName}</td>
                <td>{plan.financialClass}</td>
                <td>{plan.payerName}</td>
                <td>{plan.payerCode}</td>
                <td>{plan.planName}</td>
                <td>{plan.planCode}</td>
                <td>{plan.samcContracted}</td>
                <td>{plan.samfContracted}</td>
                <td>{plan.notes || '-'}</td>
                <td>{plan.authorizationNotes || '-'}</td>
                <td>{plan.payerId || '-'}</td>
                <td>{plan.ipaPayerId || '-'}</td>
                <td>{formatAddress(plan.facilityAddress)}</td>
                <td>{formatAddress(plan.providerAddress)}</td>
                <td>
                  {(plan.prefixes || []).map((p, i) => (
                    <div key={i}>{p.value}</div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Table 2: Portal Links Only --- */}
      <h4 className="mb-3">Portal Links</h4>
      <div className="table-responsive mb-5">
        <table className="table table-bordered table-sm align-middle" style={{ fontSize: '11px' }}>
          <thead className="table-light">
            <tr>
              <th>Portal Link Title</th>
              <th>Portal Link URL</th>
            </tr>
          </thead>
          <tbody>
            {plans.flatMap((plan, planIndex) =>
              (plan.portalLinks || []).map((link, i) => (
                <tr key={`portal-${planIndex}-${i}`}>
                  <td>{link.title}</td>
                  <td>{link.url}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- Table 3: Phone Numbers Only --- */}
      <h4 className="mb-3">Phone Numbers</h4>
      <div className="table-responsive">
        <table className="table table-bordered table-sm align-middle" style={{ fontSize: '11px' }}>
          <thead className="table-light">
            <tr>
              <th>Phone Number Title</th>
              <th>Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {plans.flatMap((plan, planIndex) =>
              (plan.phoneNumbers || []).map((phone, i) => (
                <tr key={`phone-${planIndex}-${i}`}>
                  <td>{phone.title}</td>
                  <td>{phone.number}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrintableInsurancePlanPage;
