import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Translator from './pages/Translator';

export function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0A1628] text-white font-sans selection:bg-cyan-500/30">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/translate" element={<Translator />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;