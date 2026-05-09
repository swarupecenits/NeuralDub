import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  delay?: number;
}
export function FeatureCard({
  icon,
  title,
  description,
  delay = 0
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20
      }}
      whileInView={{
        opacity: 1,
        y: 0
      }}
      viewport={{
        once: true
      }}
      transition={{
        duration: 0.5,
        delay
      }}
      className="relative p-8 rounded-3xl bg-[#081221] border border-white/5 hover:border-cyan-500/50 transition-all duration-300 group overflow-hidden shadow-xl hover:shadow-[0_0_40px_rgba(34,211,238,0.15)]">

      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute -right-20 -top-20 w-40 h-40 bg-cyan-500/10 blur-[50px] group-hover:bg-cyan-500/20 transition-all duration-500" />

      <div className="relative mb-6 p-4 inline-block rounded-2xl bg-[#0c1a2f] border border-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500/20 group-hover:text-cyan-300 group-hover:scale-110 shadow-[0_0_15px_rgba(34,211,238,0.1)] transition-all duration-300 z-10">
        {icon}
      </div>
      <h3 className="relative text-2xl font-bold text-white mb-3 tracking-tight z-10">{title}</h3>
      <p className="relative text-gray-400 leading-relaxed text-md z-10">{description}</p>
    </motion.div>
  );
}

export default FeatureCard;