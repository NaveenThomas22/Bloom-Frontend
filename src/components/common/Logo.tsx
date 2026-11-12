import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showSubtitle = true }) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const subtitleSizes = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
  };

  return (
    <div className="inline-flex items-center gap-3">
      <div className={`relative ${iconSizes[size]} rounded-full flex items-center justify-center shadow-soft overflow-hidden shrink-0 ring-2 ring-forest/20 dark:ring-sage-300/30 bg-mint/30 dark:bg-dark-surface`}>
        <img
          src="/icons/bloom-avatar.png"
          alt="Bloom"
          className="w-full h-full object-cover rounded-full"
          loading="eager"
        />
      </div>

      <div className="flex flex-col text-left">
        <span className={`font-serif font-bold tracking-tight text-forest dark:text-sage-100 ${textSizes[size]}`}>
          Bloom
        </span>
        {showSubtitle && (
          <span className={`font-sans tracking-wide text-sage-600 dark:text-dark-muted font-medium uppercase ${subtitleSizes[size]}`}>
            My CAT Journey
          </span>
        )}
      </div>
    </div>
  );
};

