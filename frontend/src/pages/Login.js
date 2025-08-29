import React, { useState } from 'react';
import api from '../api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const { data } = await api.post('/auth/login', { username, password });
      const token = typeof data === 'string' ? data : data.token;
      if (!token) throw new Error('No token returned');
      // decode-lite: hit /user/me if you add it; or store isAdmin if you return it
      // quick option: parse JWT payload
      const payload = JSON.parse(atob(token.split('.')[1]));
      localStorage.setItem('token', token);
      localStorage.setItem('isAdmin', String(!!payload.isAdmin));
      window.location.href = '/';
    } catch (e2) {
      setErr(e2?.response?.data?.error || 'Login failed');
    }
  };

  return (
    <form onSubmit={submit} style={{ maxWidth: 360, margin: '48px auto', display: 'grid', gap: 12 }}>
      <h3>Login</h3>
      {err && <div style={{ color: 'crimson' }}>{err}</div>}
      <input placeholder="username" value={username} onChange={e => setUsername(e.target.value)} />
      <input placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button>Login</button>
    </form>
  );
}