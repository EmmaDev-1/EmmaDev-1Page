import React from 'react';
import { TagChip } from '../core/TagChip.jsx';

/* Experience card. The source card was navy (#101f57) with a heavy black
   shadow and 7% radius; on graphite that navy reads as an accident, so the
   card is restated as a raised graphite surface with a gradient top edge.
   The navy is preserved in tokens as --legacy-card-navy. */
export function ExperienceCard({ role, org, period, points = [], stack = [], style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  return (
    <article
      {...rest}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)',
        padding: 'var(--space-8)', paddingTop: 'var(--space-10)',
        background: hover ? 'var(--surface-card-hover)' : 'var(--surface-card)',
        border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-lg)',
        boxShadow: hover ? 'var(--shadow-lg)' : 'var(--shadow-md)',
        transform: hover ? 'translateY(var(--lift-hover))' : 'none',
        transition: 'background-color var(--dur-normal) var(--ease-standard), box-shadow var(--dur-normal) var(--ease-standard), transform var(--dur-normal) var(--ease-out-soft)',
        overflow: 'hidden', ...style,
      }}
    >
      <span aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--gradient-brand)', opacity: hover ? 1 : 0.45, transition: 'opacity var(--dur-normal) var(--ease-standard)' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {period ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-micro)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', color: 'var(--accent)' }}>{period}</span> : null}
        <h3 style={{ margin: 0, fontFamily: 'var(--font-core)', fontSize: 'var(--text-heading-2)', color: 'var(--text-heading)', fontWeight: 'var(--weight-regular)' }}>{org}</h3>
        {role ? <span style={{ fontFamily: 'var(--font-core)', fontSize: 'var(--text-body-sm)', color: 'var(--text-muted)' }}>{role}</span> : null}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {points.map((p, i) => (
          <p key={i} style={{ margin: 0, fontFamily: 'var(--font-core)', fontSize: 'var(--text-body-sm)', lineHeight: 'var(--leading-relaxed)', color: 'var(--text-body)', textWrap: 'pretty' }}>{p}</p>
        ))}
      </div>
      {stack.length ? (
        <div style={{ marginTop: 'auto', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', paddingTop: 'var(--space-4)' }}>
          {stack.map((t) => <TagChip key={t}>{t}</TagChip>)}
        </div>
      ) : null}
    </article>
  );
}
