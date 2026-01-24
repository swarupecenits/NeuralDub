import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, ArrowRight, RefreshCw, Play } from 'lucide-react';
import { Button } from '../components/Button';
import { FileUpload } from '../components/FileUpload';
import { LanguageSelector } from '../components/LanguageSelector';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { WaveformVisualizer } from '../components/WaveformVisualizer';

type Step = 'upload' | 'configure' | 'processing' | 'preview';

export function Translator() {
  const [step, setStep] = useState<Step>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [progress, setProgress] = useState(0);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setStep('configure');
  };

  const startTranslation = () => {
    setStep('processing');
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 2;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setStep('preview');
      }
    }, 60);
  };

  const reset = () => {
    setFile(null);
    setStep('upload');
    setProgress(0);
  };

  return (
    <main className="min-h-screen bg-[#0A1628] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-12 space-x-4 text-sm font-medium">
          {['Upload', 'Configure', 'Preview'].map((label, index) => {
            const isActive =
              (index === 0 && step === 'upload') ||
              (index === 1 && (step === 'configure' || step === 'processing')) ||
              (index === 2 && step === 'preview');
            const isCompleted =
              (index === 0 && step !== 'upload') ||
              (index === 1 && step === 'preview');

            return (
              <div key={label} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isActive ? 'bg-cyan-500 text-white' : isCompleted ? 'bg-cyan-400 text-white' : 'bg-gray-700 text-gray-400'
                  }`}>
                  {isCompleted ? '✓' : index + 1}
                </div>
                <span className={`ml-2 ${isActive || isCompleted ? 'text-cyan-400' : 'text-gray-500'}`}>
                  {label}
                </span>
                {index < 2 && (
                  <div
                    className={`w-12 h-0.5 mx-4 ${isCompleted ? 'bg-cyan-500' : 'bg-gray-800'}`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Main Card */}
        <motion.div
          layout
          className="bg-[#0D1F36] border border-white/10 rounded-2xl p-8 shadow-2xl">
          <AnimatePresence mode="wait">
            {step === 'upload' && (
              <motion.div
                key="upload"
                initial={{
                  opacity: 0,
                  x: 20
                }}
                animate={{
                  opacity: 1,
                  x: 0
                }}
                exit={{
                  opacity: 0,
                  x: -20
                }}>
                <h2 className="text-2xl font-bold text-white mb-6">Upload Your Media</h2>
                <FileUpload onFileSelect={handleFileSelect} />
              </motion.div>
            )}

            {step === 'configure' && (
              <motion.div
                key="configure"
                initial={{
                  opacity: 0,
                  x: 20
                }}
                animate={{
                  opacity: 1,
                  x: 0
                }}
                exit={{
                  opacity: 0,
                  x: -20
                }}
                className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Configure Translation</h2>
                  <div className="p-4 bg-[#0A1628] rounded-xl border border-white/10 mb-6">
                    <p className="text-gray-300 flex items-center">
                      <span className="text-cyan-400 mr-2">✓</span>
                      {file?.name} ({String(((file?.size || 0) / 1024 / 1024).toFixed(2))}) MB
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <LanguageSelector
                    label="Source Language"
                    value={sourceLang}
                    onChange={setSourceLang}
                  />
                  <LanguageSelector
                    label="Target Language"
                    value={targetLang}
                    onChange={setTargetLang}
                  />
                </div>

                <div className="flex gap-4">
                  <Button variant="secondary" onClick={() => setStep('upload')}>
                    Back
                  </Button>
                  <Button onClick={startTranslation} className="flex-1">
                    Start Translation
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 'processing' && (
              <motion.div
                key="processing"
                initial={{
                  opacity: 0
                }}
                animate={{
                  opacity: 1
                }}
                exit={{
                  opacity: 0
                }}
                className="py-12 text-center space-y-8">
                <h2 className="text-2xl font-bold text-white">Processing Your Media</h2>
                <WaveformVisualizer isProcessing={true} />
                <ProgressIndicator
                  progress={progress}
                  status={
                    progress < 30
                      ? 'Analyzing audio...'
                      : progress < 60
                        ? 'Cloning voice...'
                        : 'Synthesizing speech...'
                  }
                />
              </motion.div>
            )}

            {step === 'preview' && (
              <motion.div
                key="preview"
                initial={{
                  opacity: 0,
                  scale: 0.95
                }}
                animate={{
                  opacity: 1,
                  scale: 1
                }}
                className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Preview Result</h2>
                  <div className="bg-[#0A1628] rounded-xl border border-white/10 p-6 space-y-4">
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Original</p>
                      <audio
                        controls
                        className="w-full rounded-lg"
                        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
                      />
                    </div>
                    <div className="border-t border-white/10 pt-4">
                      <p className="text-gray-400 text-sm mb-2">Translated</p>
                      <audio
                        controls
                        className="w-full rounded-lg"
                        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
                  <p className="text-cyan-300 text-sm">
                    ✓ Translation complete! Your file is ready to download.
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button variant="secondary" onClick={reset} className="flex-1">
                    Translate Another
                  </Button>
                  <Button className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download Result
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
}

export default Translator;