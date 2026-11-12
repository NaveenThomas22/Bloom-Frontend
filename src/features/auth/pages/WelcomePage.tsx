import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/ui/Button';
import { Compass, Sparkles, Clock, ArrowRight } from 'lucide-react';

export const WelcomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center text-center space-y-8 animate-in fade-in duration-500">
      <Logo size="lg" showSubtitle={true} />

      <div className="space-y-3 max-w-sm">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-mint/60 text-forest dark:bg-dark-surface dark:text-sage-300 border border-sage-200/60 dark:border-dark-border">
          The 24-Hour Aspirant Companion
        </span>
        <h1 className="font-serif text-3xl font-semibold text-sage-950 dark:text-sage-100 leading-tight">
          Nurture Your Potential. Master Your CAT Journey.
        </h1>
        <p className="text-sm text-sage-600 dark:text-dark-muted leading-relaxed">
          A calm, intentional sanctuary designed to harmonize your 24 hours balancing deep syllabus mastery, restful sleep, and steady confidence.
        </p>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 gap-3 w-full text-left">
        <div className="flex items-center gap-3.5 p-4 rounded-3xl bg-white/80 dark:bg-dark-card/80 border border-sage-200/60 dark:border-dark-border shadow-soft-sm">
          <div className="w-10 h-10 rounded-2xl bg-mint/50 dark:bg-dark-surface flex items-center justify-center text-forest dark:text-sage-300 shrink-0">
            <Clock className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-sage-900 dark:text-sage-100">24-Hour Life Harmony</h4>
            <p className="text-[11px] text-sage-600 dark:text-dark-muted">Track your daily rhythms study, sleep, breaks, and meals.</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-4 rounded-3xl bg-white/80 dark:bg-dark-card/80 border border-sage-200/60 dark:border-dark-border shadow-soft-sm">
          <div className="w-10 h-10 rounded-2xl bg-sage-200/60 dark:bg-dark-surface flex items-center justify-center text-forest dark:text-sage-300 shrink-0">
            <Compass className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-sage-900 dark:text-sage-100">Structured CAT Syllabus</h4>
            <p className="text-[11px] text-sage-600 dark:text-dark-muted">Step-by-step modular progression across QA, DILR, and VARC.</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-4 rounded-3xl bg-white/80 dark:bg-dark-card/80 border border-sage-200/60 dark:border-dark-border shadow-soft-sm">
          <div className="w-10 h-10 rounded-2xl bg-rose/40 dark:bg-dark-surface flex items-center justify-center text-forest dark:text-sage-300 shrink-0">
            <Sparkles className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-sage-900 dark:text-sage-100">Spaced Revision & Readiness</h4>
            <p className="text-[11px] text-sage-600 dark:text-dark-muted">Scientifically spaced intervals to lock concepts into long-term memory.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full pt-2">
        <Link to="/register" className="w-full">
          <Button variant="primary" size="lg" className="w-full shadow-soft-lg" icon={<ArrowRight className="w-4 h-4" />}>
            Begin Your Journey
          </Button>
        </Link>
        <Link to="/login" className="w-full">
          <Button variant="secondary" size="lg" className="w-full">
            Sign In to Existing Sanctuary
          </Button>
        </Link>
      </div>

      <p className="text-[11px] text-sage-500 dark:text-dark-muted">
        Crafted with the soothing elegance of the Sage Garden theme.
      </p>
    </div>
  );
};

