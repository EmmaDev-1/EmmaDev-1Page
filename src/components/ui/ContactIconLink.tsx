import Image from 'next/image';
import { profile } from '@/content';
import { whatsappHref } from '@/lib/contact';

type Props = {
  href: string;
  /** Path to the mark, under /icons. */
  src: string;
  /** Accessible name. The image itself is decorative. */
  label: string;
  /** Icon edge in px, matching the SocialIconLink it sits beside. */
  size: number;
};

/**
 * An icon link for a contact channel that is not a social profile.
 *
 * This exists because the design system's `SocialIconLink` cannot be asked to
 * render a third mark. It builds its own source as `${assetBase}/${network}.png`
 * and its `network` is typed — and separately linted, by the adherence rules
 * generated from the design system's own contract — as `github | linkedin`.
 * Passing anything else would mean editing a vendored file or evading the rule
 * that guards it, so instead the grammar is reproduced from the same tokens:
 * a 44px tap target (`--tap-min`), the mark scaling to `--scale-icon-hover`
 * and doubling in brightness over `--dur-normal`. Beside the real component
 * the two are indistinguishable, which is the point.
 *
 * Hover is CSS rather than React state, so this needs no client boundary of
 * its own and works wherever it is placed.
 */
export function ContactIconLink({ href, src, label, size }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="group inline-flex h-[var(--tap-min)] w-[var(--tap-min)] items-center justify-center"
    >
      {/*
        `priority` because every placement of this is above the fold or inside
        an overlay that opens instantly — lazy-loading it would pop it in a
        beat after the two marks beside it, which are plain <img> tags inside a
        vendored component and never wait.
      */}
      <Image
        src={src}
        alt=""
        width={size}
        height={size}
        priority
        /*
          The hover filter is a token because it cannot be one value:
          brightening lifts a full-colour mark off graphite and only bleaches
          it on paper, so the light theme dims and saturates instead.
        */
        className="transition-[transform,filter] duration-normal ease-out-soft group-hover:scale-[var(--scale-icon-hover)] group-hover:[filter:var(--mark-hover-filter)]"
      />
    </a>
  );
}

/**
 * The WhatsApp chat as an icon link — the one concrete use of ContactIconLink,
 * and now in three rows: the nav bar, the hero, and the footer.
 *
 * A wrapper rather than the four props written out at each site, for the same
 * reason `whatsappHref` itself was pulled into `lib/contact`: the number, the
 * mark and the label are the same in all three, and one of them changing
 * should not be three edits. Only `size` varies, tracking the social marks in
 * whichever row it joins.
 *
 * It sits with the social marks but is deliberately not one of them — it opens
 * a chat, not a page about him — which is why it stays out of `profile.social`.
 * That array feeds the JSON-LD's `sameAs`, and a chat link is not something
 * that verifies an identity.
 */
export function WhatsAppIconLink({ size }: { size: number }) {
  return (
    <ContactIconLink
      href={whatsappHref(profile.phone)}
      src="/icons/whatsapp.png"
      label="WhatsApp chat"
      size={size}
    />
  );
}
