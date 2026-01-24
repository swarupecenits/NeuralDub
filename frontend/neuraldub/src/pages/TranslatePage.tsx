import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileUpload } from '../components/FileUpload';
import { LanguageSelector } from '../components/LanguageSelector';
import { WaveformVisualizer } from '../components/WaveformVisualizer';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { Button } from '../components/Button';
import { ArrowRight, Download, RefreshCw, Play } from 'lucide-react';
type Step = 'upload' | 'configure' | 'processing' | 'preview';
export function TranslatePage() {
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
            index === 0 && step === 'upload' ||
            index === 1 && (
            step === 'configure' || step === 'processing') ||
            index === 2 && step === 'preview';
            const isCompleted =
            index === 0 && step !== 'upload' ||
            index === 1 && step === 'preview';
            return (
              <div key={label} className="flex items-center">
                <div
                  className={`
                  flex items-center justify-center w-8 h-8 rounded-full border-2 
                  ${isActive ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10' : isCompleted ? 'border-cyan-500 bg-cyan-500 text-[#0A1628]' : 'border-gray-700 text-gray-500'}
                  transition-colors duration-300
                `}>

                  {isCompleted ? '✓' : index + 1}
                </div>
                <span
                  className={`ml-2 ${isActive || isCompleted ? 'text-white' : 'text-gray-500'}`}>

                  {label}
                </span>
                {index < 2 &&
                <div
                  className={`w-12 h-0.5 mx-4 ${isCompleted ? 'bg-cyan-500' : 'bg-gray-800'}`} />

                }
              </div>);

          })}
        </div>

        {/* Main Card */}
        <motion.div
          layout
          className="bg-[#0D1F36] border border-white/10 rounded-2xl p-8 shadow-2xl">

          <AnimatePresence mode="wait">
            {step === 'upload' &&
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

                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                  Start New Translation
                </h2>
                <FileUpload onFileSelect={handleFileSelect} />
              </motion.div>
            }

            {step === 'configure' &&
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

                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Configure Translation
                  </h2>
                  <p className="text-gray-400">
                    Select your languages and preferences
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <LanguageSelector
                  label="Source Language"
                  value={sourceLang}
                  onChange={setSourceLang} />

                  <LanguageSelector
                  label="Target Language"
                  value={targetLang}
                  onChange={setTargetLang} />

                </div>

                <div className="bg-[#0A1628] rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">
                      Selected File
                    </span>
                    <button
                    onClick={reset}
                    className="text-xs text-cyan-400 hover:text-cyan-300">

                      Change
                    </button>
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    <span className="truncate">{file?.name}</span>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                  onClick={startTranslation}
                  className="w-full md:w-auto">

                    Translate Now
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            }

            {step === 'processing' &&
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

                <h2 className="text-2xl font-bold text-white">
                  Translating Your Voice...
                </h2>
                <WaveformVisualizer isProcessing={true} />
                <ProgressIndicator
                progress={progress}
                status={
                progress < 30 ?
                'Analyzing audio...' :
                progress < 60 ?
                'Cloning voice...' :
                'Synthesizing speech...'
                } />

              </motion.div>
            }

            {step === 'preview' &&
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

                <div className="text-center">
                  <div className="inline-flex items-center justify-center p-3 rounded-full bg-green-500/10 text-green-400 mb-4">
                    <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">

                      <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7" />

                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Translation Complete!
                  </h2>
                  <p className="text-gray-400">
                    Your content is ready to download
                  </p>
                </div>

                <div className="bg-[#0A1628] rounded-xl overflow-hidden border border-white/10">
                  <div className="aspect-video bg-black/50 flex items-center justify-center relative group cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Button
                    variant="primary"
                    className="rounded-full w-16 h-16 pl-5">

                      <Play className="w-8 h-8 fill-current" />
                    </Button>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">
                        Translated_{file?.name}
                      </p>
                      <p className="text-sm text-gray-400">
                        02:14 • {targetLang.toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button className="w-full sm:w-auto">
                    <Download className="mr-2 w-4 h-4" />
                    Download Result
                  </Button>
                  <Button
                  variant="secondary"
                  onClick={reset}
                  className="w-full sm:w-auto">

                    <RefreshCw className="mr-2 w-4 h-4" />
                    Translate Another
                  </Button>
                </div>
              </motion.div>
            }
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
}

export default TranslatePage;