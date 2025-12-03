import { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({
  children,
  className = '',
  hover = false,
  ...rest
}: CardProps) {
  const hoverClass = hover ? 'hover:shadow-lg transition-shadow cursor-pointer' : '';

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 ${hoverClass} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
