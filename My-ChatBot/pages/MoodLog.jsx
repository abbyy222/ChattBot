import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function MoodLogger() {
  const [mood, setMood] = useState('');
  const [note, setNote] = useState('');
  const [listening, setListening] = useState(false);
  const [logs, setLogs] = useState([]);
  const recognitionRef = useRef(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setNote((prev) => prev + ' ' + transcript);
      };

      recognition.onend = () => setListening(false);
      recognitionRef.current = recognition;
    } else {
      alert("Your browser doesn't support voice input.");
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      setListening(true);
      recognitionRef.current.start();
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/mood-log', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLogs(res.data.logs || []);
    } catch (err) {
      console.error('❌ Error fetching mood logs:', err);
    }
  };

  const submitMood = async () => {
    if (!mood.trim()) return alert("Please select a mood.");
    try {
      await axios.post(
        'http://localhost:5000/api/mood-log',
        { mood, note },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("✅ Mood saved successfully!");
      setMood('');
      setNote('');
      fetchLogs();
    } catch (err) {
      alert("Failed to save mood log.");
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-100 via-purple-200 to-purple-300 p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-2xl p-8"
      >
        <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center drop-shadow">
          🌈 Log Your Mood
        </h2>

        <label className="block text-gray-700 font-semibold mb-1">Your Mood</label>
        <select
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          className="w-full p-3 mb-6 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Select a mood...</option>
          <option value="Happy">😊 Happy</option>
          <option value="Sad">😢 Sad</option>
          <option value="Anxious">😰 Anxious</option>
          <option value="Angry">😡 Angry</option>
          <option value="Neutral">😐 Neutral</option>
        </select>

        <label className="block text-gray-700 font-semibold mb-1">Describe how you feel</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Type or use voice to describe how you're feeling..."
          rows="4"
          className="w-full p-4 mb-6 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
        ></textarea>

        <div className="flex justify-between items-center mb-8">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={startListening}
            className={`px-5 py-2 rounded-lg text-white font-medium shadow-md transition-all duration-300 ${listening ? 'bg-blue-400 animate-pulse' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            🎤 {listening ? 'Listening...' : 'Record Voice'}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={submitMood}
            className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-lg shadow-md"
          >
            Save Mood Log
          </motion.button>
        </div>

        <h3 className="text-xl font-semibold text-purple-600 mb-4">📜 Mood History</h3>
        <div className="space-y-4 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300">
          {logs.length === 0 && (
            <p className="text-gray-500 text-sm">No mood logs found yet.</p>
          )}
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="border border-purple-200 rounded-lg p-4 bg-purple-50 shadow-sm"
            >
              <div className="font-medium text-purple-700">Mood: {log.mood}</div>
              {log.note && <div className="text-gray-700">Note: {log.note}</div>}
              <div className="text-xs text-gray-500 mt-1">
                {new Date(log.createdAt).toLocaleString()}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
