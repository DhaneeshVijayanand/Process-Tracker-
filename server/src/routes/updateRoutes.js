const express = require('express');
const router = express.Router();
const {
  toggleReaction,
  addComment
} = require('../controllers/interactionController');
const authenticateToken = require('../middleware/auth');

router.use(authenticateToken);

router.post('/:id/react', toggleReaction);
router.post('/:id/comments', addComment);

module.exports = router;
