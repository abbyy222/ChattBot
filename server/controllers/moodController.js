const { MoodLog } = require('../models');

exports.logMood = async (req, res) => {
  try {
     const { mood, note } = req.body;
     const userId = req.user.userId; // From JWT middleware


    const newLog = await MoodLog.create({
      userId,
      mood,
      note
    });

    res.status(201).json({ message: 'Mood logged successfully', log: newLog });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMoodLogs = async (req, res) => {
  try {
    const userId = req.user.userId;


    const logs = await MoodLog.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });

    res.json({ logs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

