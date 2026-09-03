import React from 'react';

/* Social icon link. Uses the site's own PNG icons; hover scales 1.4x and
   brightens, exactly as .contact-icons img:hover did. */
export function SocialIconLink({ network = 'github', href, size = 38, assetBase = '../../assets/icons', label, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const src = `${assetBase}/${network}.png`;
  return (
    <a
      {...rest}
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label || network}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 'var(--tap-min)', height: 'var(--tap-min)', ...style }}
    >
      <img
        src={src}
        alt=""
        width={size}
        height={size}
        style={{ width: size, height: size, transition: 'transform var(--dur-normal) var(--ease-out-soft), filter var(--dur-normal) var(--ease-standard)', transform: hover ? 'scale(var(--scale-icon-hover))' : 'scale(1)', filter: hover ? 'brightness(2)' : 'brightness(1)' }}
      />
    </a>
  );
}
