import React, { useState, useRef } from 'react';
import { Upload, Mic, Play, Trash2, Download, Pause } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';

export function VoiceClone() {
  const [referenceAudio, setReferenceAudio] = useState<File | null>(null);
  const [textToSpeak, setTextToSpeak] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isPlayingGenerated, setIsPlayingGenerated] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [savedGenerations, setSavedGenerations] = useState<Array<{
    id: string;
    text: string;
    audioUrl: string;
    timestamp: string;
  }>>([]);

  // Generate dummy audio URL (sine wave)
  const generateDummyAudio = () => {
    const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return '';
    const audioContext = new AudioContextClass();
    const duration = 3;
    const sampleRate = audioContext.sampleRate;
    const numChannels = 1;
    const frameCount = sampleRate * duration;
    const audioBuffer = audioContext.createBuffer(numChannels, frameCount, sampleRate);
    const channelData = audioBuffer.getChannelData(0);
    
    // Generate a simple tone
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = Math.sin(2 * Math.PI * 440 * i / sampleRate) * 0.3;
    }
    
    // Convert to WAV
    const wav = audioBufferToWav(audioBuffer);
    const blob = new Blob([wav], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  };

  const audioBufferToWav = (buffer: AudioBuffer) => {
    const length = buffer.length * buffer.numberOfChannels * 2 + 44;
    const arrayBuffer = new ArrayBuffer(length);
    const view = new DataView(arrayBuffer);
    const channels = [];
    let offset = 0;
    let pos = 0;

    // Write WAV header
    const setUint16 = (data: number) => {
      view.setUint16(pos, data, true);
      pos += 2;
    };
    const setUint32 = (data: number) => {
      view.setUint32(pos, data, true);
      pos += 4;
    };

    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); // file length - 8
    setUint32(0x45564157); // "WAVE"
    setUint32(0x20746d66); // "fmt " chunk
    setUint32(16); // length = 16
    setUint16(1); // PCM (uncompressed)
    setUint16(buffer.numberOfChannels);
    setUint32(buffer.sampleRate);
    setUint32(buffer.sampleRate * 2 * buffer.numberOfChannels);
    setUint16(buffer.numberOfChannels * 2);
    setUint16(16);
    setUint32(0x61746164); // "data" - chunk
    setUint32(length - pos - 4);

    // Write interleaved data
    for (let i = 0; i < buffer.numberOfChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }

    while (pos < length) {
      for (let i = 0; i < buffer.numberOfChannels; i++) {
        const sample = Math.max(-1, Math.min(1, channels[i][offset]));
        view.setInt16(pos, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
        pos += 2;
      }
      offset++;
    }

    return arrayBuffer;
  };

  const handleReferenceAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReferenceAudio(file);
    }
  };

  const handleGenerateSpeech = () => {
    if (!referenceAudio || !textToSpeak.trim()) {
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setGeneratedAudioUrl(null);
    
    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          // Generate dummy audio after generation completes
          const audioUrl = generateDummyAudio();
          setGeneratedAudioUrl(audioUrl);
          return 100;
        }
        return prev + Math.random() * 20;
      });
    }, 800);
  };

  const handleSaveGeneration = () => {
    if (generatedAudioUrl && textToSpeak) {
      const newGeneration = {
        id: Date.now().toString(),
        text: textToSpeak,
        audioUrl: generatedAudioUrl,
        timestamp: new Date().toLocaleString(),
      };
      setSavedGenerations((prev) => [newGeneration, ...prev]);
      setTextToSpeak('');
      setGeneratedAudioUrl(null);
      setGenerationProgress(0);
    }
  };

  const handlePlayPause = (audioUrl: string, id: string) => {
    if (playingId === id) {
      // Pause current audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setPlayingId(null);
    } else {
      // Play new audio
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.play();
      setPlayingId(id);
      audio.onended = () => {
        setPlayingId(null);
      };
    }
  };

  const handlePlayGeneratedAudio = () => {
    if (!generatedAudioUrl) return;
    
    if (isPlayingGenerated) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlayingGenerated(false);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(generatedAudioUrl);
      audioRef.current = audio;
      audio.play();
      setIsPlayingGenerated(true);
      audio.onended = () => {
        setIsPlayingGenerated(false);
      };
    }
  };

  const handleDownload = (audioUrl: string, text: string) => {
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `cloned_voice_${text.slice(0, 20).replace(/\s+/g, '_')}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteGeneration = (id: string) => {
    setSavedGenerations((prev) => prev.filter((gen) => gen.id !== id));
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
            Clone any voice and generate speech from text using AI
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Generation Panel */}
          <motion.div className="lg:col-span-2 space-y-6" variants={itemVariants}>
            {/* Reference Audio Upload */}
            <motion.div
              className="bg-[#0D1F36] border border-white/10 rounded-xl p-6"
              variants={itemVariants}
            >
              <label className="block text-sm font-semibold text-white mb-4">
                1. Upload Reference Audio
              </label>
              <div className="border-2 border-dashed border-cyan-500/30 rounded-lg p-8 text-center hover:border-cyan-500/50 transition">
                <Upload className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">
                  Upload an audio sample of the voice you want to clone
                </p>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleReferenceAudioUpload}
                  className="hidden"
                  id="reference-audio-input"
                  aria-label="Upload reference audio"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('reference-audio-input')?.click()}
                >
                  Choose Audio File
                </Button>
              </div>

              {referenceAudio && (
                <motion.div
                  className="mt-4 p-4 bg-[#0A1628] rounded-lg border border-cyan-500/20"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <Mic className="w-5 h-5 text-cyan-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-semibold truncate">
                          {referenceAudio.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {(referenceAudio.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setReferenceAudio(null)}
                      className="text-red-400 hover:text-red-300 transition"
                      aria-label="Remove reference audio"
                      title="Remove reference audio"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Text Input */}
            <motion.div
              className="bg-[#0D1F36] border border-white/10 rounded-xl p-6"
              variants={itemVariants}
            >
              <label className="block text-sm font-semibold text-white mb-4">
                2. Enter Text to Generate
              </label>
              <textarea
                placeholder="Type the text you want to convert to speech..."
                value={textToSpeak}
                onChange={(e) => setTextToSpeak(e.target.value)}
                rows={6}
                className="w-full bg-[#0A1628] border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition resize-none"
              />
              <div className="mt-2 flex justify-between items-center">
                <p className="text-xs text-gray-400">{textToSpeak.length} characters</p>
                {textToSpeak.length > 500 && (
                  <p className="text-xs text-yellow-400">
                    ⚠ Long text may take more time to process
                  </p>
                )}
              </div>
            </motion.div>

            {/* Generation Progress */}
            {isGenerating && (
              <motion.div
                className="bg-[#0D1F36] border border-cyan-500/30 rounded-xl p-6 space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-cyan-400 text-sm font-semibold">
                  Generating speech with cloned voice...
                </p>
                <div className="w-full bg-[#0A1628] rounded-full h-3 border border-cyan-500/20">
                  <motion.div
                    className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-full rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${generationProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-gray-400 text-xs">
                  {Math.round(generationProgress)}% • Processing audio...
                </p>
              </motion.div>
            )}

            {/* Generated Audio Preview */}
            {generationProgress === 100 && !isGenerating && generatedAudioUrl && (
              <motion.div
                className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-green-400 text-sm font-semibold">
                  ✓ Speech generated successfully!
                </p>
                <div className="bg-[#0A1628] rounded-lg p-4 border border-green-500/20">
                  <p className="text-white text-sm font-semibold mb-2">Generated Audio</p>
                  <p className="text-gray-400 text-xs mb-4 italic">"{textToSpeak}"</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePlayGeneratedAudio}
                      className="flex-1"
                    >
                      {isPlayingGenerated ? (
                        <>
                          <Pause className="w-3 h-3" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3" />
                          Play
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(generatedAudioUrl, textToSpeak)}
                      className="flex-1"
                    >
                      <Download className="w-3 h-3" />
                      Download
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveGeneration}
                      className="flex-1"
                    >
                      Save to History
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Generate Button */}
            <motion.div variants={itemVariants}>
              <Button
                onClick={handleGenerateSpeech}
                disabled={isGenerating || !referenceAudio || !textToSpeak.trim()}
                size="lg"
                className="w-full"
              >
                {isGenerating ? 'Generating...' : 'Generate Speech'}
              </Button>
            </motion.div>
          </motion.div>

          {/* Instructions Sidebar */}
          <motion.div className="space-y-6" variants={containerVariants}>
            {/* How it Works */}
            <motion.div
              className="bg-[#0D1F36] border border-white/10 rounded-xl p-6"
              variants={itemVariants}
            >
              <h3 className="text-white font-bold text-lg mb-4">How It Works</h3>
              <ul className="space-y-3">
                {[
                  'Upload a clear audio sample (5-30 seconds)',
                  'Enter the text you want to be spoken',
                  'Click "Generate Speech" to create audio',
                  'Play, download, or save to history',
                ].map((tip, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-cyan-400 font-bold shrink-0">{i + 1}.</span>
                    <span className="text-sm text-gray-300">{tip}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Audio Requirements */}
            <motion.div
              className="bg-[#0D1F36] border border-white/10 rounded-xl p-6"
              variants={itemVariants}
            >
              <h3 className="text-white font-bold text-lg mb-4">Audio Requirements</h3>
              <div className="space-y-4">
                {[
                  { label: 'Format', value: 'MP3, WAV, OGG, M4A' },
                  { label: 'Quality', value: 'Clear speech, minimal noise' },
                  { label: 'Duration', value: '5-30 seconds recommended' },
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

        {/* Generation History */}
        {savedGenerations.length > 0 && (
          <motion.div className="mt-16" variants={itemVariants}>
            <h2 className="text-3xl font-bold text-white mb-8">Generation History</h2>
            <motion.div className="space-y-4" variants={containerVariants}>
              {savedGenerations.map((generation) => (
                <motion.div
                  key={generation.id}
                  className="bg-[#0D1F36] border border-white/10 rounded-xl p-6 hover:border-cyan-500/50 transition"
                  variants={itemVariants}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-white text-sm mb-2 italic">"{generation.text}"</p>
                      <p className="text-xs text-gray-400">{generation.timestamp}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handlePlayPause(generation.audioUrl, generation.id)}
                    >
                      {playingId === generation.id ? (
                        <>
                          <Pause className="w-3 h-3" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3" />
                          Play
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDownload(generation.audioUrl, generation.text)}
                    >
                      <Download className="w-3 h-3" />
                      Download
                    </Button>
                    <button
                      className="px-3 py-2 text-red-400 hover:text-red-300 transition"
                      onClick={() => handleDeleteGeneration(generation.id)}
                      aria-label="Delete generation"
                      title="Delete generation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default VoiceClone;
