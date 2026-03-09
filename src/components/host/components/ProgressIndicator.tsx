'use client';

import React from 'react';

interface ProgressIndicatorProps {
  steps: readonly string[];
  currentStep: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  steps,
  currentStep,
}) => {
  return (
    <div className="flex justify-between mb-8">
      {steps.map((step, idx) => (
        <div key={idx} className="flex flex-col items-center gap-3 group px-2">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-sans text-xs font-bold transition-all ${
              currentStep >= idx
                ? 'bg-[var(--c-blue-deep)] text-white shadow-lg'
                : 'bg-white/40 text-[var(--t-secondary)] opacity-40 group-hover:opacity-100 group-hover:bg-white/60'
            }`}
          >
            {idx + 1}
          </div>
          <span
            className={`font-sans text-[9px] uppercase tracking-widest font-bold transition-opacity ${
              currentStep === idx
                ? 'opacity-100'
                : 'opacity-0 group-hover:opacity-40'
            }`}
          >
            {step}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ProgressIndicator;
