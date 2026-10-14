import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookingButton } from "@/components/modal/BookingButton";
import { SiteBar, SiteFooter, SkipLink, order } from "@/components/site/chrome";
import { BRAND_NAME, WHATSAPP_DISPLAY, WHATSAPP_URL } from "@/lib/site-config";
import { BlankSentence } from "./BlankSentence";
import { ProcessStack } from "./ProcessStack";
import { SEARCH_FORM_ID, SearchSlot } from "./SearchSlot";
import { StageVideo } from "./StageVideo";

/* --------------------------------------------------------------------- Hero */

export function HomeHero() {
  return (
    <header className="hero">
      <SkipLink />
      <SiteBar />

      <div className="wrap hero-body">
        {/* The search box belongs to this form through its `form` attribute,
            so the heading holds only text and the box itself. */}
        <form
          id={SEARCH_FORM_ID}
          action="https://www.google.com/search"
          method="get"
          target="_blank"
          rel="noopener noreferrer"
        />
        <h1 className="display hero-sentence lines">
          <span className="line">
            <span data-line style={order(0)}>
              They search <SearchSlot />
            </span>
          </span>
          <span className="line">
            <span data-line style={order(1)}>
              They find you.
            </span>
          </span>
        </h1>

        <div className="hero-foot">
          <p data-rise style={order(0)}>
            {BRAND_NAME} builds websites for Malaysian service businesses,
            made to be found on Google and to turn a search into a call, a
            booking or a WhatsApp message.
          </p>
          <p className="hero-hint" data-rise style={order(1)}>
            Try it. Type what your customers would search and press Enter.
            Google opens in a new tab, so you can see who they find today.
          </p>
        </div>
      </div>
    </header>
  );
}

/* --------------------------------------------------------------------- Work */

interface Shot {
  kind: "desk" | "phone";
  src: string;
  size: [number, number];
  alt: string;
  sizes: string;
  /** A silent recording of the same page scrolling, played over the picture. */
  video?: string;
}

interface ProjectLink {
  href: string;
  label: string;
  lang?: string;
}

interface Project {
  /** How much room the project gets: one lead, a wide and a tall beside it, then a quiet row. */
  layout: "lead" | "wide" | "tall" | "row";
  title: string;
  /** What kind of work it is, said first and in plain words. */
  kind?: string;
  text: string;
  /** The first link is also where the picture goes. */
  links: [ProjectLink, ...ProjectLink[]];
  shots: Shot[];
}

const PROJECTS: Project[] = [
  {
    layout: "lead",
    title: "Klinik Mekar 24 Jam",
    kind: "Client website.",
    text: "A 24-hour clinic in Serdang. We built seven pages, video testimonials, and a booking button that opens WhatsApp with the patient's first message already written. Live since October 2025.",
    links: [{ href: "https://klinikmekar.com", label: "Visit klinikmekar.com" }],
    shots: [
      {
        kind: "desk",
        src: "/images/work/klinik-mekar-desktop.png",
        size: [1180, 1000],
        alt: "Home page of the Klinik Mekar website, with buttons to book an appointment, find doctors and call for an emergency",
        sizes: "(max-width: 899px) 62vw, 60vw",
        video: "/videos/work/klinik-mekar-desktop.mp4",
      },
      {
        kind: "phone",
        src: "/images/work/klinik-mekar-phone.png",
        size: [500, 1000],
        alt: "The Klinik Mekar website on a phone",
        sizes: "(max-width: 899px) 26vw, 17vw",
        video: "/videos/work/klinik-mekar-phone.mp4",
      },
    ],
  },
  {
    layout: "wide",
    title: "KerjaKit",
    kind: "Our own product.",
    text: "It helps job seekers decide where to apply and prepare a truthful resume. More than 40 people have registered, and its open-source tool has more than 31 stars on GitHub.",
    links: [{ href: "https://kerjakit.com", label: "Visit kerjakit.com" }],
    shots: [
      {
        kind: "desk",
        src: "/images/work/kerjakit-desktop.png",
        size: [1180, 1000],
        alt: "Home page of KerjaKit: See which jobs deserve your attention",
        sizes: "(max-width: 899px) 86vw, 48vw",
        video: "/videos/work/kerjakit-desktop.mp4",
      },
    ],
  },
  {
    layout: "tall",
    title: "Senja Dental",
    kind: "Concept project.",
    text: "Senja Dental is not a real clinic and not a client. We designed it to show how a dental website can put opening hours, prices and WhatsApp booking first.",
    links: [
      { href: "/concept/senjadental", label: "See the concept" },
      { href: "/concept/senjadental/ms", label: "Bahasa Melayu", lang: "ms" },
    ],
    shots: [
      {
        kind: "phone",
        src: "/images/work/senja-dental-phone.png",
        size: [500, 1000],
        alt: "The Senja Dental concept on a phone: Open till 10pm, with a note that it is a concept project and not a real clinic",
        sizes: "(max-width: 899px) 46vw, 22vw",
        video: "/videos/work/senja-dental-phone.mp4",
      },
    ],
  },
  {
    layout: "row",
    title: "Locum Connect",
    kind: "Our own project.",
    text: "A platform where Malaysian doctors find locum shifts, gathered into one list they can filter and search.",
    links: [{ href: "https://locum-connect.com/", label: "Visit locum-connect.com" }],
    shots: [
      {
        kind: "desk",
        src: "/images/locum-connect.png",
        size: [1908, 875],
        alt: "Home page of Locum Connect, the locum platform for Malaysian doctors",
        sizes: "(max-width: 899px) 100vw, 25vw",
      },
    ],
  },
];

/** Our own pages open in the same tab. Other sites open in a new one. */
const linkProps = (href: string) =>
  href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {};

export function HomeWork() {
  return (
    <section id="work" aria-label="Work" className="wrap work">
      {PROJECTS.map((project, index) => {
        const [main] = project.links;
        const outside = main.href.startsWith("http");
        return (
          <article key={project.title} className={`project project-${project.layout}`}>
            <Link
              href={main.href}
              {...linkProps(main.href)}
              className="project-visual"
              aria-label={
                outside ? `${main.label} (opens in a new tab)` : `${main.label}: ${project.title}`
              }
              data-reveal
            >
              {project.shots.map((shot) => (
                <span key={shot.src} className={`shot shot-${shot.kind}`}>
                  <Image
                    src={shot.src}
                    width={shot.size[0]}
                    height={shot.size[1]}
                    sizes={shot.sizes}
                    alt={shot.alt}
                    priority={index === 0}
                  />
                  {shot.video && <StageVideo src={shot.video} />}
                </span>
              ))}
            </Link>

            <div className="project-text">
              <h2 className="display project-title" data-reveal style={order(1)}>
                {project.title}
              </h2>
              <div className="project-body" data-reveal style={order(2)}>
                <p>
                  {project.kind && <strong>{project.kind} </strong>}
                  {project.text}
                </p>
                <p className="project-links">
                  {project.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      {...linkProps(link.href)}
                      hrefLang={link.lang}
                      className="link"
                    >
                      {link.label}
                    </Link>
                  ))}
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}

/* ----------------------------------------------------------------- Founders */

export function HomeFounders() {
  return (
    <section id="founders" aria-label="Founders" className="wrap cols founders">
      <dl className="founders-facts" data-reveal>
        <div>
          <dt>Where</dt>
          <dd>Malaysia</dd>
        </div>
        <div>
          <dt>Registered</dt>
          <dd>SSM 202603215168</dd>
        </div>
        <div>
          <dt>WhatsApp</dt>
          <dd>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="link">
              {WHATSAPP_DISPLAY}
            </a>
          </dd>
        </div>
      </dl>

      <div className="founders-text" data-reveal style={order(1)}>
        <p>
          <span className="founders-portrait">
            <Image
              src="/images/isyraf-afifi.jpg"
              width={400}
              height={533}
              sizes="180px"
              alt="Isyraf Afifi, co-founder of IIDev Studio"
            />
          </span>
          Isyraf Afifi and Imran Ariff are {BRAND_NAME}. Isyraf looks after
          the product and is the person you talk to. Imran leads the build.
          There is no sales team and nothing is outsourced, so the people who
          hear what your business needs are the people who make your website.
        </p>
        <p>
          We work with clinics, restaurants, salons, workshops, tuition
          centres and firms across Malaysia. You see the scope and the price
          before work starts, and when it is done you own the domain, the
          hosting and the code.{" "}
          <Link href="/about" className="link">
            More about us
          </Link>
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------- Price */

export function HomePrice() {
  return (
    <section id="prices" className="wrap price on-accent">
      <h2 className="display price-sentence">
        <span data-reveal>A proper website</span>
        <span data-reveal style={order(1)}>
          from <span className="price-figure">RM&nbsp;1,000</span>
        </span>
      </h2>
      <div className="price-foot">
        <p data-reveal style={order(2)}>
          One price, paid once, and the site is yours. A site built to be
          found on Google is RM&nbsp;3,000 to RM&nbsp;6,000. You get a fixed
          price before any work starts.
        </p>
        <Link href="/services" className="btn" data-reveal style={order(3)}>
          See all prices
        </Link>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Process */

const STEPS = [
  {
    line: "First we listen.",
    text: "We learn how your business works, who you need to reach, and what the site must do.",
  },
  {
    line: "Then we agree a price.",
    text: "Pages, scope, price and timeline are settled before the build begins.",
  },
  {
    line: "We build in rounds.",
    text: "Design and development move in short rounds, with clear points for your feedback.",
  },
  {
    line: "Then we stay.",
    text: "We handle the launch and remain reachable for updates and whatever comes next.",
  },
] as const;

export function HomeProcess() {
  return (
    <section id="process" className="wrap">
      <h2 className="sr-only">How we work</h2>
      <ol className="process">
        {STEPS.map((step, index) => (
          <li key={step.line} style={{ "--n": index } as CSSProperties}>
            <h3 className="display" data-reveal>
              {step.line}
            </h3>
            <p data-reveal style={order(1)}>
              {step.text}
            </p>
          </li>
        ))}
      </ol>
      <ProcessStack />
    </section>
  );
}

/* ---------------------------------------------------------------- Questions */

/**
 * One source of truth: the visible list and the FAQPage JSON-LD are both made
 * from this array, so the structured data can never drift from the page.
 */
const FAQS = [
  {
    q: "How much does a website cost in Malaysia?",
    a: "Most one-time builds fall between RM 1,000 and RM 6,000, depending on the number of pages and how much search work is needed. Ongoing search work is RM 1,000 to RM 2,000 a month. After a short call we confirm a fixed scope and price before work starts. No hourly billing and no surprise fees.",
  },
  {
    q: "How long does it take to build a website?",
    a: "It depends on the number of pages and how quickly content and feedback come back. We set the timeline together before any work starts, so you are never left guessing.",
  },
  {
    q: "Do I own my website, or is it locked to a platform?",
    a: "You own everything: the domain, the hosting and the code. We do not build on drag-and-drop platforms that lock you in with monthly fees. If you ever decide to work with someone else, you can take the whole site with you.",
  },
  {
    q: "Will my website show up on Google?",
    a: "We build every site to be found: pages planned around what your customers type, fast loading, a layout made for phones, and your Google Business Profile set up properly. We cannot promise a number-one ranking, and you should be careful with anyone who does. We give your site the strongest base we can.",
  },
  {
    q: "I already have a website but it brings no customers. Can you help?",
    a: "Yes. Usually the site looks fine but was never built to be found, or to turn a visitor into an enquiry. We look at what you have and rebuild the parts that matter, instead of starting from zero when we do not need to.",
  },
  {
    q: "How do I get started?",
    a: `Book a free 15-minute call, or message us on WhatsApp at ${WHATSAPP_DISPLAY}. We ask a few practical questions about your business and your current site, then recommend the clearest next step.`,
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export function HomeFaq() {
  return (
    <section id="faq" className="wrap faq">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <h2 className="display faq-heading" data-reveal>
        Questions owners ask us
      </h2>
      {/* Native <details>: every answer is in the HTML and needs no script. */}
      <div className="cols">
        <div className="faq-list">
          {FAQS.map((item, index) => (
            <details key={item.q} name="faq" className="faq-item" data-reveal style={order(index)}>
              <summary>
                {item.q}
                <span className="faq-chevron" aria-hidden="true" />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------- The sentence with a blank */

export function HomeContact() {
  return (
    <section id="contact" aria-label="Message us on WhatsApp" className="wrap blank">
      <BlankSentence />
    </section>
  );
}

/* ------------------------------------------------------------------- Footer */

export function HomeFooter() {
  return (
    <SiteFooter>
      <h2 className="display" data-reveal>
        Or book a free call
      </h2>
      <p data-reveal style={order(1)}>
        Fifteen minutes. We talk through what is not working, what you
        need next, and whether we are the right fit.
      </p>
      <BookingButton className="btn">Book a free call</BookingButton>
    </SiteFooter>
  );
}
