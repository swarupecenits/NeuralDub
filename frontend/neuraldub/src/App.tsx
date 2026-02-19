import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
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
import LiveTranslator from './pages/LiveTranslator';

export function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0A1628] text-white font-sans selection:bg-cyan-500/30">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/translate" element={<ProtectedRoute><Translator /></ProtectedRoute>} />
          <Route path="/voice-clone" element={<ProtectedRoute><VoiceClone /></ProtectedRoute>} />
          <Route path="/lip-sync" element={<ProtectedRoute><LipSync /></ProtectedRoute>} />
          <Route path="/live-translator" element={<ProtectedRoute><LiveTranslator /></ProtectedRoute>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;