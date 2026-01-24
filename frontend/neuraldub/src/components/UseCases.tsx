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
      className="py-24 bg-[#0A1628] relative overflow-hidden">

      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Built for Everyone
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            From individual creators to large enterprises, Neural Dub powers
            global communication.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cases.map((useCase, index) =>
          <UseCaseCard key={index} {...useCase} delay={index * 0.1} />
          )}
        </div>
      </div>
    </section>
  );
}

export default UseCases;