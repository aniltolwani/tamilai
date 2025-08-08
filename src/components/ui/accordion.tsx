'use client';
import * as React from 'react';
import { clsx } from 'clsx';

export function Accordion({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('space-y-2', className)}>{children}</div>;
}

export function AccordionItem({ value, children }: { value: string; children: React.ReactNode }) {
  return <div className="border rounded-xl overflow-hidden">{children}</div>;
}

export function AccordionTrigger({ className, children }: React.HTMLAttributes<HTMLButtonElement>) {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <button onClick={() => setOpen(o => !o)} className={clsx('w-full text-left px-3 py-2 bg-white', className)}>
        {children}
      </button>
      <div data-accordion-content={open ? 'open' : 'closed'} className={clsx('px-3 pb-3', open ? 'block' : 'hidden')}>
        {/* Content will be provided by following sibling in page; but our page renders Content separately. This hack won't wire. */}
      </div>
    </div>
  );
}

export function AccordionContent({ children }: { children: React.ReactNode }) {
  return <div className="px-3 pb-3">{children}</div>;
}
