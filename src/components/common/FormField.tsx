import { type ReactNode } from 'react';

interface FormFieldProps {
  /** Label text */
  label: string;
  /** Whether the field is required (shows asterisk) */
  required?: boolean;
  /** Validation error message */
  error?: string;
  /** Optional hint text below the input */
  hint?: string;
  /** The form control (input, textarea, select, etc.) */
  children: ReactNode;
  /** Additional class for the wrapper */
  className?: string;
}

/**
 * Form field wrapper with consistent label, error, and hint styling.
 * Wraps any form control and adds validation feedback.
 */
export function FormField({ label, required, error, hint, children, className = "" }: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-[#2d3e2d] text-sm font-medium">
        {label}
        {required && <span className="text-[#f5a145] ml-0.5">*</span>}
      </label>

      {children}

      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1 animate-in slide-in-from-top-1 duration-200">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
            <circle cx="6" cy="6" r="5.5" stroke="currentColor" />
            <path d="M6 3.5v3M6 8h.005" stroke="currentColor" strokeLinecap="round" />
          </svg>
          {error}
        </p>
      )}

      {hint && !error && (
        <p className="text-xs text-[#9ca89d]">{hint}</p>
      )}
    </div>
  );
}

/**
 * Input styling helper for consistent form control appearance.
 * Returns class string for inputs/textareas when in error state.
 */
export function inputClassName(hasError: boolean, base?: string): string {
  const baseClass = base || 'w-full px-4 py-3 rounded-[1rem] border-2 bg-white focus:outline-none transition-colors';
  
  if (hasError) {
    return `${baseClass} border-red-300 focus:border-red-400 bg-red-50/30`;
  }
  return `${baseClass} border-[#d4c5a0] focus:border-[#6b8e6f]`;
}
