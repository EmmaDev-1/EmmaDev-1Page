import React from 'react';
import { NavLink } from './NavLink.jsx';

/* Sticky top bar. The source bar was static and centred; this keeps the same
   centred link row but adds the glass treatment the graphite base allows. */
export function NavBar({ items = [], activeHref, brand, right, onToggle, style, ...rest }) {
  return (
    <header
      {...rest}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-6)',
        padding: 'var(--space-4) var(--gutter-desktop)',
        background: 'var(--surface-glass)',
        backdropFilter: 'blur(var(--blur-glass))',
        WebkitBackdropFilter: 'blur(var(--blur-glass))',
        borderBottom: '1px solid var(--border-hairline)',
        ...style,
      }}
    >
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-label)', letterSpacing: 'var(--tracking-wide)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
        {brand}
      </div>
      <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
        {items.map((it) => (
          <NavLink key={it.href} href={it.href} active={it.href === activeHref}>{it.label}</NavLink>
        ))}
      </nav>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>{right}</div>
    </header>
  );
}
