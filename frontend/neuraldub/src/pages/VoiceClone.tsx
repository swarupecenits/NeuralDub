import type React from 'react'
import { useState } from 'react'
import { Upload, Mic, Play, Plus, Trash2, Share2, Lock } from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import ProgressBar from '../components/ProgressBar'
import Alert from '../components/Alert'

export default function VoiceClone() {
  const [cloneName, setCloneName] = useState('')
  const [isTraining, setIsTraining] = useState(false)
  const [trainingProgress, setTrainingProgress] = useState(0)
  const [audioFiles, setAudioFiles] = useState<File[]>([])

  const voiceClones = [
    {
      id: 1,
      name: 'Professional Voice',
      status: 'ready',
      confidence: 94,
      samples: 50,
      createdAt: '2024-01-20',
      description: 'Clear and professional narration voice',
    },
    {
      id: 2,
      name: 'Casual Voice',
      status: 'training',
      confidence: 0,
      samples: 32,
      createdAt: '2024-01-22',
      description: 'Friendly and conversational tone',
    },
  ]

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      setAudioFiles((prev) => [...prev, ...Array.from(files)])
    }
  }

  const handleStartTraining = () => {
    if (!cloneName || audioFiles.length < 3) {
      return
    }

    setIsTraining(true)
    const interval = setInterval(() => {
      setTrainingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsTraining(false)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 1000)
  }

  return (
    <div className="min-h-screen pt-8 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Voice Cloning Studio</h1>
          <p className="text-slate-400">
            Create personalized voice clones from your own voice
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create New Clone */}
          <div className="lg:col-span-2">
            <Card title="Create New Voice Clone" icon={Mic}>
              <div className="space-y-6">
                <Alert
                  type="info"
                  message="Provide at least 3-5 clear audio samples (15-30 seconds each) in quiet environments for best results."
                />

                {/* Clone Name */}
                <Input
                  label="Clone Name"
                  placeholder="e.g., My Professional Voice"
                  value={cloneName}
                  onChange={(e) => setCloneName(e.target.value)}
                />

                {/* Audio Upload */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Upload Audio Samples
                  </label>
                  <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-8 text-center hover:border-purple-500/50 transition">
                    <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                    <p className="text-slate-400 mb-4">
                      Upload multiple audio files for training
                    </p>
                    <input
                      type="file"
                      accept="audio/*"
                      multiple
                      onChange={handleAudioUpload}
                      className="hidden"
                      id="audio-input"
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('audio-input')?.click()}
                    >
                      Choose Audio Files
                    </Button>
                  </div>

                  {audioFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm text-slate-300 font-semibold">
                        Selected Files ({audioFiles.length})
                      </p>
                      {audioFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-purple-500/20"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <Mic className="w-4 h-4 text-purple-400" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-white truncate">{file.name}</p>
                              <p className="text-xs text-slate-400">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              setAudioFiles((prev) => prev.filter((_, i) => i !== idx))
                            }
                            className="text-red-400 hover:text-red-300 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Training Progress */}
                {isTraining && (
                  <div className="space-y-3">
                    <Alert type="info" message="Training your voice clone... This may take 10-20 minutes." />
                    <ProgressBar progress={trainingProgress} label="Training Progress" />
                  </div>
                )}

                {trainingProgress === 100 && !isTraining && (
                  <Alert
                    type="success"
                    message="Voice clone training completed! You can now use this voice for translations."
                  />
                )}

                {/* Start Training */}
                <Button
                  onClick={handleStartTraining}
                  disabled={isTraining || !cloneName || audioFiles.length < 3}
                  size="lg"
                  className="w-full"
                >
                  {isTraining ? 'Training...' : 'Start Training'}
                </Button>
              </div>
            </Card>
          </div>

          {/* Instructions Sidebar */}
          <div className="space-y-4">
            <Card title="Tips for Best Results">
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-purple-400 font-bold flex-shrink-0">1.</span>
                  <span className="text-sm text-slate-300">
                    Use clear audio with minimal background noise
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-purple-400 font-bold flex-shrink-0">2.</span>
                  <span className="text-sm text-slate-300">
                    Record 5-10 samples of 15-30 seconds each
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-purple-400 font-bold flex-shrink-0">3.</span>
                  <span className="text-sm text-slate-300">
                    Vary your tone and speaking pace
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-purple-400 font-bold flex-shrink-0">4.</span>
                  <span className="text-sm text-slate-300">
                    Use a consistent microphone for all samples
                  </span>
                </li>
              </ul>
            </Card>

            <Card title="Recording Guide">
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-purple-300 mb-1">Best Format</p>
                  <p className="text-xs text-slate-400">MP3, WAV, OGG (16-48kHz)</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-purple-300 mb-1">Duration</p>
                  <p className="text-xs text-slate-400">15-30 seconds per sample</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-purple-300 mb-1">Samples Needed</p>
                  <p className="text-xs text-slate-400">Minimum 3, recommended 5-10</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Existing Voice Clones */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-6">Your Voice Clones</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {voiceClones.map((clone) => (
              <Card key={clone.id}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg mb-1">{clone.name}</h3>
                    <p className="text-xs text-slate-400">{clone.description}</p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ml-2 ${
                      clone.status === 'ready'
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-yellow-500/20 text-yellow-300'
                    }`}
                  >
                    {clone.status}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  {clone.status === 'ready' && (
                    <ProgressBar
                      progress={clone.confidence}
                      label="Quality Score"
                      color="green"
                    />
                  )}
                  {clone.status === 'training' && (
                    <ProgressBar progress={65} label="Training Progress" color="blue" />
                  )}
                  <p className="text-xs text-slate-400">{clone.samples} audio samples</p>
                </div>

                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" className="flex-1">
                    <Play className="w-3 h-3" />
                    Preview
                  </Button>
                  <Button variant="secondary" size="sm" className="flex-1">
                    <Share2 className="w-3 h-3" />
                    Share
                  </Button>
                  <button className="px-3 py-2 text-red-400 hover:text-red-300 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
