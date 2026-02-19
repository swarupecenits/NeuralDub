import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mic2, Menu, X, LogOut } from 'lucide-react';
import { Button } from './Button';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const isTranslatePage = location.pathname === '/translate';
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navLinks = [
    { label: 'Translator', path: '/translate', icon: '' },
    { label: 'Voice Clone', path: '/voice-clone', icon: '' },
    { label: 'Lip Sync', path: '/lip-sync', icon: '' },
    { label: 'Live Translator', path: '/live-translator', icon: '' },
    { label: 'Dashboard', path: '/dashboard', icon: '' },
  ];

  return (
    <nav className="fixed top-0 w-full bg-[#0A1628]/95 backdrop-blur-sm border-b border-white/10 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity shrink-0">
            <div className="p-2 rounded-lg bg-cyan-500/20">
              <Mic2 className="w-6 h-6 text-cyan-400" />
            </div>
            <span className="text-xl font-bold text-white hidden sm:inline">Neural Dub</span>
          </Link>

          {/* Desktop Navigation Links */}
          {!isAuthPage && (
            <div className="hidden lg:flex items-center space-x-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === link.path
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="mr-1">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Auth & Account Section */}
          <div className="hidden lg:flex items-center space-x-3">
            {!isAuthPage && (
              <>
                {user ? (
                  <>
                    <Link to="/profile">
                      <Button variant="outline" size="sm">
                        Profile
                      </Button>
                    </Link>
                    <Button size="sm" onClick={handleLogout} variant="secondary">
                      <LogOut className="w-4 h-4 mr-1" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login">
                      <Button variant="outline" size="sm">
                        Login
                      </Button>
                    </Link>
                    <Link to="/signup">
                      <Button size="sm">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && !isAuthPage && (
          <div className="lg:hidden pb-4 border-t border-white/10">
            <div className="space-y-2 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === link.path
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="mr-2">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 space-y-2 border-t border-white/10 mt-2">
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <LogOut className="w-4 h-4 inline mr-2" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button size="sm" variant="outline" className="w-full mb-2">
                        Login
                      </Button>
                    </Link>
                    <Link to="/signup" onClick={() => setIsOpen(false)}>
                      <Button size="sm" className="w-full">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;