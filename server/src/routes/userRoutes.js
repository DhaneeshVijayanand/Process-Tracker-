const express = require('express');
const router = express.Router();
const { getAllUsers, createUser, deleteUser } = require('../controllers/userController');
const authenticateToken = require('../middleware/auth');
const requireRole = require('../middleware/roles');

// All user management routes require ADMIN role
router.use(authenticateToken);
router.use(requireRole('ADMIN'));

router.get('/', getAllUsers);
router.post('/', createUser);
router.delete('/:id', deleteUser);

module.exports = router;
