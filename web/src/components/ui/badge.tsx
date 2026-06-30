import type { FunctionComponent } from '@/common/types';
import { cn } from '@/lib/utils';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/90',
        secondary:
          'border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline:
          'border border-input bg-background text-foreground hover:bg-secondary',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps): FunctionComponent {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

interface FilterBadgeProps {
  label: string;
  onClear: VoidFunction;
}

function FilterBadge({ label, onClear }: FilterBadgeProps): FunctionComponent {
  return (
    <Badge variant='outline' className='px-2.5 py-1.5 text-sm gap-1.5 font-normal'>
      <span>{label}</span>
      <button title='Remove filter' onClick={onClear} className='hover:text-foreground transition-colors'>
        <XMarkIcon className='w-3.5 h-3.5' />
      </button>
    </Badge>
  );
}

export { Badge, badgeVariants, FilterBadge };
