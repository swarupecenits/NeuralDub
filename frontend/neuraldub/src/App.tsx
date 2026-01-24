import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Translator from './pages/Translator';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import VoiceClone from './pages/VoiceClone';
import LipSync from './pages/LipSync';
import NotFound from './pages/NotFound';

export function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0A1628] text-white font-sans selection:bg-cyan-500/30">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/translate" element={<Translator />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/voice-clone" element={<VoiceClone />} />
          <Route path="/lip-sync" element={<LipSync />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;