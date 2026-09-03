import React from 'react';
import { TagChip } from '../core/TagChip.jsx';
import { Reveal } from '../motion/Reveal.jsx';

/* Two-column project block: media on one side, copy on the other, alternating
   down the page (.mainColumnProjects / .columnProjects). */
export function ProjectRow({ title, description, media, stack = [], flip = false, index, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  return (
    <article
      {...rest}
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 'var(--space-16)', alignItems: 'center', ...style }}
    >
      <Reveal
        from={flip ? 'right' : 'left'}
        style={{ order: flip ? 2 : 1, minWidth: 0 }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-hairline)', boxShadow: hover ? 'var(--shadow-lg), var(--glow-accent-sm)' : 'var(--shadow-md)', transform: hover ? 'translateY(var(--lift-hover))' : 'none', transition: 'transform var(--dur-normal) var(--ease-out-soft), box-shadow var(--dur-normal) var(--ease-standard)', background: 'var(--surface-inset)' }}>
          {media}
        </div>
      </Reveal>
      <Reveal from={flip ? 'left' : 'right'} delay={120} style={{ order: flip ? 1 : 2, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', alignItems: 'flex-start' }}>
        {index != null ? (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-micro)', letterSpacing: 'var(--tracking-wide)', color: 'var(--text-faint)' }}>
            {String(index).padStart(2, '0')}
          </span>
        ) : null}
        <h3 style={{ margin: 0, fontFamily: 'var(--font-core)', fontSize: 'var(--text-heading-1)', lineHeight: 'var(--leading-snug)', letterSpacing: 'var(--tracking-display)', color: 'var(--text-heading)', fontWeight: 'var(--weight-regular)' }}>{title}</h3>
        <p style={{ margin: 0, fontFamily: 'var(--font-core)', fontSize: 'var(--text-body-md)', lineHeight: 'var(--leading-relaxed)', color: 'var(--text-body)', maxWidth: 'var(--measure-prose)', textWrap: 'pretty' }}>{description}</p>
        {stack.length ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            {stack.map((t) => <TagChip key={t}>{t}</TagChip>)}
          </div>
        ) : null}
      </Reveal>
    </article>
  );
}
