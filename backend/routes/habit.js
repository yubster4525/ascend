const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createHabit, getHabits } = require('../controllers/habitController');

router.post('/', authMiddleware, createHabit);
router.get('/', authMiddleware, getHabits);

module.exports = router;