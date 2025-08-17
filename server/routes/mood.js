const express = require('express');
const router = express.Router();
const moodController = require('../controllers/moodController');
const { authenticateToken } = require('../middleware/authmiddleware');


// POST /api/mood-log
router.post('/mood-log', moodController.logMood);

// GET /api/mood-log/:userId
router.get('/mood-log', authenticateToken, moodController.getMoodLogs);

module.exports = router;
