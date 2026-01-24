import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mic2 } from 'lucide-react';
import { Button } from './Button';
export function Navigation() {
  const location = useLocation();
  const isTranslatePage = location.pathname === '/translate';
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0A1628]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 rounded-lg bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors">
              <Mic2 className="w-6 h-6 text-cyan-400" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Voice<span className="text-cyan-400">Sync</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {!isTranslatePage &&
            <>
                <a
                href="#features"
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors">

                  Features
                </a>
                <a
                href="#use-cases"
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors">

                  Use Cases
                </a>
                <a
                href="#trust"
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors">

                  Trust & Safety
                </a>
              </>
            }
            <Link to={isTranslatePage ? '/' : '/translate'}>
              <Button variant="primary" size="sm">
                {isTranslatePage ? 'Back to Home' : 'Start Translating'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>);

}