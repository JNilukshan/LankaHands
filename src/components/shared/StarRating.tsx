"use client";

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ComponentProps, FC } from 'react';

interface StarRatingProps extends ComponentProps<'div'> {
  rating: number;
  size?: number;
  color?: string;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
}

const StarRating: FC<StarRatingProps> = ({
  rating,
  size = 20,
  color = "text-primary",
  onRatingChange,
  interactive = false,
  className,
  ...props
}) => {
  const handleClick = (index: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  return (
    <div className={cn("flex items-center", interactive ? "cursor-pointer" : "", className)} {...props}>
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          size={size}
          className={cn(
            index < Math.round(rating) ? color : 'text-muted-foreground opacity-50',
            interactive && "hover:opacity-80 transition-opacity"
          )}
          onClick={() => handleClick(index)}
          fill={index < Math.round(rating) ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  );
};

export default StarRating;
