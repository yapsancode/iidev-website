import Image from "next/image";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowRight } from "lucide-react";
import { ServiceMorph } from "@/components/ui/ServiceMorph";
import {
  CARD_ACCENT,
  CARD_DARK,
  CARD_HOVER,
  CARD_WHITE,
  LABEL,
} from "@/lib/styles";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  cn(
    "group relative flex min-h-[280px] w-full flex-col justify-between overflow-hidden p-8",
    CARD_HOVER,
  ),
  {
    variants: {
      variant: {
        light: CARD_WHITE,
        accent: CARD_ACCENT,
        dark: CARD_DARK,
      },
    },
    defaultVariants: {
      variant: "light",
    },
  }
);

export interface ServiceCardProps extends VariantProps<typeof cardVariants> {
  title: string;
  href: string;
  price: string;
  target: string;
  description: string;
  imgSrc?: string;
  imgAlt?: string;
  imgClassName?: string;
  className?: string;
}

// The whole card is one link, so it can be tapped anywhere.
export function ServiceCard({
  className,
  variant,
  title,
  href,
  price,
  target,
  description,
  imgSrc,
  imgAlt,
  imgClassName,
}: ServiceCardProps) {
  const slug = href.slice(href.lastIndexOf("/") + 1);

  return (
    <Link href={href} className={cn(cardVariants({ variant }), className)}>
      <div className="relative z-10 flex h-full flex-col gap-3">
        <p className={cn(LABEL, "opacity-80")}>{target}</p>
        <h3 className="text-2xl font-bold tracking-tight">
          {/* leading-none matches the page's h1, so the two line up while they morph. */}
          <ServiceMorph slug={slug} part="title">
            <span className="inline-block leading-none">{title}</span>
          </ServiceMorph>
        </h3>
        <p className="text-sm leading-relaxed opacity-90">{description}</p>
        <ServiceMorph slug={slug} part="price">
          <p className="mt-1 w-fit text-xl font-bold">{price}</p>
        </ServiceMorph>

        <span className={cn(LABEL, "mt-auto flex items-center pt-4 group-hover:underline")}>
          See what you get
          <ArrowRight
            className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </span>
      </div>

      {imgSrc && (
        <div
          className={cn(
            "absolute transition-transform duration-500 ease-in-out group-hover:translate-x-2 group-hover:rotate-3 group-hover:scale-110 motion-reduce:transition-none",
            imgClassName ?? "-right-8 -bottom-8 h-40 w-40"
          )}
        >
          <Image
            src={imgSrc}
            alt={imgAlt ?? title}
            fill
            sizes="160px"
            className="object-contain opacity-90 group-hover:opacity-100"
          />
        </div>
      )}
    </Link>
  );
}
