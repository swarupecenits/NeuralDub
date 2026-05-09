import React, { useState, useEffect } from 'react';
import { Upload, Video, Globe2, Wand2, Play, Download, Loader2, MessageSquare, Send, Cpu, Activity, Zap, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OneClickDub() {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [targetLang, setTargetLang] = useState('hi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultVideoUrl, setResultVideoUrl] = useState<string | null>(null);

  const [options, setOptions] = useState({
    translate: true,
    voiceClone: true,
    lipSync: true
  });
  const [feedback, setFeedback] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  // Advanced Processing State
  const [processingStep, setProcessingStep] = useState(0);
  const steps = [
    { name: "Isolating Audio Tracks...", icon: <Activity className="w-5 h-5" /> },
    { name: "Demucs Source Separation...", icon: <Activity className="w-5 h-5" /> },
    { name: "Whisper Transcription...", icon: <MessageSquare className="w-5 h-5" /> },
    { name: "IndicTrans10 Translation...", icon: <Globe2 className="w-5 h-5" /> },
    { name: "Zero-Shot Voice Cloning...", icon: <Cpu className="w-5 h-5" /> },
    { name: "MuseTalk Lip Sync Synthesis...", icon: <Video className="w-5 h-5" /> },
    { name: "Final Compositing & Rendering...", icon: <Wand2 className="w-5 h-5" /> }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isProcessing) {
      interval = setInterval(() => {
        setProcessingStep((prev) => {
          if (prev < steps.length - 1) return prev + 1;
          return prev;
        });
      }, 1500); // 1.5s per step
    } else {
      setProcessingStep(0);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      setFilePreview(URL.createObjectURL(droppedFile));
    }
  };

  const handleProcess = () => {
    if (!file) return;
    setIsProcessing(true);
    setResultVideoUrl(null);
    setFeedbackSent(false);
    setFeedback('');
    
    // We will use the local dummy mp4 file from src/assets
    import('../assets/output_nptel_smallest_hindi_final.mp4').then(module => {
      const dummyFileUrl = module.default;
      setTimeout(() => {
        setIsProcessing(false);
        setResultVideoUrl(dummyFileUrl);
      }, steps.length * 1500 + 1000);
    }).catch(err => {
      // fallback
      setTimeout(() => {
        setIsProcessing(false);
        setResultVideoUrl(URL.createObjectURL(file));
      }, steps.length * 1500 + 1000);
    });
  };

  return (
    <div className="relative pt-24 min-h-screen bg-[#060D18] overflow-hidden flex flex-col items-center">
      {/* Cool Background Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-900/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-30" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-6 font-medium text-sm tracking-widest uppercase">
            <Zap className="w-4 h-4" />
            Neural Engine Active
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-white via-cyan-100 to-blue-400 drop-shadow-[0_0_30px_rgba(34,211,238,0.2)]">
              Magic-Dub 
            </span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Initialize the pipeline. Upload source media, configure parameters, and our advanced neural architecture handles extraction, zero-shot cloning, and lip synthesis flawlessly.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-[#0A1628]/80 p-1 rounded-3xl border border-white/5 backdrop-blur-xl shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
          
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Media Handling */}
              <div className="col-span-1 lg:col-span-7 flex flex-col gap-6">
                <div 
                  className={`border-2 border-dashed ${file ? 'border-cyan-500/50 bg-cyan-500/5 min-h-[160px]' : 'border-gray-600 hover:border-cyan-400 hover:bg-gray-800/50 min-h-[320px]'} rounded-2xl p-6 transition-all duration-300 relative group flex flex-col justify-center`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                >
                  <input 
                    type="file" 
                    accept="video/*" 
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={isProcessing}
                  />
                  {filePreview && !resultVideoUrl ? (
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="flex flex-col items-center w-full relative z-20 pointer-events-none"
                    >
                      <CheckCircle2 className="w-12 h-12 text-cyan-400 mb-4" />
                      <p className="text-xl font-semibold text-white mb-2 tracking-wide">Source Stream Connected</p>
                      <p className="text-sm font-mono text-cyan-300 break-all">{file.name}</p>
                      <p className="text-gray-400 text-sm mt-4 tracking-wider uppercase">Drag or click to override</p>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center pointer-events-none">
                      <div className="relative">
                        <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
                        <div className="w-20 h-20 bg-[#0f213a] border border-cyan-500/30 rounded-2xl flex items-center justify-center mb-6 relative z-10 transform group-hover:scale-105 group-hover:-rotate-3 transition-transform duration-300">
                          <Upload className="w-10 h-10 text-cyan-400" />
                        </div>
                      </div>
                      <p className="text-xl font-semibold text-white mb-2 tracking-wide">Initialize Data Stream</p>
                      <p className="text-gray-400 text-sm">Drag drop media or click to browse</p>
                    </div>
                  )}
                </div>

                <AnimatePresence>
                  {filePreview && !resultVideoUrl && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-[#0f213a] rounded-2xl p-6 border border-white/5 shadow-inner relative overflow-hidden"
                    >
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Video className="w-4 h-4 text-cyan-500" /> Source Media Verification
                      </label>
                      <div className="w-full relative aspect-video bg-[#050a14] rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-gray-700">
                        <video src={filePreview} className="w-full h-full object-contain relative z-10" controls />
                        {isProcessing && (
                          <div className="absolute inset-0 bg-cyan-900/30 backdrop-blur-[2px] z-30 pointer-events-none"></div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right Column: Controls */}
              <div className="col-span-1 lg:col-span-5 flex flex-col gap-6">
                <div className="bg-[#0f213a] rounded-2xl p-6 border border-white/5 shadow-inner">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-cyan-500" /> Neural Modules
                  </label>
                  <div className="flex flex-col gap-3">
                    {[
                      { id: 'translate', label: 'IndicTrans Translation' },
                      { id: 'voiceClone', label: 'Zero-shot Extractor' },
                      { id: 'lipSync', label: 'Muse Lip-Sync Core' }
                    ].map((opt) => (
                      <label key={opt.id} className="relative flex items-center justify-between cursor-pointer p-3 rounded-xl bg-[#0a1628] border border-white/5 hover:border-cyan-500/30 transition-colors">
                        <span className="text-sm font-medium text-gray-200">{opt.label}</span>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                          <input 
                            type="checkbox" 
                            name="toggle" 
                            className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 border-[#0a1628] appearance-none cursor-pointer checked:right-0 right-5 checked:border-cyan-500 transition-all duration-300 z-10"
                            checked={options[opt.id as keyof typeof options]}
                            onChange={(e) => !isProcessing && setOptions({...options, [opt.id]: e.target.checked})}
                            disabled={isProcessing}
                          />
                          <label className={`toggle-label block overflow-hidden h-5 rounded-full ${options[opt.id as keyof typeof options] ? 'bg-cyan-500' : 'bg-gray-600'} cursor-pointer transition-colors duration-300`}></label>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-[#0f213a] rounded-2xl p-6 border border-white/5 shadow-inner flex-1 flex flex-col justify-end">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Globe2 className="w-4 h-4 text-cyan-500" /> Target Lexicon
                  </label>
                  <select 
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="w-full bg-[#0a1628] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors mb-6 appearance-none font-medium"
                    disabled={isProcessing}
                    style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')", backgroundRepeat: "no-repeat", backgroundPosition: "right .7rem top 50%", backgroundSize: ".65rem auto" }}
                  >
                    <option value="en">English (ENG)</option>
                    <option value="hi">Hindi (HIN)</option>
                    <option value="bn">Bengali (BEN)</option>
                    <option value="te">Telugu (TEL)</option>
                    <option value="ta">Tamil (TAM)</option>
                    <option value="or">Odia (ODI)</option>
                    <option value="mr">Marathi (MAR)</option>
                  </select>

                  <button 
                    onClick={handleProcess}
                    disabled={!file || isProcessing}
                    className={`w-full py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-500 overflow-hidden relative group ${
                      !file 
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                        : isProcessing 
                          ? 'bg-cyan-900 border border-cyan-500/50 text-cyan-200 cursor-wait'
                          : 'bg-gradient-to-r from-cyan-600 to-blue-600 border border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] hover:scale-[1.02]'
                    }`}
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-3 relative z-10 font-mono tracking-widest text-sm">
                        <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
                        PROCESSING SEQUENCE
                      </span>
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjIiLz4KPC9zdmc+')] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <Wand2 className="w-5 h-5 relative z-10" />
                        <span className="relative z-10 tracking-widest uppercase">Execute</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Advanced Loading HUD */}
            <AnimatePresence>
              {isProcessing && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 32 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-[#0a1628] rounded-2xl p-6 border border-cyan-500/30 relative">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="relative w-32 h-32 flex-shrink-0">
                        <div className="absolute inset-0 rounded-full border-4 border-gray-800 border-t-cyan-500 border-l-blue-500 animate-spin"></div>
                        <div className="absolute inset-2 rounded-full border-4 border-gray-800 border-b-cyan-400 border-r-blue-400 animate-spin" style={{ animationDuration: '3s' }}></div>
                        <div className="absolute inset-0 flex items-center justify-center font-mono text-cyan-400">
                          <div className="text-xl font-bold tracking-tighter">
                            {Math.round((processingStep / (steps.length - 1)) * 100)}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1 w-full space-y-3">
                        {steps.map((step, idx) => (
                           <div key={idx} className={`flex items-center gap-3 transition-opacity duration-300 font-mono text-sm ${idx > processingStep ? 'opacity-30' : idx === processingStep ? 'opacity-100 text-cyan-400 scale-[1.02] translate-x-2' : 'opacity-70 text-gray-400'}`}>
                             {idx < processingStep ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : idx === processingStep ? <Loader2 className="w-4 h-4 animate-spin text-cyan-500" /> : <div className="w-4 h-4 border border-gray-600 rounded-full" />}
                             {step.icon}
                             <span className="tracking-widest uppercase text-xs">{step.name}</span>
                             {idx === processingStep && <div className="flex-1 h-[1px] bg-gradient-to-r from-cyan-500/50 to-transparent ml-4"></div>}
                           </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </motion.div>

        {/* Result Section */}
        <AnimatePresence>
          {resultVideoUrl && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 group"
            >
              <div className="bg-[#0A1628]/90 p-1 rounded-3xl border border-cyan-500/30 backdrop-blur-xl shadow-[0_0_50px_rgba(34,211,238,0.15)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full"></div>
                <div className="p-8 relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold font-mono text-white flex items-center gap-3 tracking-widest uppercase">
                      <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e] animate-pulse"></div>
                      Compositing Complete
                    </h2>
                    <span className="px-3 py-1 font-mono text-xs text-cyan-400 bg-cyan-900/40 rounded border border-cyan-500/20">
                      OUTPUT_RENDER_{targetLang.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="aspect-video w-full bg-[#050a14] rounded-2xl overflow-hidden shadow-2xl relative border border-gray-700 p-2">
                    <div className="w-full h-full rounded-xl overflow-hidden relative">
                       <video src={resultVideoUrl} controls className="w-full h-full object-contain bg-black" />
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-end">
                    <a href={resultVideoUrl} download="dubbed_video_render.mp4" className="flex items-center gap-2 bg-gradient-to-r from-gray-800 to-[#0f213a] hover:from-gray-700 hover:to-[#1a3860] border border-gray-600 text-white px-8 py-3 rounded-xl transition-all duration-300 shadow-lg font-mono text-sm tracking-wider uppercase">
                      <Download className="w-5 h-5 text-cyan-400" />
                      Save Artifact
                    </a>
                  </div>
                  
                  {/* Feedback Section */}
                  <div className="mt-10 border-t border-gray-800 pt-8 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
                    <h3 className="text-sm font-bold font-mono text-gray-400 mb-4 flex items-center gap-2 tracking-widest uppercase">
                      <MessageSquare className="w-4 h-4 text-cyan-500" />
                      Telemetry Feedback
                    </h3>
                    
                    {feedbackSent ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-green-500/10 border border-green-500/30 text-green-400 px-6 py-4 rounded-xl text-sm font-mono flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5" /> Transmission logged. Matrix updated.
                      </motion.div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        <div className="relative group">
                          <div className="absolute inset-0 bg-cyan-500/10 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                          <textarea 
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Report render anomalies to enhance neuro-network..."
                            className="w-full bg-[#050a14] border border-gray-700 focus:border-cyan-500/50 rounded-xl px-5 py-4 text-gray-300 focus:outline-none transition-colors h-28 resize-none font-mono text-sm relative z-10"
                          ></textarea>
                        </div>
                        <button 
                          onClick={() => setFeedbackSent(true)}
                          disabled={!feedback.trim()}
                          className="self-end flex items-center gap-2 bg-[#0f213a] border border-cyan-900 hover:border-cyan-500 text-cyan-400 disabled:border-gray-800 disabled:text-gray-600 px-6 py-2.5 rounded-xl transition-all font-mono text-sm tracking-wider uppercase group"
                        >
                          <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          Transmit
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}