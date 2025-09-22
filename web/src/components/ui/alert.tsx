import * as React from 'react';

import { cn } from '../../lib/utils';

const alertVariants = {
  default: 'bg-muted text-muted-foreground',
  destructive: 'border-destructive/40 text-destructive',
  success: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400',
};

type AlertVariant = keyof typeof alertVariants;

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <div
      ref={ref}
      role="status"
      className={cn(
        'relative w-full rounded-lg border border-border px-4 py-3 text-sm',
        alertVariants[variant],
        className,
      )}
      {...props}
    />
  ),
);
Alert.displayName = 'Alert';
