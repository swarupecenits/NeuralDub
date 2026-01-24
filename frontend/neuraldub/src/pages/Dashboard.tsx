import type React from 'react'
import { useState } from 'react'
import { BarChart3, Mic, Video, TrendingUp, Clock, CheckCircle } from 'lucide-react'
import Card from '../components/Card'
import Tabs from '../components/Tabs'
import ProgressBar from '../components/ProgressBar'
import Button from '../components/Button'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data
  const stats = [
    {
      icon: Mic,
      label: 'Translations',
      value: '24',
      change: '+5 this week',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Video,
      label: 'Videos Processed',
      value: '12',
      change: '+2 this week',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Clock,
      label: 'Processing Time',
      value: '2.5h',
      change: '-30% faster',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: CheckCircle,
      label: 'Success Rate',
      value: '98.5%',
      change: '+0.2% this month',
      color: 'from-yellow-500 to-orange-500',
    },
  ]

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
  ]

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
      confidence: 0,
      samples: 32,
    },
    {
      id: 3,
      name: 'Narrator Voice',
      status: 'ready',
      confidence: 91,
      samples: 45,
    },
  ]

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.label} className="relative overflow-hidden">
                  <div className="absolute -right-8 -bottom-8 w-20 h-20 bg-gradient-to-br opacity-10 rounded-full blur-lg pointer-events-none"></div>
                  <Icon className="w-8 h-8 text-purple-400 mb-3" />
                  <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
                  <p className="text-xs text-green-400">{stat.change}</p>
                </Card>
              )
            })}
          </div>

          {/* Recent Activity */}
          <Card title="Recent Translations" icon={TrendingUp}>
            <div className="space-y-4">
              {recentJobs.map((job) => (
                <div key={job.id} className="flex items-start justify-between pb-4 border-b border-purple-500/10 last:border-0 last:pb-0">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1">{job.name}</h4>
                    <p className="text-xs text-slate-400 mb-2">{job.language}</p>
                    <ProgressBar progress={job.progress} showPercentage={false} />
                  </div>
                  <div className="ml-4 text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      job.status === 'completed'
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-blue-500/20 text-blue-300'
                    }`}>
                      {job.status === 'completed' ? 'Done' : 'Processing'}
                    </span>
                    <p className="text-xs text-slate-400 mt-2">{job.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      ),
    },
    {
      id: 'voices',
      label: 'Voice Clones',
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Your Voice Clones</h3>
            <Button size="sm">New Clone</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {voiceClones.map((voice) => (
              <Card key={voice.id}>
                <div className="flex items-start justify-between mb-4">
                  <h4 className="font-semibold text-white flex-1">{voice.name}</h4>
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    voice.status === 'ready'
                      ? 'bg-green-500/20 text-green-300'
                      : 'bg-yellow-500/20 text-yellow-300'
                  }`}>
                    {voice.status}
                  </span>
                </div>

                <div className="space-y-3">
                  {voice.status === 'ready' && (
                    <>
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Confidence Score</p>
                        <ProgressBar progress={voice.confidence} showPercentage color="green" />
                      </div>
                    </>
                  )}

                  {voice.status === 'training' && (
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Training Progress</p>
                      <ProgressBar progress={65} showPercentage color="blue" />
                    </div>
                  )}

                  <p className="text-xs text-slate-400">{voice.samples} training samples</p>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit
                    </Button>
                    <Button variant="secondary" size="sm" className="flex-1">
                      Use
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'settings',
      label: 'Settings',
      content: (
        <Card title="Dashboard Settings">
          <div className="space-y-4">
            <p className="text-slate-400">Settings configuration coming soon</p>
            <Button variant="secondary">Configure Settings</Button>
          </div>
        </Card>
      ),
    },
  ]

  return (
    <div className="min-h-screen pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-slate-400">Welcome back! Here's your activity overview.</p>
        </div>

        {/* Tabs */}
        <Tabs tabs={tabs} onChange={setActiveTab} />
      </div>
    </div>
  )
}
