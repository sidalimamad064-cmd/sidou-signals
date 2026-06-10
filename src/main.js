import React from 'react';
import ReactDOM from 'react-dom/client';
import HeroSection from './components/HeroSection';

// Initialize Supabase with provided credentials
const supabase = supabase.createClient({
  url: 'https://twuimpscnrhyurlrzyvo.supabase.co',
  anonKey: 'sb_anon_public_key_here' // Replace with actual key
});

// Function to start the app
function startApp() {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<HeroSection />);
}

startApp();