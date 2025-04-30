import React, { useEffect, useState } from 'react';
import API from '../axios';
import Spinner from '../components/Spinner';

const InsurancePlanFiltered = ({ filter }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await API.get('/books');
        const allPlans = res.data.data;
        const filtered = filter
          ? allPlans.filter((plan) => plan.financialClass === filter)
          : allPlans;
        setPlans(filtered);
      } catch (err) {
        console.error('Error fetching plans:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [filter]);

  if (loading) return <Spinner />;

  return (
    <div className="container mt-4">
      <h2>{filter ? `${filter} Insurance Plans` : 'All Insurance Plans'}</h2>
      <ul className="list-group mt-3">
        {plans.map((plan) => (
          <li key={plan._id} className="list-group-item">
            <strong>{plan.descriptiveName}</strong> – {plan.planName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InsurancePlanFiltered;
