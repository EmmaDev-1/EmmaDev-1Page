import React from 'react';

/* Rotating-gradient border frame — the source's .resumeContainer::before trick:
   an oversized gradient bar spinning behind an inset panel, so the edge appears
   to be a travelling light. */
export function GradientFrame({ children, radius = 'var(--radius-lg)', inset = 2, speed = 'var(--dur-orbit)', style, ...rest }) {
  return (
    <>
      <style>{'@keyframes edFrameOrbit{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}'}</style>
      <div
        {...rest}
        style={{ position: 'relative', overflow: 'hidden', borderRadius: radius, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-page)', ...style }}
      >
        <span
          aria-hidden="true"
          style={{ position: 'absolute', width: '250%', height: '40%', background: 'var(--gradient-brand-vertical)', borderRadius: radius, animation: `edFrameOrbit ${speed} var(--ease-linear) infinite` }}
        />
        <div style={{ position: 'relative', zIndex: 2, inset, borderRadius: `calc(${radius} - 2px)`, background: 'var(--bg-page)', width: `calc(100% - ${inset * 2}px)`, height: `calc(100% - ${inset * 2}px)`, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {children}
        </div>
      </div>
    </>
  );
}
