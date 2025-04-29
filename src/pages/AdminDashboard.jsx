import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.put(`${import.meta.env.VITE_API_URL}/api/users/${userId}/approve`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePromote = async (userId) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.put(`${import.meta.env.VITE_API_URL}/api/users/${userId}/promote`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const accessToken = localStorage.getItem('accessToken');
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        fetchUsers();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-5">Loading users...</div>;
  }

  return (
    <div className="container py-5">
      <h2 className="text-center fw-bold mb-4" style={{ color: '#007b9e' }}>
        Admin Dashboard
      </h2>

      <div className="table-responsive">
        <table className="table table-bordered table-striped shadow-sm bg-white rounded-4">
          <thead className="bg-light">
            <tr className="text-center">
              <th>Email</th>
              <th>Status</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="text-center align-middle">
                  <td>{user.email}</td>
                  <td>
                    {user.isApproved ? (
                      <span className="badge bg-success">Approved</span>
                    ) : (
                      <span className="badge bg-warning text-dark">Pending</span>
                    )}
                  </td>
                  <td>
                    {user.isAdmin ? (
                      <span className="badge bg-primary">Admin</span>
                    ) : (
                      <span className="badge bg-secondary">User</span>
                    )}
                  </td>
                  <td className="d-flex justify-content-center gap-2">
                    {!user.isApproved && (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleApprove(user._id)}
                      >
                        Approve
                      </button>
                    )}
                    {!user.isAdmin && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handlePromote(user._id)}
                      >
                        Promote
                      </button>
                    )}
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="text-center mt-4">
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/')}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
