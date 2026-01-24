import React, { useState } from 'react';
import { Mic, Video, TrendingUp, Clock, CheckCircle, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    {
      icon: Mic,
      label: 'Translations',
      value: '24',
      change: '+5 this week',
    },
    {
      icon: Video,
      label: 'Videos Processed',
      value: '12',
      change: '+2 this week',
    },
    {
      icon: Clock,
      label: 'Processing Time',
      value: '2.5h',
      change: '-30% faster',
    },
    {
      icon: CheckCircle,
      label: 'Success Rate',
      value: '98.5%',
      change: '+0.2% this month',
    },
  ];

  const recentJobs = [
    {
      id: 1,
      name: 'Product Demo Video',
      language: 'English → Spanish',
      status: 'completed',
      progress: 100,
      date: '2024-01-23',
    },
    {
      id: 2,
      name: 'Interview Recording',
      language: 'English → French',
      status: 'processing',
      progress: 65,
      date: '2024-01-23',
    },
    {
      id: 3,
      name: 'Tutorial Series',
      language: 'English → Japanese',
      status: 'processing',
      progress: 45,
      date: '2024-01-22',
    },
    {
      id: 4,
      name: 'Podcast Episode',
      language: 'English → German',
      status: 'completed',
      progress: 100,
      date: '2024-01-22',
    },
  ];

  const voiceClones = [
    {
      id: 1,
      name: 'Professional Voice',
      status: 'ready',
      confidence: 94,
      samples: 50,
    },
    {
      id: 2,
      name: 'Casual Voice',
      status: 'training',
      confidence: 65,
      samples: 32,
    },
    {
      id: 3,
      name: 'Narrator Voice',
      status: 'ready',
      confidence: 91,
      samples: 45,
    },
  ];

  const tabs = ['Overview', 'Voices', 'Settings'];

  return (
    <main className="min-h-screen bg-[#0A1628] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back! Here's your activity overview.</p>
        </div>

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

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-[#0D1F36] border border-white/10 rounded-xl p-6 hover:border-cyan-500/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Icon className="w-8 h-8 text-cyan-400" />
                      <span className="text-xs px-2 py-1 rounded bg-cyan-500/10 text-cyan-400">
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                    <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                  </motion.div>
                );
              })}
            </div>

            {/* Recent Translations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-[#0D1F36] border border-white/10 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                  Recent Translations
                </h2>
              </div>

              <div className="space-y-4">
                {recentJobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between pb-4 border-b border-white/10 last:border-0 last:pb-0"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{job.name}</h4>
                      <p className="text-xs text-gray-400 mt-1">{job.language}</p>
                      <div className="mt-2 bg-gray-900/50 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${job.progress}%` }}
                          transition={{ duration: 0.5 }}
                          className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400"
                        />
                      </div>
                    </div>
                    <div className="ml-6 text-right">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          job.status === 'completed'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}
                      >
                        {job.status === 'completed' ? 'Done' : 'Processing'}
                      </span>
                      <p className="text-xs text-gray-400 mt-2">{job.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Voices Tab */}
        {activeTab === 'voices' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Your Voice Clones</h2>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Clone
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {voiceClones.map((voice) => (
                <motion.div
                  key={voice.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#0D1F36] border border-white/10 rounded-xl p-6 hover:border-cyan-500/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-semibold text-white flex-1">{voice.name}</h4>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        voice.status === 'ready'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {voice.status}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-400 mb-2">
                        {voice.status === 'ready' ? 'Confidence Score' : 'Training Progress'}
                      </p>
                      <div className="bg-gray-900/50 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${voice.confidence || 65}%` }}
                          transition={{ duration: 0.5 }}
                          className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400"
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{voice.confidence || 65}%</p>
                    </div>

                    <p className="text-xs text-gray-400">{voice.samples} training samples</p>

                    <div className="flex gap-2 pt-2">
                      <Button variant="secondary" size="sm" className="flex-1">
                        Edit
                      </Button>
                      <Button size="sm" className="flex-1">
                        Use
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#0D1F36] border border-white/10 rounded-xl p-6"
          >
            <h2 className="text-xl font-bold text-white mb-6">Dashboard Settings</h2>
            <div className="space-y-4">
              <p className="text-gray-400">Settings configuration coming soon</p>
              <Button variant="secondary">Configure Settings</Button>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}

export default Dashboard;
