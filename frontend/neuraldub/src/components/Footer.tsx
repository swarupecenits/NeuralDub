import type React from 'react'
import { Link } from 'react-router-dom'
import { Mic, Github, Mail, Linkedin, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-purple-500/20 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-600 rounded-lg flex items-center justify-center">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                NeuralDub
              </span>
            </div>
            <p className="text-slate-400 text-sm">
              Advanced Speech to Speech Translation with Voice Cloning and Lip Syncing
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/translator" className="text-slate-400 hover:text-purple-300 transition text-sm">
                  Translator
                </Link>
              </li>
              <li>
                <Link to="/voice-clone" className="text-slate-400 hover:text-purple-300 transition text-sm">
                  Voice Cloning
                </Link>
              </li>
              <li>
                <Link to="/lip-sync" className="text-slate-400 hover:text-purple-300 transition text-sm">
                  Lip Sync
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-slate-400 hover:text-purple-300 transition text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-purple-300 transition text-sm">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-purple-300 transition text-sm">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-purple-300 transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-purple-300 transition">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-purple-300 transition">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-purple-300 transition">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-purple-500/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            &copy; 2026 NeuralDub. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-500 hover:text-purple-300 transition text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-slate-500 hover:text-purple-300 transition text-sm">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
