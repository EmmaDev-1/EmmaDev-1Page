import React from 'react';

/* Auto-cycling image stack with a cross-fade. The source did this by hand for
   the OSC and Casa Padi screenshot sets: opacity to 0, swap src after 500ms,
   back to 1, every 3s. */
export function MediaCarousel({ images = [], alt = '', interval = 3000, fade = 500, radius = 'var(--radius-md)', style, ...rest }) {
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    if (images.length < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % images.length), interval);
    return () => clearInterval(t);
  }, [images.length, interval]);
  return (
    <div {...rest} style={{ position: 'relative', overflow: 'hidden', borderRadius: radius, background: 'var(--surface-inset)', aspectRatio: '16 / 10', ...style }}>
      {images.map((src, n) => (
        <img
          key={src}
          src={src}
          alt={n === i ? alt : ''}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: n === i ? 1 : 0, transition: `opacity ${fade}ms var(--ease-standard)` }}
        />
      ))}
      {images.length > 1 ? (
        <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 'var(--space-2)' }}>
          {images.map((src, n) => (
            <span key={src} style={{ width: n === i ? 18 : 6, height: 6, borderRadius: 'var(--radius-pill)', background: n === i ? 'var(--accent)' : 'var(--border-strong)', transition: 'width var(--dur-normal) var(--ease-out-soft), background-color var(--dur-normal) var(--ease-standard)' }} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
