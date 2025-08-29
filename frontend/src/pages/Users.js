import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState('');

  const load = async () => {
    try {
      const { data } = await api.get('/user');
      setUsers(data);
    } catch {
      setErr('Failed to load users (admin required)');
    }
  };

  useEffect(() => { load(); }, []);

  const makeAdmin = async (id) => {
    try {
      await api.put(`/user/${id}/makeAdmin`);
      load();
    } catch {
      setErr('Failed to make admin');
    }
  };

  const del = async (id) => {
    try {
      await api.delete(`/user/${id}`);
      load();
    } catch {
      setErr('Failed to delete user');
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Users</h2>
      {err && <div style={{ color: 'crimson' }}>{err}</div>}
      <div style={{ display: 'grid', gap: 12 }}>
        {users.map(u => (
          <div key={u.id} style={{ border: '1px solid #eee', padding: 12 }}>
            <div>{u.username} {u.isAdmin ? '(admin)' : ''}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              {!u.isAdmin && <button onClick={() => makeAdmin(u.id)}>Make Admin</button>}
              <button onClick={() => del(u.id)} style={{ color: 'crimson' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}