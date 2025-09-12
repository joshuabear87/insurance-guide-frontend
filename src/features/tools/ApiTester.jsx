import { useMemo, useState } from 'react';
import API from '../../api/axios';

function decodeJwt(token) {
  if (!token) return null;
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

const Row = ({ children }) => <div className="mb-3">{children}</div>;

export default function ApiTester() {
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState(null);
  const [err, setErr] = useState(null);

  const token = localStorage.getItem('accessToken') || '';
  const activeFacility = localStorage.getItem('activeFacility') || '';
  const claims = useMemo(() => decodeJwt(token), [token]);

  const call = async (fn) => {
    setBusy(true);
    setOk(null);
    setErr(null);
    try {
      const res = await fn();
      setOk(res?.data ?? res);
    } catch (e) {
      setErr({
        status: e?.response?.status,
        data: e?.response?.data,
        message: e?.message,
      });
    } finally {
      setBusy(false);
    }
  };

  const createPortal = async () => {
    const name = `AVAILITY-${Date.now()}`;
    return API.post('/hub/portals', {
      name,
      url: 'https://www.availity.com',
      notes: 'Created from API Tester',
      isActive: true,
    });
  };

  const json = (obj) =>
    <pre className="bg-light p-3 rounded border small overflow-auto" style={{maxHeight: 360}}>
      {JSON.stringify(obj, null, 2)}
    </pre>;

  return (
    <div className="container py-4">
      <h2 className="mb-2">API Tester</h2>
      <p className="text-muted">
        Quick buttons to hit your backend with your current session. No tokens to copy.
      </p>

      <div className="card mb-4">
        <div className="card-body">
          <Row>
            <strong>VITE_API_URL:</strong> {import.meta.env.VITE_API_URL || '(not set)'}
          </Row>
          <Row>
            <strong>Active Facility:</strong> {activeFacility || '—'}
          </Row>
          <Row>
            <strong>Access token:</strong>{' '}
            {token ? `${token.slice(0, 14)}…${token.slice(-12)} (len ${token.length})` : '—'}
          </Row>
          <Row>
            <div className="row">
              <div className="col-md-6">
                <div className="fw-semibold">Decoded claims</div>
                {claims ? json({
                  email: claims.email,
                  role: claims.role,
                  expISO: claims.exp ? new Date(claims.exp * 1000).toISOString() : null,
                  activeFacility: claims.activeFacility,
                  facilityAccess: claims.facilityAccess,
                }) : <div className="text-muted">No/invalid token</div>}
              </div>
            </div>
          </Row>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="mb-3">Auth</h5>
          <div className="d-flex flex-wrap gap-2">
            <button className="btn btn-outline-primary" disabled={busy}
              onClick={() => call(() => API.get('/auth/validate-token'))}>
              Validate Token
            </button>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="mb-3">Hub (GET = any user)</h5>
          <div className="d-flex flex-wrap gap-2">
            <button className="btn btn-secondary" disabled={busy} onClick={() => call(() => API.get('/hub/portals'))}>GET /hub/portals</button>
            <button className="btn btn-secondary" disabled={busy} onClick={() => call(() => API.get('/hub/contacts'))}>GET /hub/contacts</button>
            <button className="btn btn-secondary" disabled={busy} onClick={() => call(() => API.get('/hub/addresses'))}>GET /hub/addresses</button>
            <button className="btn btn-secondary" disabled={busy} onClick={() => call(() => API.get('/hub/payers'))}>GET /hub/payers</button>
            <button className="btn btn-secondary" disabled={busy} onClick={() => call(() => API.get('/hub/plan-codes'))}>GET /hub/plan-codes</button>
          </div>
          <div className="mt-3">
            <h6 className="mb-2">Admin-only (POST)</h6>
            <div className="d-flex flex-wrap gap-2">
              <button className="btn btn-primary" disabled={busy} onClick={() => call(createPortal)}>
                POST /hub/portals (create sample)
              </button>
            </div>
          </div>
        </div>
      </div>

      {busy && <div className="alert alert-info">Working…</div>}
      {ok && (
        <div className="alert alert-success">
          <div className="fw-semibold mb-2">Success</div>
          {json(ok)}
        </div>
      )}
      {err && (
        <div className="alert alert-danger">
          <div className="fw-semibold mb-2">Error</div>
          {json(err)}
        </div>
      )}
    </div>
  );
}
