import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Download,
  Play,
  X,
  type LucideIcon,
} from 'lucide-react';

/**
 * The app's icon vocabulary.
 *
 * The design system ships three raster PNGs and two unicode glyphs, and its
 * README asks to consult the author before introducing an icon library —
 * warning that a set like Lucide "would immediately look borrowed" beside
 * three hand-picked marks. That question was put to him and he chose Lucide,
 * so this is a sanctioned extension, not a drive-by dependency.
 *
 * Two things keep it from sprawling into a borrowed look:
 *
 *   1. This allowlist. Icons are addressed by name, so adding one is a
 *      deliberate edit here rather than a new import in some component.
 *   2. Weight. Lucide draws at strokeWidth 2 on a 24px box, which reads heavy
 *      against a system built on hairline borders and a single-weight rounded
 *      sans. These default to 1.5 on 20, which sits with the type instead of
 *      shouting over it.
 *
 * The social marks stay as the DS's own PNGs — those are third-party brand
 * marks, not interface affordances, and Lucide is the wrong source for them.
 */
const ICONS = {
  arrowDown: ArrowDown,
  arrowRight: ArrowRight,
  /** Outbound: a project's store listing, a live site. */
  arrowUpRight: ArrowUpRight,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  download: Download,
  play: Play,
  close: X,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

type Props = {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
  /**
   * Only pass this when the icon is the sole content of a control. Icons
   * sitting beside a text label are decorative and stay hidden from assistive
   * technology, which is the default.
   */
  label?: string;
};

export function Icon({ name, size = 20, strokeWidth = 1.5, className, label }: Props) {
  const Glyph = ICONS[name];

  return (
    <Glyph
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      // Icons inherit their colour so a hover state on the parent carries.
      color="currentColor"
    />
  );
}
