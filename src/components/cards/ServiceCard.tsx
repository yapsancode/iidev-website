"use client";
import * as React from "react";
import Image from "next/image";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "relative flex flex-col justify-between w-full p-8 overflow-hidden rounded-xl shadow-sm transition-shadow duration-300 ease-in-out group hover:shadow-lg min-h-[280px]",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        blue: "bg-blue-500/90 text-white",
        gray: "bg-secondary text-secondary-foreground",
        dark: "bg-neutral-900 text-white dark:bg-neutral-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ServiceCardProps
  extends Omit<
      React.HTMLAttributes<HTMLDivElement>,
      "onAnimationStart" | "onDrag" | "onDragStart" | "onDragEnd"
    >,
    VariantProps<typeof cardVariants> {
  title: string;
  href: string;
  price: string;
  target: string;
  description: string;
  imgSrc?: string;
  imgAlt?: string;
  imgClassName?: string;
}

const cardAnimation: Variants = {
  hover: { scale: 1.02, transition: { duration: 0.3 } },
};

const imageAnimation: Variants = {
  hover: {
    scale: 1.1,
    rotate: 3,
    x: 10,
    transition: { duration: 0.4, ease: "easeInOut" },
  },
};

const arrowAnimation: Variants = {
  hover: {
    x: 5,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse" as const,
    },
  },
};

const ServiceCard = React.forwardRef<HTMLDivElement, ServiceCardProps>(
  (
    {
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
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        className={cn(cardVariants({ variant, className }))}
        ref={ref}
        variants={cardAnimation}
        whileHover="hover"
        {...props}
      >
        <div className="relative z-10 flex flex-col h-full gap-3">
          <p className="text-xs font-bold uppercase tracking-widest opacity-60">
            {target}
          </p>
          <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
          <p className="text-sm opacity-75 leading-relaxed">{description}</p>
          <p className="text-xl font-bold mt-1">{price}</p>

          <a
            href={href}
            aria-label={`Learn more about ${title}`}
            className="mt-auto pt-4 flex items-center text-sm font-semibold group-hover:underline"
          >
            SEE WHAT YOU GET
            <motion.div variants={arrowAnimation}>
              <ArrowRight className="ml-2 h-4 w-4" />
            </motion.div>
          </a>
        </div>

        {imgSrc && (
          <motion.div
            className={cn(
              "absolute",
              imgClassName ?? "-right-8 -bottom-8 w-40 h-40"
            )}
            variants={imageAnimation}
          >
            <Image
              src={imgSrc}
              alt={imgAlt ?? title}
              fill
              sizes="160px"
              className="object-contain opacity-90 group-hover:opacity-100"
            />
          </motion.div>
        )}
      </motion.div>
    );
  }
);

ServiceCard.displayName = "ServiceCard";
export { ServiceCard };
