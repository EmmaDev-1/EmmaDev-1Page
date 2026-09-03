import React from 'react';

/* Trailing cursor dots — the site's most distinctive flourish. 13 fixed circles
   easing toward the pointer at 0.3, scaled down along the chain, coloured with
   the violet trail ramp from principal.js. Disabled on touch/coarse pointers
   and when the user prefers reduced motion (the source's mobile CSS zeroed
   the circles' size for the same reason). */
const TRAIL = ['#a945c7','#a945c7','#ae4fca','#ae4fca','#b55ccf','#b55ccf','#bb67d3','#c172d7','#ce7fe4','#d689ec','#df90f6','#e19cf5','#e2a9f2'];

export function CursorTrail({ count = 13, dotSize = 24, colors = TRAIL, follow = 0.3 }) {
  const refs = React.useRef([]);
  const [enabled, setEnabled] = React.useState(false);
  React.useEffect(() => {
    const ok = window.matchMedia('(hover:hover) and (pointer:fine)').matches
      && !window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    setEnabled(ok);
  }, []);
  React.useEffect(() => {
    if (!enabled) return;
    const coords = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = refs.current.map(() => ({ x: coords.x, y: coords.y }));
    const onMove = (e) => { coords.x = e.clientX; coords.y = e.clientY; };
    window.addEventListener('mousemove', onMove);
    let raf;
    const tick = () => {
      let x = coords.x, y = coords.y;
      refs.current.forEach((el, i) => {
        if (!el) return;
        el.style.transform = `translate3d(${x - dotSize / 2}px,${y - dotSize / 2}px,0) scale(${(refs.current.length - i) / refs.current.length})`;
        pos[i].x = x; pos[i].y = y;
        const next = pos[i + 1] || pos[0];
        x += (next.x - x) * follow;
        y += (next.y - y) * follow;
      });
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, [enabled, dotSize, follow]);
  if (!enabled) return null;
  return (
    <div aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999999 }}>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          style={{ position: 'fixed', top: 0, left: 0, width: dotSize, height: dotSize, borderRadius: '50%', background: colors[i % colors.length], mixBlendMode: 'screen', filter: 'blur(0.5px)' }}
        />
      ))}
    </div>
  );
}
