import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './Button';
export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[#040914]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[140px] mix-blend-screen" />
          <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-blue-600/20 rounded-full blur-[140px] mix-blend-screen" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-indigo-500/10 rounded-full blur-[160px] mix-blend-screen" />
        </div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        
        {/* Waveform Animation Background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="absolute inset-x-0 bottom-0 flex items-end justify-center translate-y-6 pointer-events-none"
        >
          <div className="flex items-end justify-center gap-1.5 h-64 opacity-30 mask-image-bottom">
            {[...Array(60)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ height: [20, Math.random() * 250 + 40, 20] }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.05
                }}
                className="w-1.5 bg-gradient-to-t from-cyan-400/80 to-blue-600/20 rounded-t-full"
              />
            ))}
          </div>
        </motion.div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.6
          }}
          className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-8">

          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span>Now with Real-time Translator</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter mb-6 relative"
        >
          Speak Once. <br />
          <span className="relative inline-block mt-2">
            <span className="absolute -inset-1 blur-2xl bg-gradient-to-r from-cyan-400/40 to-blue-600/40 opacity-70"></span>
            <span className="relative text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 via-cyan-400 to-blue-500 drop-shadow-sm">
              Be Understood Everywhere.
            </span>
          </span>
        </motion.h1>

        <motion.p
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.6,
            delay: 0.2
          }}
          className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">

          Real-time speech translation with original voice cloning and accurate
          lip-syncing. Communicate globally in your own voice.
        </motion.p>

        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.6,
            delay: 0.3
          }}
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">

          <Link to="/translate">
            <Button size="lg" className="w-full sm:w-auto group">
              Start Translating
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <a 
            href="https://drive.google.com/file/d/1y0UQVbc422oCpxNf-mvHnx3EExBG8xer/view?usp=drive_link" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto group">

              <Play className="mr-2 w-5 h-5 fill-current" />
              Watch Demo
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;