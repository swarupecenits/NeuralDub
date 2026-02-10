import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Upload, Mic, Zap } from 'lucide-react'
import { Button } from '../components/Button'
import { AudioRecorder } from '../components/AudioRecorder'
import { LanguageSelector } from '../components/LanguageSelector'
import { ProgressIndicator } from '../components/ProgressIndicator'
import { WaveformVisualizer } from '../components/WaveformVisualizer'
import { TranslationResults } from '../components/TranslationResults'
import {
  transcribeAudio,
  validateAudioFile,
  extractTranscriptionMetrics,
  WhisperTranscription,
  WhisperMetrics,
} from '../utils/whisperService'
import {
  translateText,
  extractTranslationMetrics,
  formatTranslationMetrics,
  TranslationMetrics,
} from '../utils/translationService'

type Step = 'input' | 'processing' | 'results'
type InputMode = 'record' | 'upload' | 'text'

interface TranslationState {
  originalText: string
  translatedText: string
  sourceLang: string
  targetLang: string
  transcriptionMetrics?: WhisperMetrics
  translationMetrics?: TranslationMetrics
  error?: string
  isLoading: boolean
}

const LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'bn', label: 'Bengali' },
  { code: 'gu', label: 'Gujarati' },
  { code: 'kn', label: 'Kannada' },
  { code: 'ml', label: 'Malayalam' },
  { code: 'mr', label: 'Marathi' },
  { code: 'or', label: 'Odia' },
  { code: 'pa', label: 'Punjabi' },
  { code: 'ta', label: 'Tamil' },
  { code: 'te', label: 'Telugu' },
  { code: 'as', label: 'Assamese' },
  { code: 'ur', label: 'Urdu' },
]

export function Translator() {
  const [step, setStep] = useState<Step>('input')
  const [inputMode, setInputMode] = useState<InputMode>('record')
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [manualText, setManualText] = useState('')
  const [sourceLang, setSourceLang] = useState('en')
  const [targetLang, setTargetLang] = useState('hi')
  const [progress, setProgress] = useState(0)
  const [progressStatus, setProgressStatus] = useState('')

  const [translationState, setTranslationState] = useState<TranslationState>({
    originalText: '',
    translatedText: '',
    sourceLang: 'en',
    targetLang: 'hi',
    isLoading: false,
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle audio recorded from microphone
  const handleAudioRecorded = (blob: Blob, duration: number) => {
    const file = new File([blob], `recording-${Date.now()}.wav`, { type: 'audio/wav' })
    setAudioFile(file)
  }

  // Handle audio file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validation = validateAudioFile(file)
      if (!validation.valid) {
        alert(validation.error)
        return
      }
      setAudioFile(file)
    }
  }

  // Start translation process
  const startTranslation = async () => {
    try {
      setStep('processing')
      setProgress(0)
      setProgressStatus('Initializing...')
      let finalText = ''

      // Step 1: Handle input (transcribe if audio, or use manual text)
      if (inputMode === 'record' || inputMode === 'upload') {
        if (!audioFile) {
          throw new Error('No audio file selected')
        }

        setProgressStatus('Transcribing audio with Whisper...')
        setProgress(20)

        const startTranscribeTime = Date.now()
        let transcription: WhisperTranscription

        try {
          transcription = await transcribeAudio(audioFile, sourceLang)
        } catch (error) {
          // If backend transcription fails, show informative message
          console.error('Transcription error:', error)
          throw new Error(
            'Speech recognition failed. Please ensure Whisper backend is running and audio is clear.'
          )
        }

        finalText = transcription.text
        const transcribeDuration = (Date.now() - startTranscribeTime) / 1000

        // Calculate transcription metrics
        const transcriptionMetrics = extractTranscriptionMetrics(transcription, transcribeDuration)
        setTranslationState((prev) => ({
          ...prev,
          originalText: finalText,
          transcriptionMetrics,
        }))

        setProgress(40)
      } else {
        // Use manual text input
        finalText = manualText
        setTranslationState((prev) => ({
          ...prev,
          originalText: finalText,
        }))
        setProgress(40)
      }

      if (!finalText || finalText.trim().length === 0) {
        throw new Error('No text to translate')
      }

      // Step 2: Translate text with IndicTrans2
      setProgressStatus('Translating with IndicTrans2...')
      setProgress(60)

      const startTranslateTime = Date.now()
      const translationResponse = await translateText({
        text: finalText,
        sourceLang,
        targetLang,
      })

      const translateDuration = (Date.now() - startTranslateTime) / 1000
      const translationMetrics = extractTranslationMetrics(
        finalText,
        translationResponse.translatedText,
        sourceLang,
        targetLang,
        translationResponse.confidence,
        translateDuration
      )

      setProgress(90)
      setProgressStatus('Finalizing results...')

      // Step 3: Update state with results
      setTranslationState((prev) => ({
        ...prev,
        translatedText: translationResponse.translatedText,
        translationMetrics,
        sourceLang,
        targetLang,
      }))

      setProgress(100)
      setTimeout(() => setStep('results'), 500)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      console.error('Translation error:', error)
      setTranslationState((prev) => ({
        ...prev,
        error: errorMessage,
      }))
      setStep('input')
      alert(`Error: ${errorMessage}`)
    }
  }

  // Reset everything
  const reset = () => {
    setStep('input')
    setInputMode('record')
    setAudioFile(null)
    setManualText('')
    setProgress(0)
    setProgressStatus('')
    setTranslationState({
      originalText: '',
      translatedText: '',
      sourceLang: 'en',
      targetLang: 'hi',
      isLoading: false,
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Swap languages
  const swapLanguages = () => {
    setSourceLang(targetLang)
    setTargetLang(sourceLang)
  }

  // Download results as JSON
  const downloadResults = () => {
    const results = {
      originalText: translationState.originalText,
      translatedText: translationState.translatedText,
      sourceLang: translationState.sourceLang,
      targetLang: translationState.targetLang,
      timestamp: new Date().toISOString(),
      transcriptionMetrics: translationState.transcriptionMetrics,
      translationMetrics: translationState.translationMetrics,
    }

    const dataStr = JSON.stringify(results, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `translation-results-${Date.now()}.json`
    link.click()
  }


  return (
    <main className="min-h-screen bg-[#0A1628] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Speech Recognition & Translation
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            Convert speech to text with Whisper and translate across 13+ Indic languages with
            IndicTrans2
          </p>
        </motion.div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {step === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}>
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Left: Input Selection */}
                <div className="lg:col-span-1">
                  <div className="bg-[#0D1F36] border border-white/10 rounded-2xl p-6 sticky top-24">
                    <h2 className="text-xl font-bold text-white mb-6">Step 1: Input Mode</h2>

                    <div className="space-y-3">
                      {[
                        { mode: 'record' as const, label: ' Record Audio', icon: Mic },
                        { mode: 'upload' as const, label: ' Upload File', icon: Upload },
                        { mode: 'text' as const, label: ' Manual Text', icon: Zap },
                      ].map(({ mode, label }) => (
                        <button
                          key={mode}
                          onClick={() => setInputMode(mode)}
                          className={`w-full px-4 py-3 rounded-lg font-semibold transition-all ${
                            inputMode === mode
                              ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50'
                              : 'bg-[#0A1628] text-gray-300 border border-white/10 hover:border-cyan-500/50'
                          }`}>
                          {label}
                        </button>
                      ))}
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/10">
                      <h3 className="text-lg font-bold text-white mb-4">Step 2: Languages</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm text-gray-400 mb-2 block">Source Language</label>
                          <select
                            value={sourceLang}
                            onChange={(e) => setSourceLang(e.target.value)}
                            className="w-full bg-[#0A1628] border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none">
                            {LANGUAGE_OPTIONS.map((lang) => (
                              <option key={lang.code} value={lang.code}>
                                {lang.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <button
                          onClick={swapLanguages}
                          className="w-full py-2 px-4 bg-[#0A1628] border border-white/10 rounded-lg text-cyan-400 hover:bg-cyan-500/10 transition-colors font-semibold">
                          ⇄ Swap Languages
                        </button>

                        <div>
                          <label className="text-sm text-gray-400 mb-2 block">Target Language</label>
                          <select
                            value={targetLang}
                            onChange={(e) => setTargetLang(e.target.value)}
                            className="w-full bg-[#0A1628] border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none">
                            {LANGUAGE_OPTIONS.map((lang) => (
                              <option key={lang.code} value={lang.code}>
                                {lang.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Input Handler */}
                <div className="lg:col-span-2">
                  <div className="bg-[#0D1F36] border border-white/10 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">
                      {inputMode === 'record'
                        ? '🎤 Record Your Speech'
                        : inputMode === 'upload'
                          ? '📁 Upload Audio File'
                          : '✍️ Enter Text'}
                    </h2>

                    {inputMode === 'record' && (
                      <div className="space-y-6">
                        <AudioRecorder onAudioRecorded={handleAudioRecorded} />
                        {audioFile && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
                            <p className="text-cyan-300">
                              ✓ Recording ready: {audioFile.name} ({(audioFile.size / 1024).toFixed(1)}KB)
                            </p>
                          </motion.div>
                        )}
                      </div>
                    )}

                    {inputMode === 'upload' && (
                      <div className="space-y-6">
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-cyan-500/50 rounded-xl p-8 text-center cursor-pointer hover:border-cyan-500 hover:bg-cyan-500/5 transition-all">
                          <Upload className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                          <p className="text-white font-semibold mb-2">Click to upload audio file</p>
                          <p className="text-gray-400 text-sm">
                            Supported: MP3, WAV, OGG, MP4, FLAC (Max 25MB)
                          </p>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="audio/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </div>

                        {audioFile && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
                            <p className="text-cyan-300">
                              ✓ File selected: {audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(2)}MB)
                            </p>
                            <button
                              onClick={() => setAudioFile(null)}
                              className="mt-2 text-sm text-red-400 hover:text-red-300">
                              Clear selection
                            </button>
                          </motion.div>
                        )}
                      </div>
                    )}

                    {inputMode === 'text' && (
                      <textarea
                        value={manualText}
                        onChange={(e) => setManualText(e.target.value)}
                        placeholder="Enter text to translate..."
                        className="w-full h-48 bg-[#0A1628] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none resize-none"
                      />
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-8">
                      <Button
                        onClick={startTranslation}
                        disabled={
                          (inputMode !== 'text' && !audioFile) || (inputMode === 'text' && !manualText)
                        }
                        className="flex-1">
                        Start Translation
                      </Button>
                      <Button
                        onClick={reset}
                        variant="secondary"
                        className="flex-1">
                        Reset
                      </Button>
                    </div>

                    {/* Info Box */}
                    <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                      <p className="text-blue-300 text-sm">
                        <strong>ℹ️ How it works:</strong> Audio is transcribed using OpenAI Whisper,
                        then translated using IndicTrans2. You'll see detailed metrics for both
                        processes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}>
              <div className="bg-[#0D1F36] border border-white/10 rounded-2xl p-8 text-center space-y-8">
                <h2 className="text-3xl font-bold text-white">Processing Your Content</h2>

                <WaveformVisualizer isProcessing={true} />

                <ProgressIndicator progress={progress} status={progressStatus} />

                <div className="bg-[#0A1628] rounded-xl p-4 border border-white/10">
                  <p className="text-gray-300 text-sm">
                    This may take a few moments depending on audio length and server load...
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}>
              <div className="space-y-8">
                <TranslationResults
                  result={{
                    originalText: translationState.originalText,
                    translatedText: translationState.translatedText,
                    sourceLang: translationState.sourceLang,
                    targetLang: translationState.targetLang,
                    metrics: translationState.translationMetrics
                      ? formatTranslationMetrics(translationState.translationMetrics)
                      : {},
                    recognitionMetrics: translationState.transcriptionMetrics
                      ? {
                          'Duration': `${translationState.transcriptionMetrics.duration.toFixed(2)}s`,
                          'Words': translationState.transcriptionMetrics.wordCount,
                          'Characters': translationState.transcriptionMetrics.characterCount,
                          'Language': translationState.transcriptionMetrics.language.toUpperCase(),
                          'Confidence': `${(translationState.transcriptionMetrics.confidence * 100).toFixed(1)}%`,
                          'Processing Time': `${translationState.transcriptionMetrics.processingTime.toFixed(2)}s`,
                        }
                      : undefined,
                  }}
                  onDownload={downloadResults}
                />

                {/* Bottom Action Buttons */}
                <div className="flex gap-4 flex-wrap">
                  <Button onClick={reset} className="flex-1">
                    New Translation
                  </Button>
                  <Button onClick={downloadResults} variant="secondary" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 grid md:grid-cols-3 gap-6">
          {[
            {
              icon: '🎤',
              title: 'Whisper ASR',
              description: 'State-of-the-art speech recognition by OpenAI',
            },
            {
              icon: '🌐',
              title: 'IndicTrans2',
              description: 'Support for 22 Indic languages with high accuracy',
            },
            {
              icon: '📊',
              title: 'Detailed Metrics',
              description: 'See confidence scores and processing time for each step',
            },
          ].map((feature, idx) => (
            <div key={idx} className="bg-[#0D1F36] border border-white/10 rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-white font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </main>
  )
}

export default Translator