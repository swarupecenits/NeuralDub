import type React from 'react'
import { useState } from 'react'
import { Upload, Play, Download, Settings, Zap } from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'
import Select from '../components/Select'
import Input from '../components/Input'
import ProgressBar from '../components/ProgressBar'
import Alert from '../components/Alert'

export default function LipSync() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setVideoFile(file)
    }
  }

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAudioFile(file)
    }
  }

  const handleStartLipSync = () => {
    if (!videoFile || !audioFile) {
      return
    }

    setIsProcessing(true)
    setProgress(0)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsProcessing(false)
          return 100
        }
        return prev + Math.random() * 25
      })
    }, 600)
  }

  const recentJobs = [
    {
      id: 1,
      name: 'Product Demo',
      language: 'English → Spanish',
      status: 'completed',
      date: '2024-01-23',
      accuracy: 96,
    },
    {
      id: 2,
      name: 'Tutorial Video',
      language: 'English → French',
      status: 'completed',
      date: '2024-01-22',
      accuracy: 94,
    },
  ]

  return (
    <div className="min-h-screen pt-8 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Lip Sync AI</h1>
          <p className="text-slate-400">
            Automatically synchronize lip movements with translated audio
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Processing Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Upload */}
            <Card title="Upload Video">
              <div className="space-y-4">
                <Alert
                  type="info"
                  message="Upload a video file (MP4, WebM, MOV) with clear facial visibility"
                />

                <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-8 text-center hover:border-purple-500/50 transition cursor-pointer">
                  <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-white mb-2">Upload Video</h3>
                  <p className="text-slate-400 mb-4">Drag and drop your video file</p>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                    id="video-input"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('video-input')?.click()}
                  >
                    Choose Video
                  </Button>
                </div>

                {videoFile && (
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-green-300 text-sm">
                      ✓ {videoFile.name} selected ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Audio Upload */}
            <Card title="Upload Translated Audio">
              <div className="space-y-4">
                <Alert
                  type="info"
                  message="Upload the translated audio file that will be synced to the video"
                />

                <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-8 text-center hover:border-purple-500/50 transition cursor-pointer">
                  <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-white mb-2">Upload Audio</h3>
                  <p className="text-slate-400 mb-4">Upload your translated audio file</p>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioUpload}
                    className="hidden"
                    id="audio-input"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('audio-input')?.click()}
                  >
                    Choose Audio
                  </Button>
                </div>

                {audioFile && (
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-green-300 text-sm">
                      ✓ {audioFile.name} selected ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Advanced Options */}
            <Card title="Lip Sync Settings" icon={Settings}>
              <div className="space-y-4">
                <Select
                  label="Synchronization Accuracy"
                  options={[
                    { value: 'fast', label: 'Fast (Lower Accuracy)' },
                    { value: 'balanced', label: 'Balanced (Recommended)' },
                    { value: 'precise', label: 'Precise (Slower)' },
                  ]}
                  defaultValue="balanced"
                />

                <Select
                  label="Face Detection Model"
                  options={[
                    { value: 'auto', label: 'Auto Detect' },
                    { value: 'profile', label: 'Profile View' },
                    { value: 'frontal', label: 'Frontal View' },
                  ]}
                  defaultValue="auto"
                />

                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-slate-300">Preserve Original Audio Track</span>
                  </label>
                  <p className="text-xs text-slate-400 ml-7 mt-1">
                    Keep background sounds and ambient noise
                  </p>
                </div>

                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="text-slate-300">Apply Expression Morphing</span>
                  </label>
                  <p className="text-xs text-slate-400 ml-7 mt-1">
                    Match facial expressions with emotional context
                  </p>
                </div>
              </div>
            </Card>

            {/* Processing Status */}
            {isProcessing && (
              <Card>
                <Alert
                  type="info"
                  message="Processing lip synchronization. Please wait..."
                />
                <ProgressBar progress={progress} label="Sync Progress" color="purple" />
              </Card>
            )}

            {progress === 100 && !isProcessing && progress > 0 && (
              <Card>
                <Alert
                  type="success"
                  message="Lip sync processing completed successfully!"
                />
                <div className="flex gap-3 mt-4">
                  <Button className="flex-1">
                    <Download className="w-4 h-4" />
                    Download Video
                  </Button>
                  <Button variant="secondary" className="flex-1">
                    <Play className="w-4 h-4" />
                    Preview
                  </Button>
                </div>
              </Card>
            )}

            {/* Start Button */}
            {!isProcessing && (
              <Button
                onClick={handleStartLipSync}
                disabled={!videoFile || !audioFile}
                size="lg"
                className="w-full"
              >
                <Zap className="w-5 h-5" />
                Start Lip Synchronization
              </Button>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            <Card title="Supported Formats">
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-purple-300 mb-1">Video</p>
                  <p className="text-xs text-slate-400">MP4, WebM, MOV, AVI</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-purple-300 mb-1">Audio</p>
                  <p className="text-xs text-slate-400">MP3, WAV, OGG, AAC</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-purple-300 mb-1">Max File Size</p>
                  <p className="text-xs text-slate-400">1 GB per file</p>
                </div>
              </div>
            </Card>

            <Card title="Quality Tips">
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex gap-2">
                  <span className="text-purple-400">•</span>
                  <span>Ensure good lighting on the face</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-400">•</span>
                  <span>Face should be clearly visible</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-400">•</span>
                  <span>Audio should match video duration</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-400">•</span>
                  <span>Use high-quality source files</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Lip Sync Jobs</h2>
          <Card>
            <div className="space-y-4">
              {recentJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-4 border border-purple-500/10 rounded-lg hover:border-purple-500/30 transition"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{job.name}</h4>
                    <p className="text-xs text-slate-400">{job.language}</p>
                  </div>
                  <div className="text-right mr-4">
                    <p className="text-sm font-semibold text-green-400">{job.accuracy}% Match</p>
                    <p className="text-xs text-slate-400">{job.date}</p>
                  </div>
                  <Button variant="secondary" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
