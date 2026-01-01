'use client';

import { cn } from '@/lib/utils';

interface NeonBorderProps {
  children: React.ReactNode;
  className?: string;
  borderRadius?: string;
  borderWidth?: number;
  animationDuration?: number;
}

export function NeonBorder({ 
  children, 
  className, 
  borderRadius = 'rounded-xl',
  borderWidth = 2,
  animationDuration = 3
}: NeonBorderProps) {
  return (
    <div className={cn('relative group', className)}>
      {/* Animated border container */}
      <div 
        className={cn('absolute inset-0 overflow-hidden', borderRadius)}
        style={{ padding: `${borderWidth}px` }}
      >
        {/* Rotating gradient border */}
        <div 
          className={cn('absolute inset-[-50%] animate-spin-slow')}
          style={{ 
            background: 'conic-gradient(from 0deg, #22d3ee, #8b5cf6, #ec4899, #f59e0b, #22c55e, #22d3ee)',
            animationDuration: `${animationDuration}s`
          }}
        />
      </div>
      {/* Glow effect */}
      <div 
        className={cn('absolute inset-0 overflow-hidden opacity-50 blur-md', borderRadius)}
        style={{ padding: `${borderWidth}px` }}
      >
        <div 
          className={cn('absolute inset-[-50%] animate-spin-slow')}
          style={{ 
            background: 'conic-gradient(from 0deg, #22d3ee, #8b5cf6, #ec4899, #f59e0b, #22c55e, #22d3ee)',
            animationDuration: `${animationDuration}s`
          }}
        />
      </div>
      {/* Content container */}
      <div 
        className={cn('relative bg-card', borderRadius)}
        style={{ margin: `${borderWidth}px` }}
      >
        {children}
      </div>
    </div>
  );
}

// Versión simplificada para botones que mantiene su color original
interface AnimatedBorderButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function AnimatedBorderButton({ children, className, onClick }: AnimatedBorderButtonProps) {
  return (
    <div className="relative group inline-flex">
      {/* Animated border - más sutil */}
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        <div 
          className="absolute inset-[-200%] animate-spin-slow opacity-70"
          style={{ 
            background: 'conic-gradient(from 0deg, #22d3ee, #6366f1, #8b5cf6, #6366f1, #22d3ee)',
            animationDuration: '4s'
          }}
        />
      </div>
      {/* Glow - reducido */}
      <div className="absolute inset-0 rounded-xl overflow-hidden opacity-25 blur-md">
        <div 
          className="absolute inset-[-200%] animate-spin-slow"
          style={{ 
            background: 'conic-gradient(from 0deg, #22d3ee, #6366f1, #8b5cf6, #6366f1, #22d3ee)',
            animationDuration: '4s'
          }}
        />
      </div>
      {/* Button content - mejor centrado con padding interno */}
      <button
        onClick={onClick}
        className={cn(
          'relative m-[3px] rounded-lg bg-background/95 text-foreground font-semibold px-8 py-4 flex items-center justify-center transition-all hover:bg-background border border-primary/20',
          className
        )}
      >
        {children}
      </button>
    </div>
  );
}
