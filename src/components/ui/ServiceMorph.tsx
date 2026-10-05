import { ViewTransition, type ReactNode } from "react";

interface ServiceMorphProps {
  /** Last part of the service URL, e.g. "web-presence". */
  slug: string;
  part: "title" | "price";
  children: ReactNode;
}

/**
 * Gives a service's title or price the same identity on its /services card and
 * on its own page. When the visitor moves between the two, the browser slides
 * and resizes it from one spot to the other instead of swapping it.
 *
 * Wrap exactly one element. Browsers without view transitions just navigate.
 */
export function ServiceMorph({ slug, part, children }: ServiceMorphProps) {
  return (
    <ViewTransition
      name={`service-${slug}-${part}`}
      share={`service-${part}`}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
