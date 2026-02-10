/**
 * Whisper Service - OpenAI's Automatic Speech Recognition
 * Handles speech-to-text conversion with detailed recognition metrics
 */

export interface WhisperTranscription {
  text: string
  language: string
  confidence: number
  duration: number
  segments: WhisperSegment[]
}

export interface WhisperSegment {
  id: number
  start: number
  end: number
  text: string
  confidence: number
}

export interface WhisperMetrics {
  duration: number
  wordCount: number
  characterCount: number
  language: string
  confidence: number
  processingTime: number
}

/**
 * Transcribe audio file using Whisper ASR via backend API
 */
export async function transcribeAudio(
  audioFile: File,
  language?: string
): Promise<WhisperTranscription> {
  const formData = new FormData()
  formData.append('file', audioFile)
  if (language) {
    formData.append('language', language)
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/speech/transcribe`,
    {
      method: 'POST',
      body: formData,
    }
  )

  if (!response.ok) {
    throw new Error(`Transcription failed: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Calculate confidence score from multiple segments
 */
export function calculateAverageConfidence(segments: WhisperSegment[]): number {
  if (segments.length === 0) return 0
  const sum = segments.reduce((acc, seg) => acc + seg.confidence, 0)
  return sum / segments.length
}

/**
 * Extract metrics from transcription
 */
export function extractTranscriptionMetrics(
  transcription: WhisperTranscription,
  processingTime: number
): WhisperMetrics {
  const text = transcription.text
  const words = text.split(/\s+/).filter((word) => word.length > 0)

  return {
    duration: transcription.duration,
    wordCount: words.length,
    characterCount: text.length,
    language: transcription.language,
    confidence: calculateAverageConfidence(transcription.segments),
    processingTime,
  }
}

/**
 * Format metrics for display
 */
export function formatMetrics(metrics: WhisperMetrics): {
  [key: string]: string | number
} {
  return {
    'Duration': `${metrics.duration.toFixed(2)}s`,
    'Words': metrics.wordCount,
    'Characters': metrics.characterCount,
    'Language': metrics.language.toUpperCase(),
    'Confidence': `${(metrics.confidence * 100).toFixed(1)}%`,
    'Processing Time': `${metrics.processingTime.toFixed(2)}s`,
  }
}

/**
 * Validate audio file before transcription
 */
export function validateAudioFile(file: File): {
  valid: boolean
  error?: string
} {
  const maxSize = 25 * 1024 * 1024 // 25MB limit (Whisper default)
  const validFormats = [
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'audio/mp4',
    'audio/flac',
  ]

  if (!validFormats.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported format: ${file.type}. Supported: MP3, WAV, OGG, MP4, FLAC`,
    }
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum: 25MB`,
    }
  }

  return { valid: true }
}

/**
 * Detect language from audio (optional advanced feature)
 */
export async function detectLanguage(audioFile: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', audioFile)

  const response = await fetch(
    `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/speech/detect-language`,
    {
      method: 'POST',
      body: formData,
    }
  )

  if (!response.ok) {
    throw new Error('Language detection failed')
  }

  const data = await response.json()
  return data.language
}
