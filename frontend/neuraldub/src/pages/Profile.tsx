import React, { useState } from 'react';
import { User, Lock, Bell, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';

export function Profile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    country: 'United States',
    bio: 'Content creator and translator',
  });

  const tabs = ['Profile', 'Settings', 'Security'];

  return (
    <main className="min-h-screen bg-[#0A1628] pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Your Profile</h1>
          <p className="text-gray-400">Manage your account and preferences</p>
        </div>

        {/* Avatar and Basic Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0D1F36] border border-white/10 rounded-2xl p-8 mb-8"
        >
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{userData.name}</h2>
              <p className="text-gray-400">{userData.email}</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-8 mb-8 border-b border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`pb-4 px-1 font-medium transition-colors ${
                activeTab === tab.toLowerCase()
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-[#0D1F36] border border-white/10 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-cyan-400" />
                Profile Information
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Full Name</label>
                  <input
                    type="text"
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    className="w-full bg-[#0A1628] border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Email</label>
                  <input
                    type="email"
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    className="w-full bg-[#0A1628] border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Phone</label>
                  <input
                    type="tel"
                    value={userData.phone}
                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                    className="w-full bg-[#0A1628] border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Country</label>
                  <input
                    type="text"
                    value={userData.country}
                    onChange={(e) => setUserData({ ...userData, country: e.target.value })}
                    className="w-full bg-[#0A1628] border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Bio</label>
                  <textarea
                    value={userData.bio}
                    onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                    rows={4}
                    className="w-full bg-[#0A1628] border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition resize-none"
                    placeholder="Tell us about yourself"
                  />
                </div>

                <Button className="w-full">Save Changes</Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#0D1F36] border border-white/10 rounded-2xl p-8"
          >
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5 text-cyan-400" />
              Notification Preferences
            </h2>

            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-white/20" defaultChecked />
                <span className="text-white">Email notifications</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-white/20" defaultChecked />
                <span className="text-white">Project updates</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-white/20" />
                <span className="text-white">Marketing emails</span>
              </label>
            </div>
          </motion.div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#0D1F36] border border-white/10 rounded-2xl p-8"
          >
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Lock className="w-5 h-5 text-cyan-400" />
              Security Settings
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-white font-semibold mb-4">Change Password</h3>
                <div className="space-y-4">
                  <input
                    type="password"
                    placeholder="Current password"
                    className="w-full bg-[#0A1628] border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500 transition"
                  />
                  <input
                    type="password"
                    placeholder="New password"
                    className="w-full bg-[#0A1628] border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500 transition"
                  />
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full bg-[#0A1628] border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500 transition"
                  />
                  <Button>Update Password</Button>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h3 className="text-white font-semibold mb-4">Sign Out</h3>
                <Button variant="secondary">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out From All Devices
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}

export default Profile;
