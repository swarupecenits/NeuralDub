import React from 'react';
import { motion } from 'framer-motion';
interface UseCaseCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  delay?: number;
}
export function UseCaseCard({
  icon,
  title,
  description,
  delay = 0
}: UseCaseCardProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.95
      }}
      whileInView={{
        opacity: 1,
        scale: 1
      }}
      viewport={{
        once: true
      }}
      transition={{
        duration: 0.5,
        delay
      }}
      className="relative overflow-hidden p-8 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-cyan-500/30 transition-all group">

      <div className="absolute top-0 right-0 p-32 bg-cyan-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-cyan-500/10 transition-colors" />

      <div className="relative z-10">
        <div className="mb-6 p-3 w-12 h-12 flex items-center justify-center rounded-lg bg-[#0A1628] border border-white/10 text-cyan-400 shadow-lg">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

export default UseCaseCard;