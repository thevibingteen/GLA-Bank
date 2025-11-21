import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className, showText = true, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Hexagonal Icon with Circuit Board Pattern */}
      <div className={cn('relative', sizeClasses[size])}>
        <svg
          viewBox="0 0 100 100"
          className={cn('w-full h-full', sizeClasses[size])}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main Hexagonal Shape */}
          <path
            d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z"
            fill="#166534"
            className="dark:fill-[#166534]"
          />
          
          {/* Circuit Board Pattern - Horizontal Lines */}
          <line x1="20" y1="40" x2="80" y2="40" stroke="#22c55e" strokeWidth="1.5" opacity="0.6" />
          <line x1="20" y1="50" x2="80" y2="50" stroke="#22c55e" strokeWidth="1.5" opacity="0.6" />
          <line x1="20" y1="60" x2="80" y2="60" stroke="#22c55e" strokeWidth="1.5" opacity="0.6" />
          
          {/* Circuit Board Pattern - Vertical Lines */}
          <line x1="35" y1="30" x2="35" y2="70" stroke="#22c55e" strokeWidth="1.5" opacity="0.4" />
          <line x1="50" y1="30" x2="50" y2="70" stroke="#22c55e" strokeWidth="1.5" opacity="0.4" />
          <line x1="65" y1="30" x2="65" y2="70" stroke="#22c55e" strokeWidth="1.5" opacity="0.4" />
          
          {/* Circuit Pads */}
          <circle cx="35" cy="40" r="2" fill="#22c55e" opacity="0.8" />
          <circle cx="50" cy="50" r="2" fill="#22c55e" opacity="0.8" />
          <circle cx="65" cy="60" r="2" fill="#22c55e" opacity="0.8" />
          
          {/* Binary Code Overlay - Subtle */}
          <text x="25" y="55" fontSize="6" fill="#22c55e" opacity="0.3" fontFamily="monospace">01</text>
          <text x="55" y="65" fontSize="6" fill="#22c55e" opacity="0.3" fontFamily="monospace">10</text>
          <text x="70" y="45" fontSize="6" fill="#22c55e" opacity="0.3" fontFamily="monospace">11</text>
        </svg>
      </div>
      
      {/* Text Logo */}
      {showText && (
        <div className={cn('flex items-baseline gap-1', textSizeClasses[size])}>
          <span className="font-bold text-[#166534] dark:text-[#166534] relative">
            GLA
            {/* Subtle binary texture overlay */}
            <span className="absolute inset-0 opacity-10 text-[#22c55e] font-mono text-[0.6em] leading-none">
              01
            </span>
          </span>
          <span className="font-semibold text-[#22c55e] dark:text-[#22c55e]">
            Bank
          </span>
        </div>
      )}
    </div>
  );
}

