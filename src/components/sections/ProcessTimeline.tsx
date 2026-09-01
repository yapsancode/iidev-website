import { Code2, FileText, Phone, Rocket, type LucideIcon } from "lucide-react";

interface ProcessStep {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const steps: ProcessStep[] = [
  {
    number: "01",
    title: "Understand",
    description:
      "We learn how your business works, who you need to reach, and what the site must achieve.",
    icon: Phone,
  },
  {
    number: "02",
    title: "Plan",
    description:
      "We agree on the structure, scope, price, and timeline before the build begins.",
    icon: FileText,
  },
  {
    number: "03",
    title: "Build together",
    description:
      "We design and develop in focused rounds, with clear points for your feedback.",
    icon: Code2,
  },
  {
    number: "04",
    title: "Launch and improve",
    description:
      "We handle the launch, then stay available for updates and the next stage of growth.",
    icon: Rocket,
  },
];

export default function ProcessTimeline() {
  return (
    <div
      className="overflow-hidden bg-[#FAFAFA] px-4 py-16 dark:bg-neutral-900 md:px-6 md:py-24"
      aria-labelledby="process-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-3xl md:mb-16">
          <div className="mb-4 inline-flex -rotate-1 items-center border-2 border-black bg-white px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-widest text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-neutral-900 dark:text-white dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] md:mb-6">
            Our process
          </div>
          <h2
            id="process-heading"
            className="mb-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-white md:mb-6 md:text-5xl lg:text-6xl"
          >
            Four clear steps. No black box.
          </h2>
          <p className="max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-neutral-400 md:text-xl">
            You always know what we&apos;re working on, what we need from you,
            and what happens next.
          </p>
        </div>

        <ol className="grid border-2 border-black bg-white shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-neutral-800 dark:shadow-[5px_5px_0px_0px_rgba(255,255,255,1)] md:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <li
                key={step.number}
                className="border-b-2 border-black p-5 last:border-b-0 dark:border-white md:border-r-2 md:border-b-0 md:p-8 md:last:border-r-0"
              >
                <div className="mb-6 flex items-start justify-between gap-4 md:mb-8">
                  <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-neutral-400">
                    Step {step.number}
                  </span>
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-black bg-emerald-300 text-black dark:border-white dark:bg-emerald-400 md:h-11 md:w-11"
                    aria-hidden="true"
                  >
                    <Icon size={20} strokeWidth={2} />
                  </span>
                </div>
                <h3 className="mb-3 text-2xl font-bold leading-tight text-slate-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="leading-relaxed text-slate-600 dark:text-neutral-300">
                  {step.description}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
