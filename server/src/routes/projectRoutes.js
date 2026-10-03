const express = require('express');
const router = express.Router();
const {
  getAllProjects,
  getProjectById,
  createProject,
  deleteProject
} = require('../controllers/projectController');
const {
  getUpdatesByProject,
  createUpdate
} = require('../controllers/updateController');
const authenticateToken = require('../middleware/auth');
const requireRole = require('../middleware/roles');
const upload = require('../middleware/upload');

router.use(authenticateToken);

// Project endpoints
router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.post('/', requireRole('ADMIN'), createProject);
router.delete('/:id', requireRole('ADMIN'), deleteProject);

// Updates nested under projects
router.get('/:id/updates', getUpdatesByProject);
router.post('/:id/updates', requireRole('TEAM', 'ADMIN'), upload.single('image'), createUpdate);

module.exports = router;
