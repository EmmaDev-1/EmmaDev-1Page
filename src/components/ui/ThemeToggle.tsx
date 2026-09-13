'use client';

import { useTheme } from '@/lib/hooks';
import { Icon } from './Icon';

/**
 * Switches the page between the graphite surface the design system ships and
 * the light one built on top of it.
 *
 * There is almost nothing here, and that is deliberate. Everything the reader
 * sees — the knob's position, which face is lit, the slide between them — is
 * CSS keyed off `[data-theme]` on <html> (see globals.css), because that
 * attribute is set in <head> and is therefore correct before this component
 * has rendered once. React is left with the two jobs CSS cannot do: telling
 * assistive technology which way the switch is thrown, and flipping it.
 *
 * `role="switch"` rather than a button labelled with the theme it would move
 * to. A button that says "Dark" is ambiguous — it could as easily be
 * describing the current state as the destination — where a switch named for
 * one theme and reporting checked or not cannot be read two ways.
 */
export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={theme === 'light'}
      aria-label="Light theme"
      onClick={toggle}
      className="theme-toggle"
    >
      {/*
        Both faces are always rendered and always in the same order; only their
        styling changes. Swapping which one exists would cost the transition
        between them, and would make the track's width depend on its state.
      */}
      <span className="theme-toggle-knob" aria-hidden="true" />
      <span className="theme-toggle-face" data-face="sun" aria-hidden="true">
        <Icon name="sun" size={15} strokeWidth={1.75} />
      </span>
      <span className="theme-toggle-face" data-face="moon" aria-hidden="true">
        <Icon name="moon" size={15} strokeWidth={1.75} />
      </span>
    </button>
  );
}
