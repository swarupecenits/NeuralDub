import React from 'react';
import { Users, GraduationCap, Film, MessageSquare } from 'lucide-react';
import { UseCaseCard } from './UseCaseCard';
export function UseCases() {
  const cases = [
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Content Creators',
    description:
    'Expand your reach by dubbing your YouTube videos into multiple languages while keeping your own voice.'
  },
  {
    icon: <GraduationCap className="w-6 h-6" />,
    title: 'Education',
    description:
    "Make lectures and educational content accessible to students worldwide without losing the instructor's presence."
  },
  {
    icon: <Film className="w-6 h-6" />,
    title: 'Film & Media',
    description:
    'Professional-grade dubbing and localization for independent filmmakers and media production houses.'
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: 'Global Meetings',
    description:
    'Break down language barriers in cross-border business meetings with real-time speech translation.'
  }];

  return (
    <section
      id="use-cases"
      className="py-32 bg-[#040914] relative overflow-hidden">

      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      <div className="absolute top-1/4 right-0 w-1/2 h-1/2 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-1/2 h-1/2 bg-cyan-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold uppercase tracking-widest">
            Applications
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Built for Everyone
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            From individual creators to large enterprises, Neural Dub powers
            global communication.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cases.map((useCase, index) =>
          <UseCaseCard key={index} {...useCase} delay={index * 0.1} />
          )}
        </div>
      </div>
    </section>
  );
}

export default UseCases;