"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { UserPersona } from '@/redux/slices/userSlice';

interface PersonaSelectorProps {
  currentPersona: UserPersona;
  onPersonaChange: (persona: UserPersona) => void;
}

const PersonaSelector: React.FC<PersonaSelectorProps> = ({ currentPersona, onPersonaChange }) => {
  return (
    <div className="p-4 bg-[var(--c-blue-deep)]/5 border-b border-black/5">
      <div className="flex bg-white/50 p-1 rounded-xl relative border border-black/5">
        <motion.div
          className="absolute inset-y-1 rounded-[10px] bg-[var(--c-blue-deep)] shadow-lg z-0"
          initial={false}
          animate={{
            left: currentPersona === 'GUEST' ? '4px' : '50%',
            right: currentPersona === 'GUEST' ? '50%' : '4px',
          }}
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
        />
        <button
          onClick={() => onPersonaChange('GUEST')}
          className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider relative z-10 transition-colors duration-300 ${currentPersona === 'GUEST' ? 'text-white' : 'text-[var(--t-secondary)]'}`}
        >
          Guest
        </button>
        <button
          onClick={() => onPersonaChange('HOST')}
          className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider relative z-10 transition-colors duration-300 ${currentPersona === 'HOST' ? 'text-white' : 'text-[var(--t-secondary)]'}`}
        >
          Host
        </button>
      </div>
    </div>
  );
};

export default PersonaSelector;
