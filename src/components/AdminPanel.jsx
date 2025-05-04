import React, { useEffect, useState } from 'react';
import API from '../axios';
import EditMyInfoModal from './EditMyInfoModal';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

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

  const demoteUser = async (id) => {
    await API.put(`/users/demote/${id}`);
    fetchUsers();
  };

  const deleteUser = async (id) => {
    if (window.confirm('Delete this user?')) {
      await API.delete(`/users/${id}`);
      fetchUsers();
    }
  };

  const formatRole = (role) => (role === 'admin' ? 'Administrator' : 'User');
  const formatStatus = (status) => (status === 'approved' ? 'Approved' : 'Pending');

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="card p-3 shadow-sm">
      <h4 className="fw-bold text-center mb-3" style={{ color: '#005b7f' }}>User Management</h4>
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle responsive-table" style={{ fontSize: '0.75rem' }}>
          <thead className="table-primary">
            <tr>
              <th style={{ backgroundColor: '#005b7f', color: 'white' }}>Name</th>
              <th style={{ backgroundColor: '#005b7f', color: 'white' }}>Email</th>
              <th style={{ backgroundColor: '#005b7f', color: 'white' }}>Facility</th>
              <th style={{ backgroundColor: '#005b7f', color: 'white' }}>Phone</th>
              <th style={{ backgroundColor: '#005b7f', color: 'white' }}>Department</th>
              <th style={{ backgroundColor: '#005b7f', color: 'white' }}>NPI</th>
              <th style={{ backgroundColor: '#005b7f', color: 'white' }}>Status</th>
              <th style={{ backgroundColor: '#005b7f', color: 'white' }}>Role</th>
              <th style={{ backgroundColor: '#005b7f', color: 'white' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} style={{ cursor: 'default' }}>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.facilityName}</td>
                <td>{u.phoneNumber || 'N/A'}</td>
                <td>{u.department || 'N/A'}</td>
                <td>{u.npi}</td>
                <td>{formatStatus(u.status)}</td>
                <td>{formatRole(u.role)}</td>
                <td>
                  {u.status !== 'approved' && (
                    <button className="btn btn-success btn-sm fw-semibold px-2 py-1 me-1" style={{ fontSize: '0.75rem', minWidth: '72px' }} onClick={() => approveUser(u._id)}>
                      Approve
                    </button>
                  )}
                  {u.role === 'admin' ? (
                    <button className="btn btn-secondary btn-sm fw-semibold px-2 py-1 me-1" style={{ fontSize: '0.75rem', minWidth: '72px' }} onClick={() => demoteUser(u._id)}>
                      Demote
                    </button>
                  ) : (
                    <button className="btn btn-warning btn-sm fw-semibold px-2 py-1 me-1" style={{ fontSize: '0.75rem', minWidth: '72px' }} onClick={() => promoteToAdmin(u._id)}>
                      Promote
                    </button>
                  )}
                  <button className="btn btn-primary btn-sm fw-semibold px-2 py-1 me-1" style={{ fontSize: '0.75rem', minWidth: '72px' }} onClick={() => setSelectedUser(u)}>
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm fw-semibold px-2 py-1" style={{ fontSize: '0.75rem', minWidth: '72px' }} onClick={() => deleteUser(u._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <EditMyInfoModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSave={() => {
            fetchUsers();
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminPanel;
