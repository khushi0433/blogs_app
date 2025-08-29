import React, { Children } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Posts from './pages/Posts';
import Post from './pages/Post';
import AdminPosts from './pages/AdminPosts';
import Users from './pages/Users';

const isAuthed = () => !!localStorage.getItem('token');
const isAdmin = () => localStorage.getItem('isAdmin') === 'true';

const Protected = ({ children }) => (isAuthed() && isAdmin() ? children: <Navigate to='/' />);
const AdminOnly = ({ children }) => (isAuthed() && isAdmin() ? children: <Navigate to="/" />);

export default function App() {
  return (
    <Router>
            <nav style={{ display: 'flex', gap: 12, padding: 12, borderBottom: '1px solid #eee' }}>
              <Link to='/'>Posts</Link>
              {isAdmin() && <Link to='/admin/posts'>Admin Posts</Link> }
              {isAdmin() && <Link to="/admin/users">Users</Link>}
              {!isAuthed() ? <Link to="/login">Login</Link> : 
              <a href="/" onClick={() => { localStorage.clear(); window.location.href='/' }}>Logout</a>}
              </nav>
              <Routes>
                <Route path='/' element={<Posts/>} />
                <Route path='/posts/:id' element={<Post />} />
                <Route path='/login' element={<Login />} />
                <Route path="/admin/posts" element={<Protected><AdminOnly><AdminPosts /></AdminOnly></Protected>} />
                <Route path="/admin/users" element={<Protected><AdminOnly><Users /></AdminOnly></Protected>} />
              </Routes>
    </Router>
  );
}