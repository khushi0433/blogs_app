const { Router } = require('express');
const bcrypt = require('bcryptjs');
const { signup, login } = require('../Controllers/auth');

const authRouter = Router();

authRouter.post('/signup', signup);
authRouter.post('/login', login);

module.exports = authRouter;