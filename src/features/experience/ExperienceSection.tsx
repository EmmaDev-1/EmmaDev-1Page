'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ExperienceCard, IconButton, Reveal, SectionHeading } from '@/components/design-system';
import { Section } from '@/components/ui/Section';
import { experience, SECTION_IDS } from '@/content';

/**
 * Experience carousel.
 *
 * The source carousel was driven by `currentIndex % (cards.length - 1)`, which
 * with three cards made the third one unreachable, and it measured card width
 * once at load so it broke on resize. This is a scroll-snap rail instead: the
 * browser owns the position, so touch, trackpad, keyboard and the ❮ / ❯ arrows
 * all agree, and there is no index arithmetic to get wrong.
 *
 * The arrows disable themselves when the rail is not actually overflowing,
 * which is the common case on a wide screen with three cards.
 */
export function ExperienceSection() {
  const railRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [overflowing, setOverflowing] = useState(false);

  const sync = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    // 1px of slack absorbs sub-pixel scroll positions at fractional zoom.
    const maxScroll = rail.scrollWidth - rail.clientWidth;
    setOverflowing(maxScroll > 1);
    setAtStart(rail.scrollLeft <= 1);
    setAtEnd(rail.scrollLeft >= maxScroll - 1);
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    sync();
    rail.addEventListener('scroll', sync, { passive: true });
    const resizeObserver = new ResizeObserver(sync);
    resizeObserver.observe(rail);
    return () => {
      rail.removeEventListener('scroll', sync);
      resizeObserver.disconnect();
    };
  }, [sync]);

  const scrollByCard = useCallback((direction: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    const firstCard = rail.firstElementChild;
    // Fall back to a viewport-width nudge if the rail is somehow empty.
    const step = firstCard instanceof HTMLElement ? firstCard.offsetWidth + 20 : rail.clientWidth;
    rail.scrollBy({ left: direction * step, behavior: 'smooth' });
  }, []);

  return (
    <Section id={SECTION_IDS.experience}>
      <div className="mb-16 flex items-end justify-between gap-6">
        <SectionHeading eyebrow="03 — Career">Experience</SectionHeading>

        {overflowing ? (
          <div className="flex shrink-0 gap-3">
            <IconButton
              label="Previous experience"
              glyph="❮"
              disabled={atStart}
              onClick={() => scrollByCard(-1)}
              style={{ opacity: atStart ? 0.35 : 1 }}
            />
            <IconButton
              label="Next experience"
              glyph="❯"
              disabled={atEnd}
              onClick={() => scrollByCard(1)}
              style={{ opacity: atEnd ? 0.35 : 1 }}
            />
          </div>
        ) : null}
      </div>

      <div
        ref={railRef}
        className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 nav:mx-0 nav:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {experience.map((role, index) => (
          <Reveal
            key={role.id}
            delay={index * 120}
            className="w-[var(--rail-card-width)] shrink-0 snap-start nav:w-auto nav:flex-1"
          >
            <ExperienceCard
              org={role.org}
              role={role.role}
              period={role.period}
              points={role.points}
              stack={role.stack}
              style={{ height: '100%' }}
            />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
