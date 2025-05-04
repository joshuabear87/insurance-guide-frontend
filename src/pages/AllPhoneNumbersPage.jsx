import React, { useEffect, useState } from 'react';
import API from '../axios';
import InsurancePlanModalContent from '../components/InsurancePlanModalContent';

const AllPhoneNumbersPage = () => {
  const [groupedNumbers, setGroupedNumbers] = useState({});
  const [filtered, setFiltered] = useState({});
  const [search, setSearch] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);

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

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4 fw-bold" style={{ color: '#005b7f' }}>All Phone Numbers</h2>

      <div className="mb-3">
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="Search by number, or plan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="card p-3 shadow-sm">
        {Object.entries(filtered).map(([label, plans]) => (
          <div key={label} className="mb-4">
            <div className="fw-semibold text-primary">{label}</div>
            <ul className="mb-2 mt-2 ps-3">
              {plans.map((plan, i) => (
                <li
                  key={i}
                  onClick={() => setSelectedPlan(plan)}
                  style={{ fontSize: '0.85rem', cursor: 'pointer', color: '#005b7f' }}
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
