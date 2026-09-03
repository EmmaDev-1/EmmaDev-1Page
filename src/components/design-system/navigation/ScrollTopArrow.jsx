import React from 'react';

/* Fixed back-to-top affordance, bottom-right at 20px. Source hover stacked
   five violet drop-shadows for a heavy bloom (.fixed-arrow img:hover). */
export function ScrollTopArrow({ href = '#home', assetBase = '../../assets/icons', size = 50, visible = true, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a
      {...rest}
      href={href}
      aria-label="Back to top"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'fixed', bottom: 20, right: 20, zIndex: 1000, display: 'inline-flex',
        opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none',
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity var(--dur-normal) var(--ease-standard), transform var(--dur-normal) var(--ease-out-soft)',
        ...style,
      }}
    >
      <img
        src={`${assetBase}/arrow1.png`}
        alt=""
        width={size}
        style={{ width: size, transition: 'filter 700ms var(--ease-standard)', filter: hover ? 'drop-shadow(0 0 20px #a945c7) drop-shadow(0 0 20px #a945c7) drop-shadow(0 0 20px #a945c7)' : 'none' }}
      />
    </a>
  );
}
