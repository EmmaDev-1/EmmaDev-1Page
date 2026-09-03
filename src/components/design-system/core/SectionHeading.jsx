import React from 'react';

/* Section title with an optional mono eyebrow and the brand hairline rule.
   Replaces the source's bare .titleProject h2. */
export function SectionHeading({ eyebrow, children, align = 'left', rule = true, style, ...rest }) {
  return (
    <header
      {...rest}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        alignItems: align === 'center' ? 'center' : 'flex-start',
        textAlign: align,
        ...style,
      }}
    >
      {eyebrow ? (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-micro)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', color: 'var(--accent)' }}>
          {eyebrow}
        </span>
      ) : null}
      <h2 style={{ margin: 0, fontFamily: 'var(--font-core)', fontSize: 'var(--text-heading-1)', lineHeight: 'var(--leading-snug)', letterSpacing: 'var(--tracking-display)', color: 'var(--text-heading)', fontWeight: 'var(--weight-regular)' }}>
        {children}
      </h2>
      {rule ? <span style={{ width: 72, height: 1, background: 'var(--gradient-brand)' }} /> : null}
    </header>
  );
}
