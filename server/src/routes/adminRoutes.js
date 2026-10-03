const express = require('express');
const router = express.Router();
const { getAdminStats } = require('../controllers/adminController');
const authenticateToken = require('../middleware/auth');
const requireRole = require('../middleware/roles');

router.use(authenticateToken);
router.use(requireRole('ADMIN'));

router.get('/stats', getAdminStats);

module.exports = router;
