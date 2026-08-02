import * as React from "react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  ref?: React.Ref<HTMLSelectElement>;
}

export function Select({ className, children, ref, ...props }: SelectProps) {
  return (
    <select
      className={`flex h-9 w-full items-center justify-between rounded-md border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm shadow-sm ring-offset-white dark:ring-offset-slate-950 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50 dark:disabled:bg-slate-900 text-gray-900 dark:text-slate-100 transition-colors ${className || ''}`}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  );
}