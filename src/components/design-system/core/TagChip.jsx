import React from 'react';

/* Technology label. The source rendered these as <button class="language">
   pills; they are non-interactive labels, so this renders a <span> by default. */
export function TagChip({ children, tone = 'neutral', interactive = false, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const tones = {
    neutral: { background: 'var(--surface-chip)', color: 'var(--text-body)', borderColor: 'var(--border-hairline)' },
    accent: { background: 'var(--accent-soft)', color: 'var(--violet-300)', borderColor: 'var(--accent-soft-strong)' },
  };
  return (
    <span
      {...rest}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-micro)',
        letterSpacing: 'var(--tracking-nav)',
        display: 'inline-flex',
        alignItems: 'center',
        padding: '6px 12px',
        borderRadius: 'var(--radius-pill)',
        border: '1px solid',
        boxShadow: 'var(--shadow-sm)',
        transition: 'background-color var(--dur-normal) var(--ease-standard), box-shadow var(--dur-normal) var(--ease-standard), transform var(--dur-fast) var(--ease-standard)',
        cursor: interactive ? 'pointer' : 'default',
        ...tones[tone],
        ...(hover && interactive ? { background: 'var(--surface-chip-hover)', boxShadow: 'var(--shadow-md)', transform: 'translateY(-1px)' } : null),
        ...style,
      }}
    >
      {children}
    </span>
  );
}
