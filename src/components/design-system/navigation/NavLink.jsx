import React from 'react';

/* Nav item. The source rendered nav labels in gradient-filled text and turned
   them into a glowing violet pill on hover (.btn-nav / .btn-nav:hover). */
export function NavLink({ href, children, active = false, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a
      {...rest}
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        display: 'inline-block',
        padding: '10px 18px',
        borderRadius: 'var(--radius-pill)',
        fontFamily: 'var(--font-core)',
        fontSize: 'var(--text-body-md)',
        letterSpacing: 'var(--tracking-nav)',
        textDecoration: 'none',
        transition: 'background-color var(--dur-normal) var(--ease-standard), box-shadow var(--dur-slow) var(--ease-standard), color var(--dur-normal) var(--ease-standard)',
        background: hover ? 'var(--accent)' : 'transparent',
        boxShadow: hover ? 'var(--glow-accent-lg)' : 'none',
        color: hover ? 'var(--text-on-accent)' : active ? 'var(--ink-000)' : 'var(--text-body)',
        ...style,
      }}
    >
      {children}
      <span
        aria-hidden="true"
        style={{ position: 'absolute', left: 18, right: 18, bottom: 4, height: 1, background: 'var(--gradient-brand)', opacity: active && !hover ? 1 : 0, transition: 'opacity var(--dur-normal) var(--ease-standard)' }}
      />
    </a>
  );
}
