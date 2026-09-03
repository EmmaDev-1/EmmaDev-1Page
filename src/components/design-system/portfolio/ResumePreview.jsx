import React from 'react';
import { GradientFrame } from '../core/GradientFrame.jsx';

/* Downloadable resume thumbnail inside the rotating gradient frame
   (.resumeContainer). Source frame was 610x790 desktop, 310x400 mobile. */
export function ResumePreview({ src, href, width = 610, height = 790, label = 'Download CV', style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  return (
    <GradientFrame style={{ width, height, maxWidth: '100%', ...style }} {...rest}>
      <a
        href={href}
        download
        target="_blank"
        rel="noreferrer"
        aria-label={label}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ display: 'block', width: '100%', height: '100%', position: 'relative', transition: 'transform var(--dur-normal) var(--ease-out-soft)', transform: hover ? 'translateY(-4px)' : 'none' }}
      >
        <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
        <span style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 'var(--space-8) var(--space-5) var(--space-5)', background: 'var(--gradient-scrim)', color: 'var(--ink-000)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-label)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', textAlign: 'center', opacity: hover ? 1 : 0.75, transition: 'opacity var(--dur-normal) var(--ease-standard)' }}>
          {label}
        </span>
      </a>
    </GradientFrame>
  );
}
