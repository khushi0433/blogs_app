require('dotenv').config();
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const { createUser, getUserById, getUserByUsername } = require('../models/db');

async function signup(req, res) {
  if (req.body && req.body.username && req.body.password) {
    try {
      const hashedPass = await bcrypt.hash(req.body.password, 10);
      const user = await createUser(req.body.username, hashedPass);
      const token = jsonwebtoken.sign(
        { id: user.id, username: user.username, isAdmin: user.isAdmin },
        process.env.SECRET,
        { expiresIn: '1d' }
      );
      res.json({ token });
    } catch (error) {
      console.log(error);
      res.status(409).json({ error: 'username already taken Choose something else' });
    }
  } else {
    res.status(400).json({ error: 'Bad Request: Missing require fields' });
  }
}

async function auth(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
  const token = authHeader.split(' ')[1];

  jsonwebtoken.verify(token, process.env.SECRET, function (error, decoded) {
    if (error) return res.status(403).json({ error: "Forbidden: You don't have permission" });
    req.user = decoded;
    next();
  });
}

async function isAdmin(req, res, next) {
  if (req.user && req.user.isAdmin) return next();
  res.status(403).json({ error: "Forbidden: You don't have permission" });
}

async function login(req, res) {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'Bad Request: Missing required fields' });

  try {
    const user = await getUserByUsername(username);
    if (!user) return res.status(403).json({ error: "Forbidden: You don't have permission" });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(403).json({ error: "Forbidden: You don't have permission" });

    const token = jsonwebtoken.sign(
      { id: user.id, username: user.username, isAdmin: user.isAdmin },
      process.env.SECRET,
      { expiresIn: '1d' }
    );
    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Database Error' });
  }
}

module.exports = { signup, auth, isAdmin, login };