import React, { useState } from 'react'
import { Upload, Play, Download, Settings, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '../components/Button'

export function LipSync() {
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
    <div className="min-h-screen bg-[#0A1628] pt-24 pb-20">
      <motion.div
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
      >
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold text-white mb-3">Lip Sync Tool</h1>
          <p className="text-gray-400 text-lg">
            Automatically synchronize lip movements with translated audio
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Processing Area */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}
          >
            {/* Video Upload */}
            <motion.div
              className="bg-[#0D1F36] border border-white/10 rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-white font-bold text-lg mb-4">Upload Video</h3>
              <p className="text-cyan-400 text-sm mb-4">
                Upload a video file (MP4, WebM, MOV) with clear facial visibility
              </p>

              <div className="border-2 border-dashed border-cyan-500/30 rounded-lg p-8 text-center hover:border-cyan-500/50 transition cursor-pointer">
                <Upload className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <h3 className="font-semibold text-white mb-2">Upload Video</h3>
                <p className="text-gray-400 mb-4">Drag and drop your video file</p>
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
                <motion.div
                  className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-green-300 text-sm">
                    ✓ {videoFile.name} selected ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Audio Upload */}
            <motion.div
              className="bg-[#0D1F36] border border-white/10 rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-white font-bold text-lg mb-4">Upload Translated Audio</h3>
              <p className="text-cyan-400 text-sm mb-4">
                Upload the translated audio file that will be synced to the video
              </p>

              <div className="border-2 border-dashed border-cyan-500/30 rounded-lg p-8 text-center hover:border-cyan-500/50 transition cursor-pointer">
                <Upload className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <h3 className="font-semibold text-white mb-2">Upload Audio</h3>
                <p className="text-gray-400 mb-4">Upload your translated audio file</p>
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
                <motion.div
                  className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-green-300 text-sm">
                    ✓ {audioFile.name} selected ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Advanced Options */}
            <motion.div
              className="bg-[#0D1F36] border border-white/10 rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Settings className="w-5 h-5 text-cyan-400" />
                <h3 className="text-white font-bold text-lg">Lip Sync Settings</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Synchronization Accuracy
                  </label>
                  <select className="w-full bg-[#0A1628] border border-white/20 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none transition">
                    <option value="fast">Fast (Lower Accuracy)</option>
                    <option value="balanced" defaultChecked>Balanced (Recommended)</option>
                    <option value="precise">Precise (Slower)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Face Detection Model
                  </label>
                  <select className="w-full bg-[#0A1628] border border-white/20 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none transition">
                    <option value="auto" defaultChecked>Auto Detect</option>
                    <option value="profile">Profile View</option>
                    <option value="frontal">Frontal View</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 accent-cyan-500"
                    />
                    <span className="text-white">Preserve Original Audio Track</span>
                  </label>
                  <p className="text-xs text-gray-400 ml-7 mt-1">
                    Keep background sounds and ambient noise
                  </p>
                </div>

                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-cyan-500"
                    />
                    <span className="text-white">Apply Expression Morphing</span>
                  </label>
                  <p className="text-xs text-gray-400 ml-7 mt-1">
                    Match facial expressions with emotional context
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Processing Status */}
            {isProcessing && (
              <motion.div
                className="bg-[#0D1F36] border border-cyan-500/30 rounded-xl p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-cyan-400 text-sm font-semibold mb-4">
                  Processing lip synchronization. Please wait...
                </p>
                <div className="w-full bg-[#0A1628] rounded-full h-3 border border-cyan-500/20">
                  <motion.div
                    className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-full rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-gray-400 text-xs mt-2">{Math.round(progress)}% complete</p>
              </motion.div>
            )}

            {progress === 100 && !isProcessing && progress > 0 && (
              <motion.div
                className="bg-[#0D1F36] border border-green-500/30 rounded-xl p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-green-400 text-sm font-semibold mb-4">
                  ✓ Lip sync processing completed successfully!
                </p>
                <div className="flex gap-3">
                  <Button className="flex-1">
                    <Download className="w-4 h-4" />
                    Download Video
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Play className="w-4 h-4" />
                    Preview
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Start Button */}
            {!isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Button
                  onClick={handleStartLipSync}
                  disabled={!videoFile || !audioFile}
                  size="lg"
                  className="w-full"
                >
                  <Zap className="w-5 h-5" />
                  Start Lip Synchronization
                </Button>
              </motion.div>
            )}
          </motion.div>

          {/* Right Sidebar */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}
          >
            {/* Supported Formats */}
            <motion.div
              className="bg-[#0D1F36] border border-white/10 rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-white font-bold text-lg mb-4">Supported Formats</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-cyan-400 mb-1">Video</p>
                  <p className="text-xs text-gray-400">MP4, WebM, MOV, AVI</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-cyan-400 mb-1">Audio</p>
                  <p className="text-xs text-gray-400">MP3, WAV, OGG, AAC</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-cyan-400 mb-1">Max File Size</p>
                  <p className="text-xs text-gray-400">1 GB per file</p>
                </div>
              </div>
            </motion.div>

            {/* Quality Tips */}
            <motion.div
              className="bg-[#0D1F36] border border-white/10 rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-white font-bold text-lg mb-4">Quality Tips</h3>
              <ul className="space-y-2 text-xs text-gray-300">
                <li className="flex gap-2">
                  <span className="text-cyan-400 flex-shrink-0">•</span>
                  <span>Ensure good lighting on the face</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan-400 flex-shrink-0">•</span>
                  <span>Face should be clearly visible</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan-400 flex-shrink-0">•</span>
                  <span>Audio should match video duration</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan-400 flex-shrink-0">•</span>
                  <span>Use high-quality source files</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>

        {/* Recent Jobs */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-white mb-8">Recent Lip Sync Jobs</h2>
          <div className="bg-[#0D1F36] border border-white/10 rounded-xl p-6">
            <div className="space-y-4">
              {recentJobs.map((job) => (
                <motion.div
                  key={job.id}
                  className="flex items-center justify-between p-4 border border-cyan-500/10 rounded-lg hover:border-cyan-500/30 transition"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{job.name}</h4>
                    <p className="text-xs text-gray-400">{job.language}</p>
                  </div>
                  <div className="text-right mr-4">
                    <p className="text-sm font-semibold text-green-400">{job.accuracy}% Match</p>
                    <p className="text-xs text-gray-400">{job.date}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default LipSync
