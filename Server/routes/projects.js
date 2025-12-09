const express = require('express');
const router = express.Router();
const { getProjects, createProject } = require('../controllers/projectController');
const auth = require('../middleware/auth');

router.get('/projects', auth, getProjects);
router.post('/createProject', auth, createProject);

module.exports = router;
