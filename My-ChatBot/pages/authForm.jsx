import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function AuthForm({ isLogin, setIsLogin }) {
  const [form, setForm] = useState({
    email: '',
    password: '',
    pseudonym: '',
    mood: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = isLogin
        ? 'http://localhost:5000/api/login'
        : 'http://localhost:5000/api/register';

      const payload = isLogin
        ? { email: form.email, password: form.password }
        : form;

      const res = await axios.post(url, payload);

      if (isLogin) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('pseudonym', res.data.pseudonym);
        window.location.href = '/Dashboard'; // redirect to chatbot
      } else {
        setIsLogin(true); // switch to login after registration
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Something went wrong');
    }

    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
    >
      <h2 className="text-2xl font-bold text-purple-700 text-center mb-6">
        {isLogin ? 'Login to PaddiMi' : 'Create an Account'}
      </h2>

      {error && (
        <p className="text-red-600 text-sm text-center mb-4">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {!isLogin && (
          <>
            <input
              name="pseudonym"
              value={form.pseudonym}
              onChange={handleChange}
              placeholder="Your Pseudonym"
              required
              className="border p-2 rounded"
            />
            <input
              name="mood"
              value={form.mood}
              onChange={handleChange}
              placeholder="How are you feeling today?"
              required
              className="border p-2 rounded"
            />
          </>
        )}

        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="border p-2 rounded"
        />

        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="border p-2 rounded"
        />

        <button
          disabled={loading}
          type="submit"
          className="bg-purple-700 hover:bg-purple-800 text-white py-2 rounded-lg"
        >
          {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
        </button>
      </form>

      <p className="text-sm text-center mt-4">
        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
        <span
          className="text-purple-700 cursor-pointer underline"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Register' : 'Login'}
        </span>
      </p>
    </motion.div>
  );
}
