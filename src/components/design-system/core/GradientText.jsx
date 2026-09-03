import React from 'react';

/* The brand's signature: text filled with the violet->ember->violet gradient,
   sweeping continuously. Lifted from .homeTitulo / .btn-nav in principal.css. */
export function GradientText({ as = 'span', animate = true, speed, children, style, ...rest }) {
  const Tag = as;
  return (
    <>
      <style>{'@keyframes edGradSweep{0%{background-position:0 1600px}100%{background-position:1600px 0}}'}</style>
      <Tag
        {...rest}
        style={{
          background: 'var(--gradient-brand)',
          backgroundSize: '200% 200%',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          animation: animate ? `edGradSweep ${speed || 'var(--dur-gradient-cycle)'} var(--ease-linear) infinite` : 'none',
          ...style,
        }}
      >
        {children}
      </Tag>
    </>
  );
}
