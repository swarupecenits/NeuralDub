import React, { useState } from 'react';
import { Upload, Mic, Play, Trash2, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';

export function VoiceClone() {
  const [cloneName, setCloneName] = useState('');
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [audioFiles, setAudioFiles] = useState<File[]>([]);

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
      confidence: 65,
      samples: 32,
      createdAt: '2024-01-22',
      description: 'Friendly and conversational tone',
    },
  ];

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setAudioFiles((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const handleStartTraining = () => {
    if (!cloneName || audioFiles.length < 3) {
      return;
    }

    setIsTraining(true);
    let progress = 0;
    const interval = setInterval(() => {
      setTrainingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 1000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-[#0A1628] pt-24 pb-20">
      <motion.div
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="mb-12" variants={itemVariants}>
          <h1 className="text-5xl font-bold text-white mb-3">Voice Cloning Studio</h1>
          <p className="text-gray-400 text-lg">
            Create personalized voice clones from your own voice
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create New Clone */}
          <motion.div className="lg:col-span-2 space-y-6" variants={itemVariants}>
            {/* Clone Name Input */}
            <motion.div
              className="bg-[#0D1F36] border border-white/10 rounded-xl p-6"
              variants={itemVariants}
            >
              <label className="block text-sm font-semibold text-white mb-3">Clone Name</label>
              <input
                type="text"
                placeholder="e.g., My Professional Voice"
                value={cloneName}
                onChange={(e) => setCloneName(e.target.value)}
                className="w-full bg-[#0A1628] border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition"
              />
            </motion.div>

            {/* Audio Upload */}
            <motion.div
              className="bg-[#0D1F36] border border-white/10 rounded-xl p-6"
              variants={itemVariants}
            >
              <label className="block text-sm font-semibold text-white mb-4">Upload Audio Samples</label>
              <div className="border-2 border-dashed border-cyan-500/30 rounded-lg p-8 text-center hover:border-cyan-500/50 transition">
                <Upload className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">Upload multiple audio files for training</p>
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
                <motion.div className="mt-4 space-y-2" variants={containerVariants}>
                  <p className="text-sm text-white font-semibold mb-3">
                    Selected Files ({audioFiles.length})
                  </p>
                  {audioFiles.map((file, idx) => (
                    <motion.div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-[#0A1628] rounded-lg border border-cyan-500/20"
                      variants={itemVariants}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <Mic className="w-4 h-4 text-cyan-400" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{file.name}</p>
                          <p className="text-xs text-gray-400">
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
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>

            {/* Training Progress */}
            {isTraining && (
              <motion.div
                className="bg-[#0D1F36] border border-cyan-500/30 rounded-xl p-6 space-y-4"
                variants={itemVariants}
              >
                <p className="text-cyan-400 text-sm font-semibold">Training your voice clone...</p>
                <div className="w-full bg-[#0A1628] rounded-full h-3 border border-cyan-500/20">
                  <motion.div
                    className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-full rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${trainingProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-gray-400 text-xs">
                  {Math.round(trainingProgress)}% • This may take 10-20 minutes
                </p>
              </motion.div>
            )}

            {trainingProgress === 100 && !isTraining && (
              <motion.div
                className="bg-green-500/10 border border-green-500/30 rounded-xl p-4"
                variants={itemVariants}
              >
                <p className="text-green-400 text-sm font-semibold">
                  ✓ Voice clone training completed! You can now use this voice for translations.
                </p>
              </motion.div>
            )}

            {/* Start Training */}
            <motion.div variants={itemVariants}>
              <Button
                onClick={handleStartTraining}
                disabled={isTraining || !cloneName || audioFiles.length < 3}
                size="lg"
                className="w-full"
              >
                {isTraining ? 'Training...' : 'Start Training'}
              </Button>
            </motion.div>
          </motion.div>

          {/* Instructions Sidebar */}
          <motion.div className="space-y-6" variants={containerVariants}>
            {/* Tips Card */}
            <motion.div
              className="bg-[#0D1F36] border border-white/10 rounded-xl p-6"
              variants={itemVariants}
            >
              <h3 className="text-white font-bold text-lg mb-4">Tips for Best Results</h3>
              <ul className="space-y-3">
                {[
                  'Use clear audio with minimal background noise',
                  'Record 5-10 samples of 15-30 seconds each',
                  'Vary your tone and speaking pace',
                  'Use a consistent microphone for all samples',
                ].map((tip, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-cyan-400 font-bold flex-shrink-0">{i + 1}.</span>
                    <span className="text-sm text-gray-300">{tip}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Recording Guide */}
            <motion.div
              className="bg-[#0D1F36] border border-white/10 rounded-xl p-6"
              variants={itemVariants}
            >
              <h3 className="text-white font-bold text-lg mb-4">Recording Guide</h3>
              <div className="space-y-4">
                {[
                  { label: 'Best Format', value: 'MP3, WAV, OGG (16-48kHz)' },
                  { label: 'Duration', value: '15-30 seconds per sample' },
                  { label: 'Samples Needed', value: 'Minimum 3, recommended 5-10' },
                ].map((item, i) => (
                  <div key={i}>
                    <p className="text-xs font-semibold text-cyan-400 mb-1">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Existing Voice Clones */}
        <motion.div className="mt-16" variants={itemVariants}>
          <h2 className="text-3xl font-bold text-white mb-8">Your Voice Clones</h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
          >
            {voiceClones.map((clone) => (
              <motion.div
                key={clone.id}
                className="bg-[#0D1F36] border border-white/10 rounded-xl p-6 hover:border-cyan-500/50 transition"
                variants={itemVariants}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg mb-1">{clone.name}</h3>
                    <p className="text-xs text-gray-400">{clone.description}</p>
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

                <div className="space-y-3 mb-6">
                  <div>
                    <p className="text-xs text-gray-400 mb-2">
                      {clone.status === 'ready' ? 'Quality Score' : 'Training Progress'}
                    </p>
                    <div className="w-full bg-[#0A1628] rounded-full h-2 border border-cyan-500/20">
                      <motion.div
                        className={`h-full rounded-full ${
                          clone.status === 'ready'
                            ? 'bg-gradient-to-r from-green-500 to-green-400'
                            : 'bg-gradient-to-r from-cyan-500 to-cyan-400'
                        }`}
                        initial={{ width: '0%' }}
                        animate={{ width: `${clone.confidence}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">{clone.samples} audio samples</p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Play className="w-3 h-3" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Share2 className="w-3 h-3" />
                    Share
                  </Button>
                  <button className="px-3 py-2 text-red-400 hover:text-red-300 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default VoiceClone;
