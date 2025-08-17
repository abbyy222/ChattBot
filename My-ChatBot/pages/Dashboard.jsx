import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-white flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-xl w-full text-center">
        <h1 className="text-3xl font-bold text-purple-700 mb-4">
          🌿 Mental Health Support Hub
        </h1>
        <p className="text-gray-600 mb-8">
          Welcome! Choose how you'd like to express yourself today.
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate('/chat')}
            className="w-full bg-purple-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-purple-700 transition duration-200"
          >
            🧠 Talk to the AI Companion
          </button>

          <button
            onClick={() => navigate('/MoodLog')}
            className="w-full bg-blue-500 text-white py-3 rounded-xl text-lg font-semibold hover:bg-blue-600 transition duration-200"
          >
            📔 Log My Mood
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-500 mt-6">
        Your voice and feelings matter 💜
      </p>
    </div>
  );
}
