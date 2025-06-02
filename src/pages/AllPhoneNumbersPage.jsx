import React, { useEffect, useState } from 'react';
import API from '../axios';
import InsurancePlanModalContent from '../components/InsurancePlanModalContent';
import Spinner from '../components/Spinner';

const AllPhoneNumbersPage = () => {
  const [groupedNumbers, setGroupedNumbers] = useState({});
  const [filtered, setFiltered] = useState({});
  const [search, setSearch] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await API.get('/books');
        const plans = res.data?.data || res.data || [];

        const grouped = {};
        plans.forEach(plan => {
          plan.phoneNumbers?.forEach(entry => {
            const key = `${entry.title} (${entry.number})`;
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(plan);
          });
        });

        setGroupedNumbers(grouped);
        setFiltered(grouped);
      } catch (err) {
        console.error('Error fetching phone numbers:', err);
      } finally {
        setTimeout(() => setLoading(false), 400); 
      }
    };

    fetchPlans();
  }, []);

  useEffect(() => {
    const s = search.toLowerCase();
    const filteredMap = Object.entries(groupedNumbers).reduce((acc, [label, plans]) => {
      const filteredPlans = plans.filter(p =>
        p.planCode.toString().includes(s) ||
        label.toLowerCase().includes(s) ||
        p.descriptiveName.toLowerCase().includes(s)
      );
      if (filteredPlans.length > 0) acc[label] = filteredPlans;
      return acc;
    }, {});
    setFiltered(filteredMap);
  }, [search, groupedNumbers]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center m-5">
          <Spinner />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4 text-blue">Insurance Phone Numbers</h2>

      <div className="mb-3">
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="Search by number, or plan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="card p-3 shadow-lg">
        {Object.entries(filtered).map(([label, plans]) => (
          <div key={label} className="mb-4">
            <div className="fw-semibold text-blue">{label}</div>
            <ul className="mb-2 mt-2 ps-3">
              {plans.map((plan, i) => (
                <li
                  key={i}
                  onClick={() => setSelectedPlan(plan)}
                  style={{
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    color: 'black',
                  }}
                >
                  {plan.descriptiveName}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <InsurancePlanModalContent
          book={selectedPlan}
          onClose={() => setSelectedPlan(null)}
        />
      )}
    </div>
  );
};

export default AllPhoneNumbersPage;
