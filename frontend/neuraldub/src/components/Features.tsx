import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Video, Zap } from 'lucide-react';
import { FeatureCard } from './FeatureCard';
export function Features() {
    const features = [
        {
            icon: <Zap className="w-6 h-6" />,
            title: 'Speech Translation',
            description:
                'Experience low-latency translation with natural prosody. Perfect for live interactions and streaming.'
        },
        {
            icon: <Mic className="w-6 h-6" />,
            title: 'Voice Cloning',
            description:
                'Clone your voice from a short reference sample. Maintain your unique tone, pitch, and emotional expression across languages.'
        },
        {
            icon: <Video className="w-6 h-6" />,
            title: 'Lip Syncing',
            description:
                'Generate realistic lip movements synchronized with the translated speech for a natural viewing experience.'
        }
    ];

    return (
        <section id="features" className="py-32 bg-[#040914] relative">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-20">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold uppercase tracking-widest"
                    >
                        Core Systems
                    </motion.div>
                    <motion.h2 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 }}
                      className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight"
                    >
                        Advanced Neural Architecture
                    </motion.h2>
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                      className="text-gray-400 text-lg max-w-2xl mx-auto"
                    >
                        Our platform combines state-of-the-art models for voice synthesis,
                        real-time translation, and hyper-realistic video generation.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
                    {features.map((feature, index) =>
                        <FeatureCard key={index} {...feature} delay={index * 0.1} />
                    )}
                </div>
            </div>
        </section>
    );
}

export default Features;