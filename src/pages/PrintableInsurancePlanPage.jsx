import React, { useEffect, useState, useContext } from 'react';
import API from '../axios';
import { AuthContext } from '../context/AuthContexts';
import SendPdfButton from '../components/SendPdfButton';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner'; 
import { useLocation } from 'react-router-dom';

const PrintableInsurancePlanPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true); 
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin';
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const financialClassFilter = searchParams.get('financialClass') || '';

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await API.get('/books');
        let allPlans = res.data.data || res.data || [];
  
        if (financialClassFilter) {
          allPlans = allPlans.filter(p => p.financialClass === financialClassFilter);
        }
  
        allPlans.sort((a, b) => (a.financialClass || '').localeCompare(b.financialClass || ''));
        setPlans(allPlans);
      } catch (err) {
        console.error('Error fetching plans:', err);
      } finally {
        // ✅ Add slight delay for smoother transition
        setTimeout(() => setLoading(false), 400); // 600ms delay
      }
    };
  
    fetchPlans();
  }, [financialClassFilter]);  

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center m-5">
        <div className="text-center">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-start my-3">
        <BackButton />
      </div>

      {isAdmin && (
        <div className="d-flex justify-content-start mb-3">
          <SendPdfButton />
        </div>
      )}

      <h1 className="text-center mb-5">Downtime Printout</h1>

      {/* --- Table 1: Filtered Plan Details --- */}
      <h4 className="mb-3">Insurance Plan Details</h4>
      <div className="table-responsive mb-5">
        <table className="table table-bordered table-sm align-middle" style={{ fontSize: '11px' }}>
          <thead className="table-light">
            <tr>
              <th style={{ minWidth: '50px' }}>Fin. Class</th>
              <th style={{ minWidth: '40px' }}>Prefix</th>
              <th style={{ minWidth: '100px' }}>Plan Name</th>
              <th style={{ minWidth: '65px' }}>Plan Code</th>
              <th style={{ minWidth: '50px' }}>SAMC Contracted</th>
              <th style={{ minWidth: '50px' }}>SAMF Contracted</th>
              <th style={{ minWidth: '100px' }}>Notes</th>
              <th style={{ minWidth: '100px' }}>Authorization Notes</th>
            </tr>
          </thead>
          <tbody>
            {plans.map(plan => (
              <tr key={plan._id}>
                <td>{plan.financialClass || '-'}</td>
                <td>
                  {(plan.prefixes || []).map((p, i) => (
                    <div key={i}>{p.value}</div>
                  ))}
                </td>
                <td>{plan.planName}</td>
                <td>{plan.planCode}</td>
                <td>{plan.samcContracted}</td>
                <td>{plan.samfContracted}</td>
                <td>{plan.notes || '-'}</td>
                <td>{plan.authorizationNotes || '-'}</td>
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
              <th style={{ minWidth: '100px' }}>Portal Link Title</th>
              <th style={{ minWidth: '100px' }}>Portal Link URL</th>
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
              <th style={{ minWidth: '100px' }}>Phone Number Title</th>
              <th style={{ minWidth: '100px' }}>Phone Number</th>
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
