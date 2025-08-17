process.on('unhandledRejection', (reason, promise) => {
  console.error('🛑 Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('🛑 Uncaught Exception:', err);
});
require('dotenv').config(); // ⬅️ Load environment variables first
const express = require('express');
const cors = require('cors');
const app = express();

const authRoutes = require('./routes/auth');
const moodRoutes = require('./routes/mood');
const chatRoutes = require('./routes/chatRoutes');

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', chatRoutes);  // ⬅️ Includes /api/chat route
app.use('/api', moodRoutes);



const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
