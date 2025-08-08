import * as React from 'react';
import { clsx } from 'clsx';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'secondary' | 'ghost';
  size?: 'sm' | 'md';
};

export function Button({ className, variant='default', size='md', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-xl font-medium transition shadow-sm disabled:opacity-50 disabled:pointer-events-none';
  const variants = {
    default: 'bg-amber-600 text-white hover:bg-amber-700',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-white border',
    ghost: 'bg-transparent hover:bg-gray-100',
  } as const;
  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 text-base',
  } as const;
  return <button className={clsx(base, variants[variant], sizes[size], className)} {...props} />;
}
export default Button;
