// src/components/AdminPanel.jsx
import React, { useEffect, useState } from 'react';
import API from '../axios';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  const approveUser = async (id) => {
    await API.put(`/users/approve/${id}`);
    fetchUsers();
  };

  const promoteToAdmin = async (id) => {
    await API.put(`/users/make-admin/${id}`);
    fetchUsers();
  };

  const deleteUser = async (id) => {
    if (window.confirm('Delete this user?')) {
      await API.delete(`/users/${id}`);
      fetchUsers();
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="card p-3 shadow-sm">
      <h4>User Management</h4>
      <div className="table-responsive mt-3">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Facility</th>
              <th>Status</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.facilityName}</td>
                <td>{u.status}</td>
                <td>{u.role}</td>
                <td>
                  {u.status !== 'approved' && (
                    <button className="btn btn-success btn-sm me-1" onClick={() => approveUser(u._id)}>
                      Approve
                    </button>
                  )}
                  {u.role !== 'admin' && (
                    <button className="btn btn-warning btn-sm me-1" onClick={() => promoteToAdmin(u._id)}>
                      Promote
                    </button>
                  )}
                  <button className="btn btn-danger btn-sm" onClick={() => deleteUser(u._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
