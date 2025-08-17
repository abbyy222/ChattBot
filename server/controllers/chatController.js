console.log('🔐 OpenRouter Key:', process.env.OPENROUTER_API_KEY);
const { Chat } = require('../models');
const axios = require('axios');

// 4-second delay helper
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let lastRequestTime = 0;

exports.sendChatMessage = async (req, res) => {
  const userMessage = req.body.message;

  // Rate-limit: check if 4 seconds have passed
  const now = Date.now();
  if (now - lastRequestTime < 4000) {
    const waitTime = 4000 - (now - lastRequestTime);
    console.log(`⏳ Waiting ${waitTime}ms before sending...`);
    await delay(waitTime);
  }

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
       model: 'anthropic/claude-3-haiku', // or claude-3-haiku
        messages: [
          {
            role: 'system',
               content: `You are a compassionate mental health support chatbot named PaddiMi.
You are not a licensed therapist, but you provide emotional comfort, thoughtful questions, and helpful suggestions.

You understand and respond in both English and Nigerian Pidgin, depending on how the user speaks. If the user writes in Pidgin, reply in Pidgin. If they speak in English, reply in English. If they mix both, you can blend naturally.

You listen actively, respond kindly, and reflect what the user says to show understanding. 
You can ask gentle follow-up questions, help the user explore their feelings, and suggest healthy coping strategies.

If the user is in serious distress (e.g., mentions suicide or harm), encourage them to seek professional help, but otherwise, stay present and supportive in conversation.

Respond in a natural, conversational way — like you're talking to a trusted friend. Do not describe your tone or emotions with asterisks. Just speak normally.`

},
          {
            role: 'user',
            content: userMessage,
          },
        ],
      },
      {
        headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:5173',
          'Content-Type': 'application/json'
        }

      }
    );

    lastRequestTime = Date.now(); // update timestamp

    const botReply = response.data.choices[0].message.content;
    res.json({ reply: botReply });
  } catch (error) {
    console.error('🔥 Error from OpenRouter:', error.response?.data || error.message);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
};

exports.saveChat = async (req, res) => {
  try {
    const pseudonym = req.user.pseudonym;
    const { messages, chatId } = req.body;

    const firstMsg = messages.find(m => m.sender === 'user')?.text || '';
    const title = `${new Date().toLocaleDateString()} – ${firstMsg.slice(0, 20)}...`;

      if (chatId) {
      // 🛠 Update existing chat
      const chat = await Chat.findByPk(chatId);
      if (chat && chat.pseudonym === pseudonym) {
        chat.messages = JSON.stringify(messages);
        await chat.save();
        return res.json({ message: '✅ Chat updated', chatId: chat.id });
      }
    }

    await Chat.create({
      pseudonym,
      title,
      messages: JSON.stringify(messages),
    });

    res.json({ message: '✅ Chat saved!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save chat' });
  }
};

// Get all chats for logged-in user
exports.getUserChats = async (req, res) => {
  try {
    const pseudonym = req.user.pseudonym;

    const chats = await Chat.findAll({
      where: { pseudonym },
      order: [['createdAt', 'DESC']]
    });

    res.json(chats.map(chat => ({
      id: chat.id,
      title: chat.title,
      createdAt: chat.createdAt
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
};

// Get one specific chat
exports.getSingleChat = async (req, res) => {
  try {
    const chat = await Chat.findByPk(req.params.id);

    if (!chat || chat.pseudonym !== req.user.pseudonym) {
      return res.status(404).json({ error: 'Chat not found or unauthorized' });
    }

    res.json({
      ...chat.dataValues,
      messages: JSON.parse(chat.messages)
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch chat' });
  }
};
