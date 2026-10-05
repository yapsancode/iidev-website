import type { CSSProperties } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { projects, type Project } from "@/lib/data";
import { BADGE } from "@/lib/styles";
import { cn } from "@/lib/utils";

/** "https://www.example.com/" becomes "example.com". */
function getAddress(link: string) {
  return new URL(link).hostname.replace(/^www\./, "");
}

/**
 * The top of a browser window, showing where the project lives. The address
 * types itself the first time the card scrolls into view (`type-in`, see
 * globals.css). Decorative: the card itself is the link.
 */
function BrowserBar({ address }: { address: string }) {
  return (
    <div
      aria-hidden="true"
      className="flex items-center gap-1.5 border-b-2 border-black bg-white px-3 py-2 text-black dark:border-white dark:bg-neutral-800 dark:text-white"
    >
      <span className="h-2.5 w-2.5 shrink-0 border-2 border-current" />
      <span className="h-2.5 w-2.5 shrink-0 border-2 border-current" />
      <span className="h-2.5 w-2.5 shrink-0 border-2 border-current" />
      <span className="ml-1.5 flex h-7 min-w-0 flex-1 items-center border-2 border-current px-2 text-xs font-medium">
        <span
          className="type-in"
          style={{ "--chars": address.length } as CSSProperties}
        >
          {address}
        </span>
      </span>
    </div>
  );
}

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
}

function ProjectCard({ project, featured = false }: ProjectCardProps) {
  const cardClassName = `lift-in grid overflow-hidden border-2 border-black bg-white shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-emerald-500 dark:border-white dark:bg-neutral-800 dark:shadow-[5px_5px_0px_0px_rgba(255,255,255,1)] ${
    featured ? "md:col-span-12 md:grid-cols-12" : "md:col-span-6"
  }`;

  const content = (
    <>
      <div
        className={`flex flex-col border-b-2 border-black dark:border-white ${
          featured ? "md:col-span-7 md:border-r-2 md:border-b-0" : ""
        }`}
      >
        {project.link && <BrowserBar address={getAddress(project.link)} />}
        <div
          className={`relative aspect-[4/3] overflow-hidden bg-neutral-100 dark:bg-neutral-900 ${
            featured ? "md:aspect-auto md:min-h-[420px] md:grow" : ""
          }`}
        >
          <Image
            src={project.image}
            alt={`${project.title} — ${project.category} built by IIDev Studio`}
            fill
            sizes={featured ? "(max-width: 768px) 100vw, 60vw" : "(max-width: 768px) 100vw, 50vw"}
            className="object-cover"
          />
        </div>
      </div>

      <div
        className={`flex flex-col p-6 md:p-8 ${featured ? "md:col-span-5 md:p-10" : ""}`}
      >
        <span className="mb-8 font-mono text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
          {project.category}
        </span>
        <h3
          className={`mb-4 font-bold leading-tight text-slate-900 dark:text-white ${
            featured ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl"
          }`}
        >
          {project.title}
        </h3>
        {project.link && (
          <span className="mt-auto inline-flex items-center gap-2 pt-10 font-mono text-xs font-bold uppercase tracking-[0.16em] text-slate-700 dark:text-neutral-200">
            View live project
            <ExternalLink size={16} aria-hidden="true" />
          </span>
        )}
      </div>
    </>
  );

  if (!project.link) {
    return <article className={cardClassName}>{content}</article>;
  }

  return (
    <a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className={cardClassName}
      aria-label={`View ${project.title} live project (opens in a new tab)`}
    >
      {content}
    </a>
  );
}

export default function Portfolio() {
  return (
    <div
      id="work"
      className="bg-[#FAFAFA] px-4 py-20 dark:bg-neutral-900 md:px-6 md:py-24"
      aria-labelledby="portfolio-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl md:mb-16">
          <div className={cn(BADGE, "mb-6")}>
            Selected work
          </div>
          <h2
            id="portfolio-heading"
            className="mb-6 text-4xl font-bold tracking-tight text-slate-900 dark:text-white md:text-5xl lg:text-6xl"
          >
            Recent projects
          </h2>
          <p className="max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-neutral-400 md:text-xl">
            Websites and digital products built for Malaysian businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.title}
              project={project}
              featured={index === 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
