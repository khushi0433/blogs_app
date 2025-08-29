import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

export default function Post() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const [err, setErr] = useState('');

  const load = async () => {
    try {
      const { data } = await api.get(`/posts/${id}`);
      setPost(data);
    } catch {
      setErr('Failed to load post');
    }
  };

  useEffect(() => { load(); }, [id]);

  const addComment = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await api.post(`/comment?postid=${id}`, { comment });
      setComment('');
      load();
    } catch {
      setErr('Failed to add comment (login required?)');
    }
  };

  if (err) return <div style={{ color: 'crimson' }}>{err}</div>;
  if (!post) return <div style={{ padding: 16 }}>Loading...</div>;

  return (
    <div style={{ padding: 16 }}>
      <h2>{post.title}</h2>
      <div style={{ marginBottom: 12, color: '#666' }}>By: {post.author?.username}</div>
      <div style={{ marginBottom: 24 }}>{post.text}</div>

      <h4>Comments</h4>
      {(post.comments || []).map(c => (
        <div key={c.id} style={{ borderTop: '1px solid #eee', padding: '8px 0' }}>
          <div style={{ color: '#555' }}>{c.commenter?.username}</div>
          <div>{c.comment}</div>
        </div>
      ))}

      <form onSubmit={addComment} style={{ display: 'grid', gap: 8, marginTop: 12 }}>
        <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Write a comment..." />
        <button>Add Comment</button>
      </form>
    </div>
  );
}