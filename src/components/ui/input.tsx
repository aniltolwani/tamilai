import * as React from 'react';
import { clsx } from 'clsx';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={clsx('h-10 px-3 rounded-xl border bg-white ring-0 outline-none focus:ring-2 focus:ring-amber-500/60', className)}
      {...props}
    />
  )
);
Input.displayName = 'Input';
export default Input;
