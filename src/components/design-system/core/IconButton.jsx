import React from 'react';

/* Circular icon control. Covers the carousel arrows (.prev/.next) and any
   round affordance; hover fills with the translucent violet the source used
   (#a945c758 == rgba(169,69,199,.35)). */
export function IconButton({ children, label, size = 48, glyph, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  return (
    <button
      {...rest}
      aria-label={label}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      style={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid var(--border-hairline)',
        borderRadius: '50%',
        background: hover ? 'var(--accent-soft-strong)' : 'transparent',
        color: 'var(--accent)',
        fontSize: Math.round(size * 0.42),
        fontFamily: 'var(--font-core)',
        lineHeight: 1,
        cursor: 'pointer',
        padding: 0,
        transition: 'background-color var(--dur-normal) var(--ease-standard), border-color var(--dur-normal) var(--ease-standard), transform var(--dur-fast) var(--ease-standard)',
        borderColor: hover ? 'var(--border-accent)' : 'var(--border-hairline)',
        transform: press ? 'scale(var(--scale-press))' : 'scale(1)',
        ...style,
      }}
    >
      {glyph || children}
    </button>
  );
}
