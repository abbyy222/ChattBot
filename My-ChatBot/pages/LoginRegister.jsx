import { useState } from 'react';
import AuthForm from '../pages/authForm';
import { motion } from 'framer-motion';

export default function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-purple-300 to-indigo-400 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="backdrop-blur-md bg-white/30 p-8 rounded-2xl shadow-2xl"
      >
        <AuthForm isLogin={isLogin} setIsLogin={setIsLogin} />
      </motion.div>
    </div>
  );
}
