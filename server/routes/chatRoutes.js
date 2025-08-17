const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authmiddleware');
const chatController = require('../controllers/chatController');

// Chat interaction
router.post('/chat', chatController.sendChatMessage);

// Save a chat session
router.post('/save-chat', authenticateToken, chatController.saveChat);

// Fetch all user chats
router.get('/my-chats', authenticateToken, chatController.getUserChats);

// Fetch individual chat
router.get('/chat/:id', authenticateToken, chatController.getSingleChat);

module.exports = router;
