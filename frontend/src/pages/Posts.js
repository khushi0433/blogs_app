import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/posts');
        setPosts(data);
      } catch (e) {
        setErr(e?.response?.data?.error || 'Failed to load posts');
      }
    })();
  }, []);

  if (err) return <div style={{ color: 'crimson' }}>{err}</div>;

  return (
    <div style={{ padding: 16 }}>
      <h2>Public Posts</h2>
      <div style={{ display: 'grid', gap: 12 }}>
        {posts.map(p => (
          <div key={p.id} style={{ border: '1px solid #eee', padding: 12 }}>
            <h4>{p.title}</h4>
            <p>{(p.text || '').slice(0, 140)}...</p>
            <div>By: {p.author?.username}</div>
            <Link to={`/post/${p.id}`}>Open</Link>
          </div>
        ))}
      </div>
    </div>
  );
}