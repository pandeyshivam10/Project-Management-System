const express = require('express');
const router = express.Router();
const { requestAccess, handleRequest } = require('../controllers/requestController');
const auth = require('../middleware/auth');

router.post('/requestAccess', auth, requestAccess);
router.post('/handleRequest', auth, handleRequest);

module.exports = router;
