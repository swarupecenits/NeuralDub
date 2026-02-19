import { useState, useCallback, useRef } from 'react'
import { transcribeAudio } from '../utils/whisperService'
import { translateText } from '../utils/translationService'

interface TranscriptionSegment {
  id: string
  timestamp: Date
  originalText: string
  translatedText: string
  sourceLang: string
  targetLang: string
  confidence?: number
}

interface LiveTranscriptionState {
  isProcessing: boolean
  segments: TranscriptionSegment[]
  currentOriginal: string
  currentTranslated: string
  error: string | null
  detectedLanguage: string | null
}

interface UseLiveTranscriptionReturn extends LiveTranscriptionState {
  processAudioChunk: (audioBlob: Blob, sourceLang: string, targetLang: string) => Promise<void>
  clearTranscriptions: () => void
  setDetectedLanguage: (lang: string) => void
}

/**
 * Custom hook for live transcription and translation
 * Processes audio chunks and generates real-time captions with translation
 */
export const useLiveTranscription = (): UseLiveTranscriptionReturn => {
  const [state, setState] = useState<LiveTranscriptionState>({
    isProcessing: false,
    segments: [],
    currentOriginal: '',
    currentTranslated: '',
    error: null,
    detectedLanguage: null,
  })

  const processingRef = useRef(false)
  const segmentIdCounter = useRef(0)

  const processAudioChunk = useCallback(async (
    audioBlob: Blob,
    sourceLang: string,
    targetLang: string
  ) => {
    // Prevent concurrent processing
    if (processingRef.current) {
      return
    }

    processingRef.current = true
    setState(prev => ({ ...prev, isProcessing: true, error: null }))

    try {
      // Convert blob to file
      const audioFile = new File([audioBlob], 'audio.webm', { type: audioBlob.type })

      // Transcribe audio using Whisper
      const transcriptionResult = await transcribeAudio(
        audioFile,
        sourceLang === 'auto' ? undefined : sourceLang
      )

      if (!transcriptionResult || !transcriptionResult.text) {
        throw new Error('Transcription failed')
      }

      const originalText = transcriptionResult.text.trim()
      const detectedLang = transcriptionResult.language || sourceLang

      // Update detected language if auto-detect
      if (sourceLang === 'auto' && detectedLang) {
        setState(prev => ({ ...prev, detectedLanguage: detectedLang }))
      }

      // Don't process empty transcriptions
      if (!originalText) {
        setState(prev => ({ ...prev, isProcessing: false }))
        processingRef.current = false
        return
      }

      // Translate the transcribed text
      let translatedText = originalText
      if (detectedLang !== targetLang) {
        const translationResult = await translateText({
          text: originalText,
          sourceLang: detectedLang,
          targetLang: targetLang
        })

        if (translationResult && translationResult.translatedText) {
          translatedText = translationResult.translatedText
        }
      }

      // Create new segment
      const newSegment: TranscriptionSegment = {
        id: `segment-${segmentIdCounter.current++}`,
        timestamp: new Date(),
        originalText,
        translatedText,
        sourceLang: detectedLang,
        targetLang,
        confidence: transcriptionResult.confidence,
      }

      setState(prev => ({
        ...prev,
        segments: [...prev.segments, newSegment],
        currentOriginal: originalText,
        currentTranslated: translatedText,
        isProcessing: false,
        detectedLanguage: detectedLang,
      }))
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to process audio'
      
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isProcessing: false,
      }))
    } finally {
      processingRef.current = false
    }
  }, [])

  const clearTranscriptions = useCallback(() => {
    setState({
      isProcessing: false,
      segments: [],
      currentOriginal: '',
      currentTranslated: '',
      error: null,
      detectedLanguage: null,
    })
    segmentIdCounter.current = 0
  }, [])

  const setDetectedLanguage = useCallback((lang: string) => {
    setState(prev => ({ ...prev, detectedLanguage: lang }))
  }, [])

  return {
    ...state,
    processAudioChunk,
    clearTranscriptions,
    setDetectedLanguage,
  }
}

export default useLiveTranscription
