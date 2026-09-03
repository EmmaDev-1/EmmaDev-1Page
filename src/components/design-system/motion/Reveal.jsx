import React from 'react';

/* Scroll reveal. The source wired a single IntersectionObserver that added
   .show to sections; the reveal was opacity + blur(5px) + translateX(-20%)
   over 3.5s. This keeps the blur-out character at a shorter duration and
   supports a stagger index. */
export function Reveal({ children, from = 'up', delay = 0, duration = 'var(--dur-reveal)', blur = true, once = true, as = 'div', style, ...rest }) {
  const ref = React.useRef(null);
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { setShown(true); if (once) io.unobserve(e.target); }
        else if (!once) setShown(false);
      });
    }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, [once]);
  const offsets = { up: 'translateY(40px)', down: 'translateY(-40px)', left: 'translateX(-20%)', right: 'translateX(20%)', none: 'none' };
  const Tag = as;
  return (
    <Tag
      {...rest}
      ref={ref}
      style={{
        opacity: shown ? 1 : 0,
        filter: shown || !blur ? 'blur(0)' : 'blur(var(--blur-veil))',
        transform: shown ? 'none' : offsets[from],
        transition: `opacity ${duration} var(--ease-out-soft) ${delay}ms, transform ${duration} var(--ease-out-soft) ${delay}ms, filter ${duration} var(--ease-standard) ${delay}ms`,
        willChange: 'opacity, transform, filter',
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
