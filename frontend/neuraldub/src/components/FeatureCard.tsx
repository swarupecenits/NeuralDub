import React from 'react';
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
      className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-colors group">

      <div className="mb-4 p-3 inline-block rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 group-hover:scale-110 transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}

export default FeatureCard;