import * as React from 'react';
import { clsx } from 'clsx';

type Props = React.HTMLAttributes<HTMLSpanElement> & { variant?: 'default' | 'secondary' };

export function Badge({ className, variant='default', ...props }: Props) {
  const styles = variant === 'secondary'
    ? 'bg-gray-100 text-gray-900 border'
    : 'bg-amber-100 text-amber-900 border border-amber-200';
  return <span className={clsx('inline-flex items-center px-2 py-1 rounded-lg text-xs', styles, className)} {...props} />;
}
export default Badge;
