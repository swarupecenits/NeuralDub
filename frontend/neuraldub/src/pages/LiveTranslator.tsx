import React, { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, Trash2, Languages, Volume2, RefreshCw, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '../components/Button'
import { useAudioRecorder } from '../hooks/useAudioRecorder'
import { useLiveTranscription } from '../hooks/useLiveTranscription'
import { SUPPORTED_LANGUAGES } from '../utils/languages'

const LiveTranslator = () => {
  const [sourceLang, setSourceLang] = useState<string>('auto')
  const [targetLang, setTargetLang] = useState<string>('en')
  const [isTranslating, setIsTranslating] = useState(false)
  const [recordingMode, setRecordingMode] = useState<'continuous' | 'manual'>('manual')
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Audio recording hook
  const {
    isRecording,
    recordingTime,
    audioBlob,
    error: recordingError,
    startRecording,
    stopRecording,
    clearRecording,
  } = useAudioRecorder()

  // Live transcription hook
  const {
    isProcessing,
    segments,
    currentOriginal,
    currentTranslated,
    error: transcriptionError,
    detectedLanguage,
    processAudioChunk,
    clearTranscriptions,
  } = useLiveTranscription()

  // Auto-process audio chunks in continuous mode
  useEffect(() => {
    if (isRecording && recordingMode === 'continuous') {
      recordingIntervalRef.current = setInterval(async () => {
        // Stop and restart recording to get chunks
        stopRecording()
        setTimeout(() => {
          startRecording()
        }, 100)
      }, 3000) // Process every 3 seconds

      return () => {
        if (recordingIntervalRef.current) {
          clearInterval(recordingIntervalRef.current)
        }
      }
    }
  }, [isRecording, recordingMode, stopRecording, startRecording])

  // Process audio blob when recording stops
  useEffect(() => {
    if (audioBlob && isTranslating) {
      processAudioChunk(audioBlob, sourceLang, targetLang)
        .then(() => {
          clearRecording()
          // Restart recording in continuous mode
          if (recordingMode === 'continuous' && isTranslating) {
            setTimeout(() => startRecording(), 100)
          }
        })
    }
  }, [audioBlob, isTranslating, sourceLang, targetLang, processAudioChunk, clearRecording, recordingMode, startRecording])

  // Handle start/stop translation
  const handleToggleTranslation = async () => {
    if (isTranslating) {
      // Stop translation
      setIsTranslating(false)
      if (isRecording) {
        stopRecording()
      }
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
    } else {
      // Start translation
      setIsTranslating(true)
      clearTranscriptions()
      await startRecording()
    }
  }

  // Handle clear all
  const handleClear = () => {
    if (isRecording) {
      stopRecording()
    }
    setIsTranslating(false)
    clearRecording()
    clearTranscriptions()
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current)
    }
  }

  // Format recording time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Get display language for auto-detect
  const getDisplaySourceLang = () => {
    if (sourceLang === 'auto' && detectedLanguage) {
      return SUPPORTED_LANGUAGES.find(l => l.code === detectedLanguage)?.name || 'Auto-detected'
    }
    return SUPPORTED_LANGUAGES.find(l => l.code === sourceLang)?.name || 'Auto-detect'
  }

  return (
    <div className="min-h-screen bg-[#0A1628] pt-24 pb-20">
      <motion.div 
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-cyan-500/10 mb-6">
            <Languages className="w-10 h-10 text-cyan-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Live Translator
          </h1>
          <p className="text-lg text-gray-400">
            Real-time speech translation with live captions
          </p>
        </motion.div>

        {/* Language Selection */}
        <motion.div 
          className="bg-[#0F1F38] rounded-xl border border-white/10 p-6 mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Source Language */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Source Language
              </label>
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                disabled={isTranslating}
                className="w-full px-4 py-3 rounded-lg bg-[#0A1628] border border-white/10 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <option value="auto">Auto-detect</option>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name} ({lang.nativeName})
                  </option>
                ))}
              </select>
              {detectedLanguage && sourceLang === 'auto' && (
                <p className="mt-2 text-sm text-cyan-400 flex items-center gap-1">
                  <RefreshCw className="w-4 h-4" />
                  Detected: {getDisplaySourceLang()}
                </p>
              )}
            </div>

            {/* Target Language */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Target Language
              </label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                disabled={isTranslating}
                className="w-full px-4 py-3 rounded-lg bg-[#0A1628] border border-white/10 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name} ({lang.nativeName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Recording Mode */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Recording Mode
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  value="manual"
                  checked={recordingMode === 'manual'}
                  onChange={(e) => setRecordingMode(e.target.value as 'manual')}
                  disabled={isTranslating}
                  className="w-4 h-4 text-cyan-500 focus:ring-cyan-500 bg-[#0A1628] border-white/20"
                />
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Manual (Click to stop)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  value="continuous"
                  checked={recordingMode === 'continuous'}
                  onChange={(e) => setRecordingMode(e.target.value as 'continuous')}
                  disabled={isTranslating}
                  className="w-4 h-4 text-cyan-500 focus:ring-cyan-500 bg-[#0A1628] border-white/20"
                />
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Continuous (Auto-process every 3s)</span>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Control Panel */}
        <motion.div 
          className="bg-[#0F1F38] rounded-xl border border-white/10 p-6 mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Recording Status */}
            <div className="flex items-center gap-4">
              {isRecording && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-lg font-semibold text-white">
                      {formatTime(recordingTime)}
                    </span>
                  </div>
                  {isProcessing && (
                    <span className="text-sm text-cyan-400 flex items-center gap-1">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Processing...
                    </span>
                  )}
                </>
              )}
              {!isRecording && !isTranslating && (
                <span className="text-gray-400">Ready to start</span>
              )}
            </div>

            {/* Control Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleToggleTranslation}
                variant={isTranslating ? 'secondary' : 'primary'}
                className={isTranslating ? 'border-red-500/50 text-red-400 hover:bg-red-500/10' : ''}
              >
                {isTranslating ? (
                  <>
                    <MicOff className="w-5 h-5 mr-2" />
                    Stop
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5 mr-2" />
                    Start
                  </>
                )}
              </Button>

              <Button
                onClick={handleClear}
                disabled={segments.length === 0 && !isRecording}
                variant="secondary"
                className="disabled:opacity-30"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Clear
              </Button>
            </div>
          </div>

          {/* Errors */}
          {(recordingError || transcriptionError) && (
            <motion.div 
              className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="text-sm text-red-300">
                {recordingError || transcriptionError}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Live Captions Display */}
        <motion.div 
          className="bg-[#0F1F38] rounded-xl border border-white/10 p-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Volume2 className="w-6 h-6 text-cyan-400" />
            Live Captions
          </h2>

          {/* Current Caption (Large Display) */}
          {(currentOriginal || currentTranslated) && (
            <motion.div 
              className="mb-6 p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl border border-cyan-500/20"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-400 mb-2">
                  {getDisplaySourceLang()}:
                </div>
                <div className="text-2xl font-semibold text-white">
                  {currentOriginal}
                </div>
              </div>
              <div className="pt-4 border-t border-cyan-500/20">
                <div className="text-sm font-medium text-gray-400 mb-2">
                  {SUPPORTED_LANGUAGES.find(l => l.code === targetLang)?.name}:
                </div>
                <div className="text-2xl font-semibold text-cyan-400">
                  {currentTranslated}
                </div>
              </div>
            </motion.div>
          )}

          {/* Segments History */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {segments.length === 0 && !isTranslating && (
              <div className="text-center py-12 text-gray-400">
                <Mic className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-white">Click "Start" to begin live translation</p>
                <p className="text-sm mt-2">
                  Your speech will be transcribed and translated in real-time
                </p>
              </div>
            )}

            {segments.map((segment, index) => (
              <motion.div
                key={segment.id}
                className="p-4 bg-[#0A1628] rounded-lg border border-white/5 hover:border-cyan-500/30 transition-all"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs text-gray-500">
                    {segment.timestamp.toLocaleTimeString()}
                  </span>
                  {segment.confidence && (
                    <span className="text-xs text-gray-500">
                      {Math.round(segment.confidence * 100)}% confidence
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-xs font-medium text-gray-400">
                      {SUPPORTED_LANGUAGES.find(l => l.code === segment.sourceLang)?.name}:
                    </span>
                    <p className="text-white mt-1">{segment.originalText}</p>
                  </div>
                  <div className="pt-2 border-t border-white/5">
                    <span className="text-xs font-medium text-gray-400">
                      {SUPPORTED_LANGUAGES.find(l => l.code === segment.targetLang)?.name}:
                    </span>
                    <p className="text-cyan-400 font-medium mt-1">
                      {segment.translatedText}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div 
          className="mt-6 bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="font-semibold text-cyan-400 mb-3">How to use:</h3>
          <ul className="text-sm text-gray-400 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span>
              <span>Select your source and target languages (or use Auto-detect)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span>
              <span>Choose between Manual (click to stop) or Continuous (auto-process) mode</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span>
              <span>Click "Start" and speak into your microphone</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span>
              <span>Your speech will be transcribed and translated in real-time</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span>
              <span>Click "Stop" to end the session or "Clear" to remove all captions</span>
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default LiveTranslator
