import React from 'react';
import { FileQuestion, Home, ArrowRight, Zap, Mic } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';

export function NotFound() {
  return (
    <main className="min-h-screen bg-[#0A1628] flex items-center justify-center pt-20 pb-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto text-center"
      >
        <div className="mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="inline-block"
          >
            <FileQuestion className="w-24 h-24 text-cyan-400 mx-auto mb-6" />
          </motion.div>
        </div>

        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-3xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-xl text-gray-400 mb-12">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="bg-[#0D1F36] border border-white/10 rounded-2xl p-8 mb-8">
          <p className="text-gray-300 mb-6">
            Let's get you back on track with our main features
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full p-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg transition text-cyan-400 flex items-center justify-center gap-2 font-medium"
              >
                <Home className="w-4 h-4" />
                Home
              </motion.button>
            </Link>
            <Link to="/translate">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full p-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg transition text-cyan-400 flex items-center justify-center gap-2 font-medium"
              >
                <Zap className="w-4 h-4" />
                Translate
              </motion.button>
            </Link>
            <Link to="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full p-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg transition text-cyan-400 flex items-center justify-center gap-2 font-medium"
              >
                <Mic className="w-4 h-4" />
                Dashboard
              </motion.button>
            </Link>
          </div>
        </div>

        <Link to="/">
          <Button size="lg">
            <Home className="w-5 h-5 mr-2" />
            Go Back Home
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </motion.div>
    </main>
  );
}

export default NotFound;
