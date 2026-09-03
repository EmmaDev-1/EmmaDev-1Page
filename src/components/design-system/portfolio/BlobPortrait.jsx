import React from 'react';

/* Portrait morphing between four organic border-radius shapes on a 10s loop —
   the source's .blob-image / @keyframes blob-animation. */
export function BlobPortrait({ src, alt = '', size = 400, ring = true, style, ...rest }) {
  return (
    <>
      <style>{'@keyframes edBlob{0%,100%{border-radius:33% 67% 70% 30%/30% 30% 70% 70%}25%{border-radius:58% 42% 75% 25%/76% 46% 54% 24%}50%{border-radius:50% 50% 33% 67%/55% 25% 75% 45%}75%{border-radius:33% 67% 58% 42%/55% 60% 40% 45%}}'}</style>
      <div {...rest} style={{ position: 'relative', width: size, height: size, ...style }}>
        {ring ? (
          <span aria-hidden="true" style={{ position: 'absolute', inset: -14, background: 'var(--gradient-brand)', opacity: 0.28, filter: 'blur(26px)', animation: 'edBlob var(--dur-blob-cycle) var(--ease-standard) infinite' }} />
        ) : null}
        <img
          src={src}
          alt={alt}
          style={{ position: 'relative', width: '100%', height: '100%', objectFit: 'cover', boxShadow: 'var(--shadow-portrait)', animation: 'edBlob var(--dur-blob-cycle) var(--ease-standard) infinite', transition: 'border-radius var(--dur-normal) var(--ease-standard)' }}
        />
      </div>
    </>
  );
}
