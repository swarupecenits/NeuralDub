import React, { useState, useRef } from 'react';
import { Upload, Mic, FileVideo, FileAudio, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
interface FileUploadProps {
  onFileSelect: (file: File) => void;
}
export function FileUpload({ onFileSelect }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (
    file && (
    file.type.startsWith('audio/') || file.type.startsWith('video/')))
    {
      handleFile(file);
    }
  };
  const handleFile = (file: File) => {
    setSelectedFile(file);
    onFileSelect(file);
  };
  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!selectedFile ?
        <motion.div
          initial={{
            opacity: 0,
            y: 10
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          exit={{
            opacity: 0,
            y: -10
          }}
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${isDragging ? 'border-cyan-500 bg-cyan-500/5 scale-[1.02]' : 'border-white/10 hover:border-cyan-500/30 hover:bg-white/5'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}>

            <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="audio/*,video/*"
            onChange={(e) =>
            e.target.files?.[0] && handleFile(e.target.files[0])
            } />


            <div className="flex justify-center mb-6 space-x-4">
              <div className="p-4 rounded-full bg-[#0A1628] border border-white/10 text-cyan-400 shadow-lg">
                <Upload className="w-8 h-8" />
              </div>
            </div>

            <h3 className="text-xl font-semibold text-white mb-2">
              Drag & drop your media
            </h3>
            <p className="text-gray-400 mb-8">
              Supports MP3, WAV, MP4, MOV (Max 500MB)
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button onClick={() => fileInputRef.current?.click()}>
                Browse Files
              </Button>
              <span className="text-gray-500">or</span>
              <Button
              variant="secondary"
              onClick={() =>
              alert('Microphone access would be requested here')
              }>

                <Mic className="w-4 h-4 mr-2" />
                Record Live
              </Button>
            </div>
          </motion.div> :

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.95
          }}
          animate={{
            opacity: 1,
            scale: 1
          }}
          exit={{
            opacity: 0,
            scale: 0.95
          }}
          className="bg-[#0A1628] border border-white/10 rounded-xl p-6 flex items-center justify-between">

            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400">
                {selectedFile.type.startsWith('video/') ?
              <FileVideo className="w-8 h-8" /> :

              <FileAudio className="w-8 h-8" />
              }
              </div>
              <div className="text-left">
                <p className="text-white font-medium truncate max-w-[200px] sm:max-w-md">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-gray-400">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
            onClick={clearFile}
            className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">

              <X className="w-5 h-5" />
            </button>
          </motion.div>
        }
      </AnimatePresence>
    </div>
  );
}

export default FileUpload;