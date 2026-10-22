// Tarik Lagi: the motion layer. The page is whole without it: with JavaScript off or "reduce motion" on,
// the pull keeps its finished pose (t = 1) and nothing moves.
//   The pull (the signature): scrolling pulls the tea. From 760px the hero holds still (sticky, in site.css)
//   while the mug climbs. On a phone nothing holds: the mug keeps level with the page and the glass falls away.
//   Entrances: the parts of each section arrive once, in reading order, the first time they come into view.
//   The order glass: its foam rises as the section scrolls in.
// The hero's own entrance and the feedback on links and buttons are CSS, in site.css.
// GSAP, ScrollTrigger and Lenis are self-hosted in vendor/ and run after this file (see index.html), so the
// first pose is set before the first paint and the rest waits for them.
import { setPull, RISE } from "./pull.js";

const root = document.documentElement;
const pull = document.querySelector(".hero .pull");
const NARROW = "not all and (min-width: 760px)"; // below site.css's tablet breakpoint
const CALM = "(prefers-reduced-motion: reduce)";
const narrow = matchMedia(NARROW);
let gsap, ScrollTrigger;

// Lets iOS Safari show the pressed state (:active) of links and buttons on a tap.
addEventListener("touchstart", () => {}, { passive: true });

// Poses the hero at t, and lifts the drawing by part of the mug's climb still to come. On a phone the drawing
// hangs under the text, so it is lifted by all of it: at t = 0 the low mug sits where the high mug sits at
// t = 1, just under the button, and as t grows the glass falls away below it. Beside the text it is lifted by
// half: the short pour starts in the middle of the column, and the mug rises as the glass sinks, like the
// arms of a tea maker spreading.
let posed = 1;
function pose(t) {
  posed = t;
  setPull(pull, t);
  const lift = (narrow.matches ? 1 : 0.5) * (RISE / pull.viewBox.baseVal.height) * 100 * (1 - t);
  pull.style.transform = lift ? `translateY(-${lift.toFixed(3)}%)` : "";
}
// A phone turned on its side crosses the breakpoint: lift or drop the drawing at once, before ScrollTrigger
// measures the new width.
narrow.addEventListener("change", () => root.classList.contains("pull-on") && pose(posed));

// Back to the plain page: the finished drawing, and no hero held still.
function finish() {
  root.classList.remove("pull-on");
  setPull(pull, 1);
  pull.style.transform = "";
}

if (!matchMedia(CALM).matches) {
  root.classList.add("pull-on");
  pose(0);
}

addEventListener("DOMContentLoaded", () => {
  ({ gsap, ScrollTrigger } = window);
  if (!gsap || !ScrollTrigger) return finish(); // a library did not load
  gsap.registerPlugin(ScrollTrigger);
  // All the motion lives in one GSAP media context: if "reduce motion" is switched on during a visit, GSAP
  // undoes all of it and the page is the still page again. The width has no context of its own; the pull reads
  // it when it measures (pose, pullOnScroll). Undoing a context makes ScrollTrigger measure from the top of
  // the page, and turning a phone on its side would leave the reader there.
  let first = true;
  gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
    if (!first) keepPlace();
    first = false;
    root.classList.add("pull-on");
    // Lenis smooths the mouse wheel, so the pull follows a wheel as smoothly as a finger. Touch stays native.
    const lenis = window.Lenis ? new window.Lenis() : null;
    const tick = (time) => lenis.raf(time * 1000);
    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }
    pullOnScroll();
    entrances();
    return () => {
      keepPlace();
      if (lenis) {
        gsap.ticker.remove(tick);
        gsap.ticker.lagSmoothing(500, 33);
        lenis.destroy();
      }
      finish();
    };
  });
  // The fonts change the height of the words above the phone drawing, so measure again once they are in.
  document.fonts.ready.then(() => ScrollTrigger.refresh());
});

// When the still page and the moving page swap during a visit, the hold above the reader comes or goes. Keeps
// the first words in view where they were, two frames later, after ScrollTrigger has put back its own record.
function keepPlace() {
  const mark = [...document.querySelectorAll("h1, h2, h3, p")].find((el) => el.getBoundingClientRect().top >= 0);
  if (!mark) return;
  const top = mark.getBoundingClientRect().top;
  const back = () => scrollTo(0, scrollY + mark.getBoundingClientRect().top - top);
  requestAnimationFrame(() => requestAnimationFrame(back));
}

// The pull runs from the top of the page. From 760px it ends a tenth of the hold before the hero lets go (the
// hero is sticky inside .hero-run); on a phone it ends when the drawing is centred on the screen.
function pullOnScroll() {
  const run = document.querySelector(".hero-run");
  const hero = run.firstElementChild;
  const end = () => {
    const hold = run.offsetHeight - hero.offsetHeight;
    const letGo = run.offsetTop + hold - (parseFloat(getComputedStyle(hero).top) || 0);
    if (!narrow.matches) return letGo - hold * 0.1;
    const lift = pull.style.transform;
    pull.style.transform = ""; // measure where the drawing sits in the page, not where it is lifted to
    const box = pull.getBoundingClientRect();
    pull.style.transform = lift;
    return Math.max(innerHeight * 0.35, box.top + scrollY + (box.height - innerHeight) / 2);
  };
  const pulling = ScrollTrigger.create({
    start: 0,
    end,
    onUpdate: (self) => pose(self.progress),
    onRefresh: (self) => pose(self.progress),
  });
  pose(pulling.progress);
}

// Each part starts hidden only here, so nothing stays hidden if this script never runs. It arrives once,
// rising into place, from the moment its top edge comes onto the screen (so nothing on screen sits blank);
// parts that come into view together go in reading order.
const ARRIVE = { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.7, ease: "power4.out", clearProps: "all" };
const ON_SCREEN = "clamp(top bottom)";

function arrive(targets, from, stagger = 0.07) {
  const parts = gsap.utils.toArray(targets);
  gsap.set(parts, from);
  ScrollTrigger.batch(parts, {
    start: ON_SCREEN,
    once: true,
    onEnter: (batch) => gsap.to(batch, { ...ARRIVE, stagger }),
  });
}

function entrances() {
  // The pull, written: each stage steps down into its place on the staircase.
  arrive(".steps-band .step", { opacity: 0, x: -24, y: 24 }, 0.08);

  // The menu: the heading, the note, then each drink as its row comes in, the cup set down first.
  arrive(".drinks-head, .drinks-note", { opacity: 0, y: 24 });
  const items = gsap.utils.toArray(".menu .item");
  gsap.set(items.map((item) => item.querySelector(".cup")), { opacity: 0, y: 10, scale: 0.88, transformOrigin: "50% 100%" });
  gsap.set(items.map((item) => item.lastElementChild), { opacity: 0, y: 20 });
  ScrollTrigger.batch(items, {
    start: ON_SCREEN,
    once: true,
    onEnter: (batch) => batch.forEach((item, i) => {
      gsap.to(item.querySelector(".cup"), { ...ARRIVE, delay: i * 0.06 });
      gsap.to(item.lastElementChild, { ...ARRIVE, delay: i * 0.06 + 0.06 });
    }),
  });

  // The order: the words in reading order; with the scroll, the glass rises from behind the counter (8% of
  // its height, under the counter's edge) and its foam rises over the rim. Only the foam's crown moves (the
  // shaded side stays), so no part of the foam shows inside the glass where it should not.
  arrive(".order-text > *", { opacity: 0, y: 24 });
  const glass = document.querySelector(".order .pull");
  gsap.timeline({ scrollTrigger: { trigger: ".order-object", start: "top bottom", end: "top 40%", scrub: true } })
    .fromTo(glass, { yPercent: 8 }, { yPercent: 0, ease: "none", duration: 1 }, 0)
    .fromTo(glass.querySelectorAll(".foam, .bubbles"), { y: 14 }, { y: 0, ease: "none", duration: 1 }, 0)
    .fromTo(glass.querySelector(".bubbles"), { opacity: 0 }, { opacity: 1, ease: "none", duration: 0.5 }, 0.5);

  // The footer: the signboard goes up letter by letter, then the links and the notes.
  gsap.fromTo(".mark-built .word > span", { yPercent: 105 }, {
    yPercent: 0,
    duration: 0.7,
    ease: "power4.out",
    stagger: 0.05,
    clearProps: "all",
    scrollTrigger: { trigger: ".mark-built", start: ON_SCREEN, once: true },
  });
  arrive(".foot-text > *", { opacity: 0, y: 20 });
}
