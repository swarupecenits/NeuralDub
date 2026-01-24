import React from 'react';
import { Mic, Video, Zap } from 'lucide-react';
import { FeatureCard } from './FeatureCard';
export function Features() {
  const features = [
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
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Real-Time Translation',
    description:
    'Experience low-latency translation with natural prosody. Perfect for live interactions and streaming.'
  }];

  return (
    <section id="features" className="py-24 bg-[#0A1628] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Advanced AI Technology
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our platform combines state-of-the-art models for voice synthesis,
            translation, and video generation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) =>
          <FeatureCard key={index} {...feature} delay={index * 0.1} />
          )}
        </div>
      </div>
    </section>
  );
}

export default Features;