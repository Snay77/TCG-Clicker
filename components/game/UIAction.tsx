import type { ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'destructive';
};

/** Shared visual variants; native button semantics and callbacks are retained. */
export default function UIAction({ variant = 'secondary', className = '', type = 'button', ...props }: Props) {
  return <button {...props} type={type} className={`ui-action ui-action-${variant} ${className}`} />;
}
