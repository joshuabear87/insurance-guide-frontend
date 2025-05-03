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
      const res = await API.get('/users/me');
      setUser(res.data);
    } catch (err) {
      console.error('Error fetching user:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="container mt-5">
      <h2>My Account</h2>
      <div className="card p-4 shadow-sm">
        <p><strong>Name:</strong> {user.username}</p>
        <p><strong>Facility:</strong> {user.facilityName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phoneNumber || 'N/A'}</p>
        <p><strong>Status:</strong> {user.status}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <button className="btn btn-outline-primary mt-3" onClick={() => setShowEditModal(true)}>
          Edit My Info
        </button>
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
