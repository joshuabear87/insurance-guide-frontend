import React, { useEffect, useState } from 'react';
import API from '../axios';
import Spinner from '../components/Spinner';
import AdminPanel from '../components/AdminPanel';
import EditMyInfoModal from '../components/EditMyInfoModal';

const MyAccountPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await API.get('/auth/me');
      setUser(res.data);
    } catch (err) {
      console.error('Error fetching user:', err);
    } finally {
      // Delay to smooth transition
      setTimeout(() => setLoading(false), 400);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const formatRole = (role) => {
    return role === 'admin' ? 'Administrator' : 'User';
  };

  const formatStatus = (status) => {
    return status === 'approved' ? 'Approved' : 'Pending';
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center m-5">
        <Spinner />
      </div>
    );
  }

  if (!user) return <p className="text-danger text-center">⚠️ Unable to load user profile.</p>;

  return (
    <div className="container py-4">
      <div className="card shadow-lg p-4" style={{ maxWidth: '700px', margin: '0 auto', fontSize: '0.85rem' }}>
        <h2 className="text-center mb-4 text-blue">My Account</h2>
        <div className="row g-4">
          <div className="col-md-6">
            <div className="mb-3">
              <strong>Name:</strong>
              <div className="text-muted">{user.firstName} {user.lastName}</div> {/* Display first and last name */}
            </div>
            <div className="mb-3">
              <strong>Approved Facilities:</strong>
              <ul className="text-muted ps-3">
                {user.facilityAccess?.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            </div>
            <div className="mb-3">
              <strong>Department:</strong>
              <div className="text-muted">{user.department || 'N/A'}</div>
            </div>
            <div className="mb-3">
              <strong>NPI:</strong>
              <div className="text-muted">{user.npi}</div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <strong>Email:</strong>
              <div className="text-muted">{user.email}</div>
            </div>
            <div className="mb-3">
              <strong>Phone:</strong>
              <div className="text-muted">{user.phoneNumber}</div>
            </div>
            <div className="mb-3">
              <strong>Status:</strong>
              <div className="text-muted">{formatStatus(user.status)}</div>
            </div>
            <div className="mb-3">
              <strong>Role:</strong>
              <div className="text-muted">{formatRole(user.role)}</div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center mt-4">
          <button
            className="btn btn-login"
            style={{
              backgroundColor: '#005b7f',
              color: 'white',
              fontSize: '0.75rem',
              borderRadius: '5px',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
              minWidth: '120px'
            }}
            onClick={() => setShowEditModal(true)}
          >
            Edit My Info
          </button>
        </div>
      </div>

      {user.role === 'admin' && (
        <div className="mt-5">
          <AdminPanel />
        </div>
      )}

      {showEditModal && (
        <EditMyInfoModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onSave={fetchUser}
        />
      )}
    </div>
  );
};

export default MyAccountPage;
