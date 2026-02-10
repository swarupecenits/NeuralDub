import React, { useRef, useState } from 'react'
import { Mic, Square, Trash2, Play } from 'lucide-react'
import { Button } from './Button'

interface AudioRecorderProps {
  onAudioRecorded: (blob: Blob, duration: number) => void
  disabled?: boolean
}

export function AudioRecorder({ onAudioRecorded, disabled = false }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [duration, setDuration] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' })
        setRecordedBlob(blob)
        onAudioRecorded(blob, duration)

        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setDuration(0)

      durationIntervalRef.current = setInterval(() => {
        setDuration((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error('Failed to start recording:', error)
      alert('Microphone access denied. Please enable microphone permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current)
      }
    }
  }

  const clearRecording = () => {
    setRecordedBlob(null)
    setDuration(0)
  }

  const playRecording = () => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob)
      const audio = new Audio(url)
      audio.play()
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="w-full space-y-4">
      {/* Recording Controls */}
      <div className="flex gap-3">
        {!isRecording && !recordedBlob && (
          <Button
            onClick={startRecording}
            disabled={disabled}
            className="flex items-center gap-2">
            <Mic className="w-4 h-4" />
            Start Recording
          </Button>
        )}

        {isRecording && (
          <>
            <div className="flex-1 bg-[#0A1628] rounded-lg border border-red-500/50 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="text-white font-semibold">Recording...</span>
                <span className="text-red-400 font-mono">{formatDuration(duration)}</span>
              </div>
            </div>
            <Button
              onClick={stopRecording}
              variant="secondary"
              className="flex items-center gap-2">
              <Square className="w-4 h-4" />
              Stop
            </Button>
          </>
        )}

        {recordedBlob && !isRecording && (
          <>
            <div className="flex-1 bg-[#0A1628] rounded-lg border border-cyan-500/50 px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-cyan-400 text-sm font-semibold mb-1">Recording Ready</p>
                <p className="text-gray-400 text-sm">
                  Duration: {formatDuration(duration)} • Size:{' '}
                  {(recordedBlob.size / 1024).toFixed(1)}KB
                </p>
              </div>
            </div>
            <Button
              onClick={playRecording}
              variant="secondary"
              className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Play
            </Button>
            <Button
              onClick={clearRecording}
              variant="secondary"
              className="flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Clear
            </Button>
          </>
        )}
      </div>

      {/* Info Text */}
      {!recordedBlob && !isRecording && (
        <p className="text-sm text-gray-400">
          🎤 Click to record audio from your microphone or upload an audio file
        </p>
      )}
    </div>
  )
}

export default AudioRecorder
