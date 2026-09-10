/**
 * How a stored phone number becomes a WhatsApp chat link.
 *
 * `wa.me` takes the number as digits only — country code included, and no
 * `+`, spaces or dashes. `profile.phone` carries all three for legibility, so
 * the link is derived from it rather than stored beside it: two copies of a
 * phone number is how the one a reader can see ends up differing from the one
 * the link actually opens a chat with.
 *
 * Lives here rather than in the footer that first needed it, now that the nav
 * shows the same contact.
 */
export function whatsappHref(phone: string): string {
  return `https://wa.me/${phone.replace(/\D/g, '')}`;
}
