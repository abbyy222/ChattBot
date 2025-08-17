import { useState, useEffect } from 'react';
import axios from 'axios';
import VoiceInput from '../pages/VoiceInput';
import { motion } from 'framer-motion';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedChats, setSavedChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [pseudonym, setPseudonym] = useState('');
  const token = localStorage.getItem('token');
  const [voiceEnabled, setVoiceEnabled] = useState(true); // toggle control

const speakText = (text) => {
  if (!voiceEnabled || !window.speechSynthesis) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 1; // speed
  utterance.pitch = 1; // tone
  window.speechSynthesis.speak(utterance);
};


  const fetchSavedChats = () => {
    if (!token) return;
    axios
      .get('http://localhost:5000/api/my-chats', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setSavedChats(res.data))
      .catch((err) => console.error('❌ Error fetching saved chats:', err));
  };

  useEffect(() => {
    const saved = localStorage.getItem('chat-history');
    if (saved) setMessages(JSON.parse(saved));
    else
      setMessages([
        {
          sender: 'bot',
          text: "👋 Hi there! I'm here to support you. How are you feeling today?",
        },
      ]);
    setPseudonym(localStorage.getItem('pseudonym') || '');
    fetchSavedChats();
  }, []);

  useEffect(() => {
    localStorage.setItem('chat-history', JSON.stringify(messages));
  }, [messages]);

const handleSend = async () => {
  if (!input.trim()) return;

  const userMessage = { sender: 'user', text: input };

  setMessages((prev) => [...prev, userMessage]);
  setInput('');
  setLoading(true);

  try {
    const res = await axios.post('http://localhost:5000/api/chat', {
      message: input,
    });

    const botMessage = { sender: 'bot', text: res.data.reply };

    // 👇 Update messages state *and* use for save payload
    const updatedMessages = [...messages, userMessage, botMessage];
   setMessages(updatedMessages);
   speakText(botMessage.text); // 🗣 Speak bot reply


    // 👇 Save chat with current or new chatId
    const saveRes = await axios.post(
      'http://localhost:5000/api/save-chat',
      {
        messages: updatedMessages,
        chatId: currentChatId,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    // ✅ Update currentChatId if it was a new chat
    if (!currentChatId && saveRes.data.chatId) {
      setCurrentChatId(saveRes.data.chatId);
    }

    // ✅ Refresh sidebar
    fetchSavedChats();

  } catch (err) {
    console.error('❌ Error saving chat:', err.response?.data || err.message);
    setMessages((prev) => [
      ...prev,
      {
        sender: 'bot',
        text: "😔 I'm having trouble replying right now. Please try again later.",
      },
    ]);
  }

  setLoading(false);
};


  const handleVoice = (transcript) => {
    setInput(transcript);
  };

  const loadChatById = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/chat/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data.messages);
      setCurrentChatId(id);
    } catch (err) {
      console.error('❌ Error loading chat:', err);
    }
  };

  const startNewChat = () => {
    setMessages([
      {
        sender: 'bot',
        text: "👋 Hi there! I'm here to support you. How are you feeling today?",
      },
    ]);
    setCurrentChatId(null);
  };

  return (
    <div className="relative min-h-screen w-full flex">
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        showArrows={false}
        interval={10000}
        className="absolute inset-0 z-0"
      >
        <div>
          <img src="/bg1.jpg" alt="bg1" className="h-screen w-full object-cover" />
        </div>
        <div>
          <img src="/bg2.jpg" alt="bg2" className="h-screen w-full object-cover" />
        </div>
        <div>
          <img src="/bg3.jpg" alt="bg3" className="h-screen w-full object-cover" />
        </div>
      </Carousel>

      {/* Sidebar */}
      <div className="z-20 w-64 bg-white/80 backdrop-blur-md p-4 shadow-lg overflow-y-auto">
        <div className="text-sm text-gray-700 font-medium mb-4">👤 Pseudonym: {pseudonym}</div>
        <button
         onClick={() => setVoiceEnabled((prev) => !prev)}
         className={`text-xs px-2 py-1 rounded ${
          voiceEnabled ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-800'
         }`}
         >
    🔊 {voiceEnabled ? 'Voice ON' : 'Voice OFF'}
  </button>

        <h2 className="text-lg font-semibold text-purple-800 mb-2">📁 My Chats</h2>
        <button
          onClick={startNewChat}
          className="mb-4 bg-purple-600 text-white py-1 px-2 rounded hover:bg-purple-700 text-sm w-full"
        >
          ➕ New Chat
        </button>

        {savedChats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => loadChatById(chat.id)}
            className={`text-left w-full mb-2 p-2 rounded text-sm ${
              currentChatId === chat.id
                ? 'bg-purple-700 text-white font-semibold'
                : 'bg-purple-100 hover:bg-purple-200'
            }`}
          >
            {chat.title.length > 40 ? chat.title.slice(0, 40) + '…' : chat.title}
            <div className="text-xs text-gray-600">
              {new Date(chat.createdAt).toLocaleString()}
            </div>
          </button>
        ))}
      </div>

      {/* Chat Interface */}
      <div className="z-20 flex-1 px-4 py-6">
        <motion.div
          className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 flex flex-col gap-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-purple-800 text-center drop-shadow">
            🧠 Emotional Support Chatbot
          </h1>

          <div className="h-96 overflow-y-auto p-3 border border-purple-200 rounded bg-purple-100/50">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                className={`mb-2 flex ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
                initial={{ opacity: 0, x: msg.sender === 'user' ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`p-3 max-w-[80%] rounded-xl text-white ${
                    msg.sender === 'user' ? 'bg-purple-600' : 'bg-indigo-400 text-left'
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
            {loading && (
              <div className="text-sm text-gray-500 text-center">Typing...</div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Speak or type how you feel..."
              className="flex-grow p-2 border rounded-lg border-purple-300 focus:outline-none focus:ring focus:border-purple-500"
            />
            <VoiceInput onTextCaptured={handleVoice} />
            <button
              onClick={handleSend}
              className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-lg shadow-md"
            >
              Send
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
