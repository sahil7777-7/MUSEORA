import React from 'react';
import PageTransition from '../components/layout/PageTransition';
import MuseumMap3D from '../components/3d/MuseumMap3D';

export default function MuseumMapPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B0A08] text-[#F5F1E8] pt-32 pb-32">
        <div className="max-w-[1680px] mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="border-b border-[#E8E0D0]/10 pb-12 mb-12 museo-entrance-fade-up">
            <span className="font-mono text-xs text-[#C6A56B] tracking-[0.25em] uppercase block mb-3">
              MUSEORA SPATIAL NAVIGATION
            </span>
            <h1 className="font-serif text-5xl md:text-8xl text-[#F5F1E8] tracking-tight uppercase leading-none">
              MUSEUM MAP
            </h1>
            <p className="font-sans text-sm md:text-base text-[#A8A093] max-w-2xl font-light mt-4">
              Explore live visitor counts, active exhibition wings, and teleport directly to any gallery room in 3D.
            </p>
          </div>

          <MuseumMap3D />
        </div>
      </div>
    </PageTransition>
  );
}
