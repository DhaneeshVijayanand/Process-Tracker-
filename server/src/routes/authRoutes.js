const express = require('express');
const router = express.Router();
const { login, me, changePassword } = require('../controllers/authController');
const authenticateToken = require('../middleware/auth');
const { loginLimiter } = require('../middleware/rateLimiter');

router.post('/login', loginLimiter, login);
router.get('/me', authenticateToken, me);
router.post('/change-password', authenticateToken, changePassword);

module.exports = router;
