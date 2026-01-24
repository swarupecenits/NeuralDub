import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
interface WaveformVisualizerProps {
  isProcessing: boolean;
}
export function WaveformVisualizer({ isProcessing }: WaveformVisualizerProps) {
  const [bars, setBars] = useState<number[]>(Array(40).fill(20));
  useEffect(() => {
    if (!isProcessing) {
      setBars(Array(40).fill(20));
      return;
    }
    const interval = setInterval(() => {
      setBars((prev) => prev.map(() => Math.random() * 80 + 20));
    }, 100);
    return () => clearInterval(interval);
  }, [isProcessing]);
  return (
    <div className="h-32 flex items-center justify-center gap-1 w-full overflow-hidden bg-[#081221] rounded-xl border border-white/10 p-4">
      {bars.map((height, i) =>
      <motion.div
        key={i}
        animate={{
          height: `${height}%`
        }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut'
        }}
        className="w-1.5 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-full opacity-80" />

      )}
    </div>
  );
}

export default WaveformVisualizer;