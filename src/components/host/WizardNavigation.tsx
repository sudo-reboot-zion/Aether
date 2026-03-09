"use client";
import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  isDeploying: boolean;
  draftStatus: 'idle' | 'saving' | 'saved';
  onBack: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
}

const WizardNavigation: React.FC<WizardNavigationProps> = ({
  currentStep,
  totalSteps,
  isDeploying,
  draftStatus,
  onBack,
  onNext,
  onSaveDraft,
}) => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between pt-12 border-t border-white/20">
      <div className="flex gap-6">
        {currentStep > 0 ? (
          <button
            onClick={onBack}
            className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--t-secondary)] hover:text-[var(--t-primary)] transition-colors opacity-70 flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Previous
          </button>
        ) : (
          <button
            onClick={() => router.push('/dashboard')}
            className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--t-secondary)] hover:text-[var(--t-primary)] transition-colors opacity-70 flex items-center gap-2"
          >
            <X className="w-3.5 h-3.5" /> Cancel
          </button>
        )}
        <button
          onClick={onSaveDraft}
          className={`font-sans text-[11px] font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${
            draftStatus === 'saved' ? 'text-emerald-500' : 'text-[var(--t-secondary)] hover:text-[var(--t-primary)] opacity-70'
          }`}
        >
          {draftStatus === 'saving' ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : draftStatus === 'saved' ? (
            <CheckCircle className="w-3.5 h-3.5" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          {draftStatus === 'saving' ? 'Saving...' : draftStatus === 'saved' ? 'Draft Saved' : 'Save Draft'}
        </button>
      </div>
      <button
        onClick={onNext}
        disabled={isDeploying}
        className="px-12 py-5 bg-[var(--c-blue-deep)] text-white rounded-full font-sans text-xs font-bold uppercase tracking-[0.25em] shadow-xl hover:bg-[var(--c-blue-azure)] hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:translate-y-0 flex items-center gap-3"
      >
        {isDeploying ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : currentStep === totalSteps - 1 ? (
          <CheckCircle className="w-4 h-4" />
        ) : (
          <ArrowRight className="w-4 h-4" />
        )}
        <span>{isDeploying ? 'Publishing...' : currentStep === totalSteps - 1 ? 'Publish Listing' : 'Continue'}</span>
      </button>
    </div>
  );
};

export default WizardNavigation;
