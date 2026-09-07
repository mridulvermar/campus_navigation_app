const express = require('express');
const router = express.Router();
const { chat, getSuggestedQuestions, getStats } = require('../controllers/ragController');

// RAG Chatbot routes
router.post('/chat', chat);
router.post('/', chat); // support POST /api/chat directly
router.get('/suggested', getSuggestedQuestions);
router.get('/stats', getStats);

module.exports = router;
