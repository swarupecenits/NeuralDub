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
        className="py-24 bg-[#0A1628] border-t border-white/5">

        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-cyan-500/10 mb-6">
            <Shield className="w-8 h-8 text-cyan-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Privacy First & Secure
          </h2>
          <p className="text-gray-400 mb-8">
            We believe in ethical AI. Your voice data is processed securely,
            never stored without consent, and we provide clear watermarking for
            all AI-generated content.
          </p>
          <Link to="/translate">
            <Button size="lg">Try It Free</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-[#081221]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © 2024 Neural Dub AI. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="#"
              className="text-gray-500 hover:text-cyan-400 text-sm transition-colors">

              Privacy
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-cyan-400 text-sm transition-colors">

              Terms
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-cyan-400 text-sm transition-colors">

              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default Home;