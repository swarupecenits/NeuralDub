import React, { ReactNode } from 'react';
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
      className="relative overflow-hidden p-8 rounded-3xl bg-gradient-to-b from-[#0a1628] to-[#040914] border border-white/5 hover:border-indigo-500/40 transition-all duration-300 group hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(99,102,241,0.2)]">

      <div className="absolute top-0 right-0 p-32 bg-indigo-500/5 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/20 transition-all duration-500" />

      <div className="relative z-10">
        <div className="mb-6 w-14 h-14 flex items-center justify-center rounded-2xl bg-[#0c1a2f] border border-white/10 text-indigo-400 group-hover:text-indigo-300 group-hover:scale-110 shadow-lg transition-all duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{title}</h3>
        <p className="text-md text-gray-400 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

export default UseCaseCard;