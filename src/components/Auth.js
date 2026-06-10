import React, { useState } from 'react';
import { supabase } from '../main.js';
import { motion, animate, useAnimation } from 'framer-motion';

const Auth = ({ type }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (type === 'login') {
      try {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setError('');
        // Redirect to main page or show success
      } catch (err) {
        setError(err.message);
      }
    } else if (type === 'signup') {
      try {
        const { user } = await supabase.auth.signUp({ email, password });
        if (user) {
          setError('');
          // Redirect to main page
        }
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="bg-white p-10 max-w-md mx-auto shadow">
      <h2 className="text-2xl font-bold mb-4">Sidou Signals</h2>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">البريد الإلكتروني</label>
          <input 
            type="email" 
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">الرقم السري</label>
          <input 
            type="password" 
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button 
          type="submit" 
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg"
        >
          {type === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب'}
        </button>
      </form>
      <div className="mt-4 text-center">
        {type === 'login' ? 
          <p>لم تكن لديك حساب؟ <a href="#" className="text-purple-600 hover:underline">إنشاء حساب</a></p> :
          <p>لدي حساب؟ <a href="#" className="text-purple-600 hover:underline">تسجيل الدخول</a></p>
        }
      </div>
    </div>
  );
};

export default Auth;