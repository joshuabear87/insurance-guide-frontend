import React, { useEffect, useState, useContext } from 'react';
import API from '../axios';
import { useSnackbar } from 'notistack'; // Import enqueueSnackbar
import EditUserByAdminModal from './EditUserByAdminModal';
import { FacilityContext } from '../context/FacilityContext';

const facilities = [
  'Saint Agnes Medical Center',
  'Saint Alphonsus Health System'
];

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { enqueueSnackbar } = useSnackbar(); // Initialize enqueueSnackbar
  const { facility, facilityTheme } = useContext(FacilityContext);


  const fetchUsers = async () => {
    try {
      const res = await API.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  const approveUser = async (id) => {
    try {
      // Collect the facilities to approve (e.g., facilities requested by the user)
      const requestedFacility = users.find(user => user._id === id)?.requestedFacility;
      if (!requestedFacility) {
        enqueueSnackbar('No requested facility found for this user.', { variant: 'error' });
        return;
      }

      const approvedFacilities = Array.isArray(requestedFacility) ? requestedFacility : [requestedFacility]; // Ensure it's an array

      // Make the API call with the approved facilities in the request body
      const response = await API.put(`/users/approve/${id}`, { approvedFacilities });
      fetchUsers(); // Refresh the user list after approval
      enqueueSnackbar(response.data.message, { variant: 'success' }); // Show success message
    } catch (err) {
      console.error('Failed to approve user', err);
      enqueueSnackbar('Failed to approve user', { variant: 'error' });
    }
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.npi.includes(query) // You can add more fields to search by
    );
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="card p-3 shadow-lg">
      <h4 className="text-center mb-3 text-blue">User Management</h4>

      {/* Search Bar */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Name, Email, or NPI"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle responsive-table" style={{ fontSize: '0.75rem' }}>
          <thead className="table-primary">
            <tr>
              <th style={{ backgroundColor: facilityTheme.primaryColor, color: 'white' }}>Name</th>
              <th style={{ backgroundColor: facilityTheme.primaryColor, color: 'white' }}>Email</th>
              <th style={{ backgroundColor: facilityTheme.primaryColor, color: 'white', width: '225px' }}>Facility Requested at Registration</th>
              <th style={{ backgroundColor: facilityTheme.primaryColor, color: 'white', width: '200px' }}>Approved Access</th>
              <th style={{ backgroundColor: facilityTheme.primaryColor, color: 'white' }}>Phone</th>
              <th style={{ backgroundColor: facilityTheme.primaryColor, color: 'white' }}>Department</th>
              <th style={{ backgroundColor: facilityTheme.primaryColor, color: 'white' }}>NPI</th>
              <th style={{ backgroundColor: facilityTheme.primaryColor, color: 'white' }}>Status</th>
              <th style={{ backgroundColor: facilityTheme.primaryColor, color: 'white' }}>Role</th>
              <th style={{ backgroundColor: facilityTheme.primaryColor, color: 'white' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u._id} style={{ cursor: 'default' }}>
                <td>{u.firstName} {u.lastName}</td>
                <td>{u.email}</td>
                <td>
  {Array.isArray(u.requestedFacility) && u.requestedFacility.length > 0 ? (
    u.requestedFacility.map((f, i) => (
      <div key={i}>{f}</div>
    ))
  ) : (
    'N/A'
  )}
</td>

                <td>
                  {u.facilityAccess?.map((f) => (
                    <span
                      key={f}
                      className="badge me-1"
                      style={{
                        backgroundColor: f === 'Saint Agnes Medical Center' ? '#005b7f' : '#A30D1D',
                        color: 'white',
                        fontSize: '0.7rem',
                      }}
                    >
                      {f}
                    </span>
                  ))}
                </td>
                <td>{u.phoneNumber || 'N/A'}</td>
                <td>{u.department || 'N/A'}</td>
                <td>{u.npi}</td>
                <td>{formatStatus(u.status)}</td>
                <td>{formatRole(u.role)}</td>
                <td className="text-center align-middle">
  <div className="d-flex flex-column align-items-center gap-1">
    {u.status !== 'approved' && (
      <button
        className="btn btn-success btn-sm fw-semibold px-2 py-1"
        style={{ fontSize: '0.7rem', minWidth: '80px' }}
        onClick={() => approveUser(u._id)}
        disabled={!u.requestedFacility}
      >
        Approve
      </button>
    )}

    {u.role === 'admin' ? (
      <button
        className="btn btn-cancel btn-sm fw-semibold px-2 py-1"
        style={{ fontSize: '0.7rem', minWidth: '80px' }}
        onClick={() => demoteUser(u._id)}
      >
        Demote
      </button>
    ) : (
      <button
        className="btn btn-success btn-sm fw-semibold px-2 py-1"
        style={{ fontSize: '0.7rem', minWidth: '80px' }}
        onClick={() => promoteToAdmin(u._id)}
      >
        Promote
      </button>
    )}

    <button
      className="btn btn-login btn-sm fw-semibold px-2 py-1"
      style={{ fontSize: '0.7rem', minWidth: '80px' }}
      onClick={() => setSelectedUser(u)}
    >
      Edit
    </button>

    <button
      className="btn btn-delete btn-sm fw-semibold px-2 py-1"
      style={{ fontSize: '0.7rem', minWidth: '80px' }}
      onClick={() => deleteUser(u._id)}
    >
      Delete
    </button>
  </div>
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <EditUserByAdminModal
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
