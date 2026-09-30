import { cn } from '@/lib/utils'

export function RelioMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn('size-8', className)}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="relio-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--primary)" />
          <stop offset="100%" stopColor="var(--transition)" />
        </linearGradient>
      </defs>
      {/* Stem: tall pebble */}
      <rect x="7" y="6" width="9" height="28" rx="4.5" fill="url(#relio-mark)" />
      {/* Bowl: rounded drop */}
      <path
        d="M18.5 6.5c6.8 0 11.5 3.4 11.5 8.2 0 4.9-4.7 8.3-11.5 8.3-.9 0-1.5-.6-1.5-1.5V8c0-.9.6-1.5 1.5-1.5Z"
        fill="url(#relio-mark)"
        opacity="0.85"
      />
      {/* Leg: falling drop */}
      <path
        d="M20.2 24.4c1.3-1 3.2-.8 4.2.5l6.3 7.4c1 1.3.8 3.1-.5 4.1-1.3 1-3.2.8-4.2-.5l-6.3-7.4c-1-1.3-.8-3.1.5-4.1Z"
        fill="url(#relio-mark)"
        opacity="0.7"
      />
    </svg>
  )
}

export function RelioLogo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <RelioMark />
      <span className="font-heading text-xl font-bold tracking-tight">Relio</span>
    </span>
  )
}
