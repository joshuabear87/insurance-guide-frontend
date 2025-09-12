import { useEffect, useState } from 'react';
import API from '../../../api/axios';
import InsurancePlanModalContent from '../../plans/context/InsurancePlanModalContent';
import Spinner from '../../components/common/Spinner';
import { ensureHttps } from '../../../utils/urlHelpers';

const AllPortalLinksPage = () => {
  const [linkMap, setLinkMap] = useState({});
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

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
      } finally {
        setTimeout(() => setLoading(false), 400); // Smooth transition
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center m-5">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4 text-blue">Insurance Web Portals</h2>

      <div className="mb-3">
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="Search by portal or plan..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="card p-3 shadow-lg">
        {Object.entries(filteredLinkMap).map(([title, { url, names }]) => (
          <div key={title} className="mb-4">
            <a
              href={ensureHttps(url)} // ✅ Ensure HTTPS applied here
              target="_blank"
              rel="noopener noreferrer"
              className="fw-semibold text-blue"
            >
              {title}
            </a>
            <ul className="mb-2 mt-2 ps-3">
              {names.map((descName, i) => {
                const matchedPlan = plans.find(p => p.descriptiveName === descName);
                return (
                  <li
                    key={i}
                    style={{ fontSize: '0.85rem', cursor: 'pointer', color: 'black' }}
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
