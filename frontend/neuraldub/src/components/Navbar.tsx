import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mic2 } from 'lucide-react';
import { Button } from './Button';

export function Navbar() {
  const location = useLocation();
  const isTranslatePage = location.pathname === '/translate';

  return (
    <nav className="fixed top-0 w-full bg-[#0A1628]/95 backdrop-blur-sm border-b border-white/10 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div className="p-2 rounded-lg bg-cyan-500/20">
            <Mic2 className="w-6 h-6 text-cyan-400" />
          </div>
          <span className="text-xl font-bold text-white hidden sm:inline">Neural Dub</span>
        </Link>

        {/* Navigation Links */}
        {!isTranslatePage && (
          <div className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              Features
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              Use Cases
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              Trust & Safety
            </a>
          </div>
        )}

        {/* CTA Button */}
        <Link to={isTranslatePage ? '/' : '/translate'}>
          <Button size="sm">
            {isTranslatePage ? 'Back to Home' : 'Start Translating'}
          </Button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;