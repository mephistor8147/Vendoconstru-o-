import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSlogan?: boolean;
  className?: string;
  variant?: 'meli' | 'dark' | 'light';
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showSlogan = true,
  className = '',
  variant = 'meli'
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-lg md:text-xl',
    lg: 'text-2xl md:text-3xl',
    xl: 'text-3xl md:text-4xl'
  };

  const sloganSizes = {
    sm: 'text-[7.5px]',
    md: 'text-[9.5px]',
    lg: 'text-xs',
    xl: 'text-sm'
  };

  const isDark = variant === 'dark';

  return (
    <div className={`flex items-center gap-2.5 ${className}`} id="vando-logo-container">
      {/* SVG Icon matching Vando Construção emblem from Instagram flyer */}
      <div className={`relative flex-shrink-0 ${iconSizes[size]} bg-[#08182B] text-white rounded-lg p-1 shadow-xs border border-white/10 flex items-center justify-center`}>
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top white geometric V */}
          <path 
            d="M18 18 L50 64 L82 18" 
            stroke="#FFFFFF" 
            strokeWidth="11" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          {/* Lime Green roof peak / house chevron (#72BF44) */}
          <path 
            d="M14 74 L50 46 L86 74" 
            stroke="#72BF44" 
            strokeWidth="9" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          {/* 4 Window panes */}
          <rect x="42" y="66" width="6.5" height="6.5" fill="#FFFFFF" rx="1" />
          <rect x="51.5" y="66" width="6.5" height="6.5" fill="#FFFFFF" rx="1" />
          <rect x="42" y="75.5" width="6.5" height="6.5" fill="#FFFFFF" rx="1" />
          <rect x="51.5" y="75.5" width="6.5" height="6.5" fill="#FFFFFF" rx="1" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center leading-none select-none">
        <div className="flex items-center gap-1">
          <span className={`font-black tracking-tight uppercase ${titleSizes[size]} ${
            isDark ? 'text-white' : 'text-[#08182B]'
          }`}>
            VANDO
          </span>
          <span className={`font-black tracking-tight uppercase ${titleSizes[size]} text-[#72BF44]`}>
            CONSTRUÇÃO
          </span>
        </div>
        {showSlogan && (
          <span className={`font-bold tracking-wider uppercase mt-0.5 ${sloganSizes[size]} ${
            isDark ? 'text-neutral-300' : 'text-[#08182B]/85'
          }`}>
            TUDO PARA CONSTRUIR SEUS SONHOS.
          </span>
        )}
      </div>
    </div>
  );
};

