import type { ReactNode } from 'react';

interface VisuallyHiddenProps {
  children: ReactNode;
  /** If true, renders as a span instead of div */
  as?: 'span' | 'div';
}

/**
 * Visually hides content while keeping it accessible to screen readers.
 * Use for labels, descriptions, or context that sighted users don't need
 * but screen reader users do.
 */
export function VisuallyHidden({ children, as: Tag = 'span' }: VisuallyHiddenProps) {
  return (
    <Tag className="sr-only">
      {children}
    </Tag>
  );
}
