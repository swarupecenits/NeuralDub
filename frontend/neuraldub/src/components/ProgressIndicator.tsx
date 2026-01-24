import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
interface ProgressIndicatorProps {
  progress: number;
  status: string;
}
export function ProgressIndicator({
  progress,
  status
}: ProgressIndicatorProps) {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center text-cyan-400">
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          <span className="font-medium">{status}</span>
        </div>
        <span className="text-gray-400 font-mono">{Math.round(progress)}%</span>
      </div>

      <div className="h-2 bg-[#0A1628] rounded-full overflow-hidden border border-white/10">
        <motion.div
          initial={{
            width: 0
          }}
          animate={{
            width: `${progress}%`
          }}
          transition={{
            duration: 0.5
          }}
          className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400" />

      </div>
    </div>
  );
}

export default ProgressIndicator;