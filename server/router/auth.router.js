const express = require('express');

// Controllers
const { signup, login, verifyEmail, autoLogin, logout } = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

const authRouter = express.Router();

authRouter.post('/signup', signup);
authRouter.post('/login', login);
authRouter.post('/auto-login', protect, autoLogin);
authRouter.post('/logout', protect, logout);

authRouter.get('/verify/:code', verifyEmail);


module.exports = authRouter;