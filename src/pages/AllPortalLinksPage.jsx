import React, { useEffect, useState } from 'react';
import API from '../axios';
import InsurancePlanModalContent from '../components/InsurancePlanModalContent';

const AllPortalLinksPage = () => {
  const [linkMap, setLinkMap] = useState({});
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await API.get('/books');
        const plans = res.data?.data || res.data || [];

        const grouped = {};
        plans.forEach(plan => {
          plan.portalLinks?.forEach(link => {
            if (!grouped[link.title]) grouped[link.title] = { url: link.url, names: [] };
            grouped[link.title].names.push(plan.descriptiveName);
          });
        });

        setPlans(plans);
        setLinkMap(grouped);
      } catch (err) {
        console.error('Error fetching portal links:', err);
      }
    };

    fetchPlans();
  }, []);

  const filteredLinkMap = Object.entries(linkMap).reduce((acc, [title, { url, names }]) => {
    const matchedNames = names.filter(name =>
      name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      matchedNames.length > 0
    ) {
      acc[title] = { url, names: matchedNames };
    }

    return acc;
  }, {});

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4 fw-bold" style={{ color: '#005b7f' }}>All Portal Links</h2>

      <div className="mb-3">
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="Search by portal or plan..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="card p-3 shadow-sm">
        {Object.entries(filteredLinkMap).map(([title, { url, names }]) => (
          <div key={title} className="mb-4">
            <a href={url} target="_blank" rel="noopener noreferrer" className="fw-semibold text-primary">
              {title}
            </a>
            <ul className="mb-2 mt-2 ps-3">
              {names.map((descName, i) => {
                const matchedPlan = plans.find(p => p.descriptiveName === descName);
                return (
                  <li
                    key={i}
                    style={{ fontSize: '0.85rem', cursor: 'pointer', color: '#005b7f' }}
                    onClick={() => setSelectedPlan(matchedPlan)}
                  >
                    {descName}
                  </li>
                );
              })}
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

export default AllPortalLinksPage;
