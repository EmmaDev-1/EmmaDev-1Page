import React from 'react';
import { NavLink } from './NavLink.jsx';

/* Slide-in mobile drawer. Source: 75% width, off-canvas at left:-100%,
   background #333, rounded top-right corner, 300ms ease-in-out. */
export function NavPanel({ open = false, items = [], activeHref, onClose, footer, style, ...rest }) {
  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        style={{ position: 'fixed', inset: 0, background: 'var(--surface-overlay)', backdropFilter: 'blur(4px)', zIndex: 999, opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none', transition: 'opacity var(--dur-normal) var(--ease-standard)' }}
      />
      <aside
        {...rest}
        style={{
          position: 'fixed', top: 0, left: open ? 0 : '-100%', width: '75%', maxWidth: 360, height: '100%',
          background: 'var(--graphite-500)', borderTopRightRadius: 'var(--radius-md)', borderBottomRightRadius: 'var(--radius-md)',
          zIndex: 9999, display: 'flex', flexDirection: 'column',
          transition: 'left var(--dur-normal) var(--ease-out-soft)', paddingTop: 'var(--space-5)',
          ...style,
        }}
      >
        <button onClick={onClose} aria-label="Close menu" style={{ alignSelf: 'flex-end', margin: '10px 20px', background: 'transparent', border: 'none', color: 'var(--ink-000)', fontSize: 30, lineHeight: 1, cursor: 'pointer' }}>×</button>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', padding: '0 var(--space-5)' }}>
          {items.map((it, i) => (
            <NavLink
              key={it.href}
              href={it.href}
              active={it.href === activeHref}
              onClick={onClose}
              style={{ fontSize: 'var(--text-heading-3)', opacity: open ? 1 : 0, transform: open ? 'translateX(0)' : 'translateX(-12px)', transition: `opacity var(--dur-normal) var(--ease-standard) ${i * 60}ms, transform var(--dur-normal) var(--ease-out-soft) ${i * 60}ms` }}
            >
              {it.label}
            </NavLink>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center', gap: 'var(--space-8)', padding: 'var(--space-10) 0' }}>{footer}</div>
      </aside>
    </>
  );
}
