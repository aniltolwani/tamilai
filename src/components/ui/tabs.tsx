'use client';
import * as React from 'react';
import { clsx } from 'clsx';

type TabsCtx = { value: string; setValue: (v: string) => void };
const Ctx = React.createContext<TabsCtx | null>(null);

export function Tabs({ defaultValue, children }: { defaultValue: string; children: React.ReactNode }) {
  const [value, setValue] = React.useState(defaultValue);
  return <Ctx.Provider value={{ value, setValue }}><div>{children}</div></Ctx.Provider>;
}

export function TabsList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('inline-grid', className)} {...props} />;
}

export function TabsTrigger({ value, className, children, ...props }:
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }) {
  const ctx = React.useContext(Ctx)!;
  const active = ctx.value === value;
  return (
    <button
      onClick={() => ctx.setValue(value)}
      className={clsx('px-3 py-2 text-sm rounded-lg', active ? 'bg-white shadow' : 'opacity-70 hover:opacity-100', className)}
      {...props}
    >{children}</button>
  );
}

export function TabsContent({ value, className, children }: { value: string; className?: string; children: React.ReactNode }) {
  const ctx = React.useContext(Ctx)!;
  if (ctx.value !== value) return null;
  return <div className={className}>{children}</div>;
}
