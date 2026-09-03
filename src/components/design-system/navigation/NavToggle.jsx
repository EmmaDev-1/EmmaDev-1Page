import React from 'react';

/* Three-bar hamburger, fixed top-left. Matches .navbar-toggle: 25x3px bars,
   3px gaps, white — but animates into an X when open. */
export function NavToggle({ open = false, onClick, style, ...rest }) {
  const bar = { height: 3, width: 25, background: 'var(--ink-000)', borderRadius: 2, transition: 'transform var(--dur-normal) var(--ease-standard), opacity var(--dur-fast) var(--ease-standard)' };
  return (
    <button
      {...rest}
      onClick={onClick}
      aria-label={open ? 'Close menu' : 'Open menu'}
      aria-expanded={open}
      style={{
        display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center', justifyContent: 'center',
        width: 'var(--tap-min)', height: 'var(--tap-min)', padding: 0,
        background: 'transparent', border: 'none', cursor: 'pointer', ...style,
      }}
    >
      <span style={{ ...bar, transform: open ? 'translateY(6px) rotate(45deg)' : 'none' }} />
      <span style={{ ...bar, opacity: open ? 0 : 1 }} />
      <span style={{ ...bar, transform: open ? 'translateY(-6px) rotate(-45deg)' : 'none' }} />
    </button>
  );
}
