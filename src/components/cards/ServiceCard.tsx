import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ServiceMorph } from "@/components/ui/ServiceMorph";

export interface ServiceCardProps {
  title: string;
  href: string;
  price: string;
  target: string;
  description: string;
}

// One row of the ladder on /services. The whole row is one link, so it can be
// tapped anywhere.
export function ServiceCard({ title, href, price, target, description }: ServiceCardProps) {
  const slug = href.slice(href.lastIndexOf("/") + 1);

  return (
    <Link href={href} className="rung">
      <p className="rung-kind">{target}</p>
      <div className="rung-main">
        <h2 className="display rung-title">
          <ServiceMorph slug={slug} part="title">
            <span>{title}</span>
          </ServiceMorph>
        </h2>
        <p className="rung-text">{description}</p>
      </div>
      <div className="rung-side">
        <ServiceMorph slug={slug} part="price">
          <p className="rung-price">{price}</p>
        </ServiceMorph>
        <span className="rung-more">
          See what you get
          <ArrowRight aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
