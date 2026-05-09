import React from 'react';
import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { UseCases } from '../components/UseCases';
import { Button } from '../components/Button';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Home() {
  return (
    <main className="bg-[#0A1628] min-h-screen">
      <Hero />
      <Features />
      <UseCases />

      {/* Trust Section */}
      <section
        id="trust"
        className="py-32 bg-[#040914] relative overflow-hidden">
        
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-gradient-to-r from-transparent via-cyan-900/10 to-transparent blur-[100px]" />

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[#0c1a2f] to-[#040914] border border-cyan-500/20 shadow-[0_0_30px_rgba(34,211,238,0.15)] mb-8 transform hover:scale-105 transition-transform duration-300">
            <Shield className="w-10 h-10 text-cyan-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Secure & Privacy First
          </h2>
          <p className="text-gray-400 text-lg md:text-xl mb-10 leading-relaxed max-w-2xl mx-auto">
            We believe in ethical AI. Your voice data is processed securely,
            never stored without your explicitly granted consent, and we add an invisible watermark to
            all our AI-generated content to prevent misuse.
          </p>
          <Link to="/translate">
            <Button size="lg" className="shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_40px_rgba(34,211,238,0.5)] transition-all">
              Try It Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-[#02050A] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">N</span>
            </div>
            <p className="text-gray-500 text-sm font-medium tracking-wide hidden md:block">
              Neural Dub AI © 2024
            </p>
          </div>
          <p className="text-gray-500 text-sm md:hidden">
            © 2024 Neural Dub AI
          </p>
          <div className="flex space-x-8">
            <a
              href="#"
              className="text-gray-500 hover:text-cyan-400 text-sm font-medium transition-colors">
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-cyan-400 text-sm font-medium transition-colors">
              Terms of Service
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-cyan-400 text-sm font-medium transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default Home;