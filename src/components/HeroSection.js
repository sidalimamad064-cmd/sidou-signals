import React from 'react';
import { motion, animate, useAnimation } from 'framer-motion';

const HeroSection = () => {
  const animatedHeading = useAnimation({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.5, ease: 'easeOut' }
  });

  const animatedButton = useAnimation({
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 1.5, ease: 'easeOut' }
  });

  return (
    <section className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="flex-1 text-center text-lg md:text-3xl">
            <h1 className="text-4xl font-bold mb-4" style={{ ...animatedHeading }}>
              Sidou Signals
            </h1>
            <p className="text-lg mb-8" style={{ ...animatedButton }}>
              منصة تداول ذكية مع تحليلات متقدمة وإشعارات في الوقت الفعلي
            </p>
          </div>
          <div className="flex-1">
            <button 
              className="bg-white text-purple-600 px-6 py-3 rounded-lg shadow hover:shadow-lg focus:outline-none focus:shadow-lg"
              onClick={() => alert('تسجيل الدخول أو إنشاء حساب')}
              style={{ ...animatedButton }}
            >
              تسجيل الدخول / إنشاء حساب
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;