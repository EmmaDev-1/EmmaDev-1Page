import React from 'react';

const base = {
  fontFamily: 'var(--font-core)',
  fontSize: 'var(--text-body-sm)',
  lineHeight: 1,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'var(--space-2)',
  border: '1px solid transparent',
  borderRadius: 'var(--radius-pill)',
  cursor: 'pointer',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  transition: 'background-color var(--dur-normal) var(--ease-standard), box-shadow var(--dur-normal) var(--ease-standard), border-color var(--dur-normal) var(--ease-standard), color var(--dur-normal) var(--ease-standard), transform var(--dur-fast) var(--ease-standard)',
};

const sizes = {
  sm: { padding: '8px 13px', fontSize: 'var(--text-label)' },
  md: { padding: '12px 22px', fontSize: 'var(--text-body-sm)', minHeight: 'var(--tap-min)' },
  lg: { padding: '15px 30px', fontSize: 'var(--text-body-md)', minHeight: 'var(--tap-min)' },
};

const variants = {
  solid: { background: 'var(--accent)', color: 'var(--text-on-accent)' },
  outline: { background: 'transparent', color: 'var(--text-body)', borderColor: 'var(--border-subtle)' },
  ghost: { background: 'transparent', color: 'var(--text-muted)' },
  gradient: { background: 'var(--gradient-brand)', color: 'var(--text-on-accent)', backgroundSize: '200% 100%' },
};

const hovers = {
  solid: { background: 'var(--accent-hover)', boxShadow: 'var(--glow-accent-md)' },
  outline: { borderColor: 'var(--border-accent)', color: 'var(--ink-000)', boxShadow: 'var(--glow-accent-sm)' },
  ghost: { background: 'var(--accent-soft)', color: 'var(--ink-000)' },
  gradient: { boxShadow: 'var(--glow-accent-md)', backgroundPosition: '100% 0' },
};

export function Button({ variant = 'solid', size = 'md', disabled = false, fullWidth = false, href, iconLeft, iconRight, children, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const Tag = href ? 'a' : 'button';
  return (
    <Tag
      {...rest}
      href={href}
      disabled={Tag === 'button' ? disabled : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      style={{
        ...base,
        ...sizes[size],
        ...variants[variant],
        ...(hover && !disabled ? hovers[variant] : null),
        transform: press && !disabled ? 'scale(var(--scale-press))' : 'scale(1)',
        width: fullWidth ? '100%' : undefined,
        opacity: disabled ? 0.4 : 1,
        pointerEvents: disabled ? 'none' : undefined,
        ...style,
      }}
    >
      {iconLeft}
      {children}
      {iconRight}
    </Tag>
  );
}
