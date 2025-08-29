import React, { useEffect, useState } from 'react';
import api from '../api';

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [err, setErr] = useState('');
  const [form, setForm] = useState({ title: '', text: '' });

  const load = async () => {
    try {
      const { data } = await api.get('/posts/all');
      setPosts(data);
    } catch {
      setErr('Failed to load posts');
    }
  };

  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    try {
      await api.post('/posts', form);
      setForm({ title: '', text: '' });
      load();
    } catch {
      setErr('Failed to create post (admin required)');
    }
  };

  const del = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      load();
    } catch {
      setErr('Failed to delete post');
    }
  };

  const toggle = async (id, isPublished) => {
    try {
      await api.post(`/posts/${id}/${isPublished ? 'setprivate' : 'setpublic'}`);
      load();
    } catch {
      setErr('Failed to toggle visibility');
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Admin Posts</h2>
      {err && <div style={{ color: 'crimson' }}>{err}</div>}
      <form onSubmit={create} style={{ display: 'grid', gap: 8, marginBottom: 16 }}>
        <input placeholder="title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <textarea placeholder="text" value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} />
        <button>Create</button>
      </form>

      <div style={{ display: 'grid', gap: 12 }}>
        {posts.map(p => (
          <div key={p.id} style={{ border: '1px solid #eee', padding: 12 }}>
            <h4>{p.title}</h4>
            <div>Status: {p.isPublished ? 'Public' : 'Private'}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button onClick={() => toggle(p.id, p.isPublished)}>{p.isPublished ? 'Make Private' : 'Make Public'}</button>
              <button onClick={() => del(p.id)} style={{ color: 'crimson' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}