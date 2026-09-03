/**
 * @types/react 19 removed the global `JSX` namespace in favour of `React.JSX`.
 * The vendored design-system declarations were authored against the older
 * global and use bare `JSX.Element` / `JSX.IntrinsicElements`.
 *
 * Rather than edit vendored files (which must stay byte-identical to upstream),
 * this shim re-publishes the global namespace as an alias of React's own.
 * Delete it if the design system is ever regenerated against React 19 types.
 */
import type * as React from 'react';

declare global {
  namespace JSX {
    type Element = React.JSX.Element;
    type ElementType = React.JSX.ElementType;
    type ElementClass = React.JSX.ElementClass;
    type IntrinsicElements = React.JSX.IntrinsicElements;
    type IntrinsicAttributes = React.JSX.IntrinsicAttributes;
    type ElementAttributesProperty = React.JSX.ElementAttributesProperty;
    type ElementChildrenAttribute = React.JSX.ElementChildrenAttribute;
  }
}
