
import React from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className, 
  size = 'md', 
  withText = true 
}) => {
  const sizesMap = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
  };

  return (
    <Link to="/" className={cn('flex items-center justify-center', className)}>
      <img 
        src="/lovable-uploads/cc359820-b469-4d14-93b0-6c01352a6ba7.png" 
        alt="CCIO KONEK Logo" 
        className={cn(
          'object-contain',
          sizesMap[size]
        )}
      />
    </Link>
  );
};

export default Logo;
