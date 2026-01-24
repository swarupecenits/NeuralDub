import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './Button';
export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[#0A1628]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px]" />
        </div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
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
          <span>Now with Real-time Lip Sync</span>
        </motion.div>

        <motion.h1
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
            delay: 0.1
          }}
          className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6">

          Speak Once. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Be Understood Everywhere.
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
          <Button
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto group">

            <Play className="mr-2 w-5 h-5 fill-current" />
            Watch Demo
          </Button>
        </motion.div>

        {/* Abstract Visualization */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.8
          }}
          animate={{
            opacity: 1,
            scale: 1
          }}
          transition={{
            duration: 1,
            delay: 0.5
          }}
          className="mt-20 relative mx-auto max-w-4xl">

          <div className="aspect-[16/9] rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 backdrop-blur-sm flex items-center justify-center overflow-hidden">
            {/* Simulated Waveform Animation */}
            <div className="flex items-center justify-center gap-1 h-32">
              {[...Array(20)].map((_, i) =>
              <motion.div
                key={i}
                animate={{
                  height: [20, Math.random() * 100 + 20, 20]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.05
                }}
                className="w-2 bg-cyan-500/50 rounded-full" />

              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;