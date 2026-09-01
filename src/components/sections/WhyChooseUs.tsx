import {
  LifeBuoy,
  ReceiptText,
  Search,
  Users,
  type LucideIcon,
} from "lucide-react";

interface Reason {
  number: string;
  label: string;
  title: string;
  description: string;
  icon: LucideIcon;
  span: string;
  featured?: boolean;
}

const reasons: Reason[] = [
  {
    number: "01",
    label: "Founder-led",
    title: "Founder-led from day one",
    description:
      "No sales hand-off or outsourced production. The founders who hear your goals are the same people shaping and building the work.",
    icon: Users,
    span: "md:col-span-7",
    featured: true,
  },
  {
    number: "02",
    label: "Search-first",
    title: "Built to be found",
    description:
      "We plan every page around how Malaysian customers search—on Google today and AI answers next.",
    icon: Search,
    span: "md:col-span-5",
  },
  {
    number: "03",
    label: "Upfront",
    title: "Clear scope. Clear price.",
    description:
      "Before work starts, you see what is included, what it costs, and what happens next. Changes are discussed before they become charges.",
    icon: ReceiptText,
    span: "md:col-span-5",
  },
  {
    number: "04",
    label: "Long-term",
    title: "Still here after launch",
    description:
      "You keep direct access to a team that already knows the site, so updates and next-stage growth do not start from zero.",
    icon: LifeBuoy,
    span: "md:col-span-7",
  },
];

export default function WhyChooseUs() {
  return (
    <div
      className="overflow-hidden bg-[#FAFAFA] px-4 py-20 dark:bg-neutral-900 md:px-6 md:py-24"
      aria-labelledby="why-us-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-3xl md:mb-16">
          <div className="mb-6 inline-flex -rotate-1 items-center border-2 border-black bg-white px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-widest text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-neutral-900 dark:text-white dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
            Why IIDev
          </div>
          <h2
            id="why-us-heading"
            className="mb-6 text-4xl font-bold tracking-tight text-slate-900 dark:text-white md:text-5xl lg:text-6xl"
          >
            Less agency. More ownership.
          </h2>
          <p className="max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-neutral-400 md:text-xl">
            You work directly with the people building your site—with clear
            scope, search-first thinking, and support that continues after
            launch.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-6">
          {reasons.map((reason) => {
            const Icon = reason.icon;

            return (
              <li
                key={reason.number}
                className={`${reason.span} flex flex-col border-2 p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] md:p-8 lg:p-10 ${
                  reason.featured
                    ? "border-black bg-emerald-300 text-black dark:border-white dark:bg-emerald-400 dark:shadow-[5px_5px_0px_0px_rgba(255,255,255,1)]"
                    : "border-black bg-white text-slate-900 dark:border-white dark:bg-neutral-800 dark:text-white dark:shadow-[5px_5px_0px_0px_rgba(255,255,255,1)]"
                }`}
              >
                <div className="mb-12 flex items-start justify-between gap-6 md:mb-16">
                  <span className="font-mono text-xs font-bold uppercase tracking-[0.18em]">
                    {reason.number} / {reason.label}
                  </span>
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-black bg-white text-black dark:border-white"
                    aria-hidden="true"
                  >
                    <Icon size={22} strokeWidth={2} />
                  </span>
                </div>

                <div className="mt-auto">
                  <h3 className="mb-3 text-2xl font-bold leading-tight md:text-3xl">
                    {reason.title}
                  </h3>
                  <p
                    className={`max-w-xl text-base leading-relaxed md:text-lg ${
                      reason.featured
                        ? "text-black/75"
                        : "text-slate-600 dark:text-neutral-300"
                    }`}
                  >
                    {reason.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
