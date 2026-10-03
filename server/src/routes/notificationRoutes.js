const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  clearAllNotifications
} = require('../controllers/notificationController');
const authenticateToken = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', getNotifications);
router.patch('/read', markAsRead);
router.delete('/', clearAllNotifications);

module.exports = router;
