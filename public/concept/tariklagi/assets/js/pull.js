// Tarik Lagi: poses the pull drawing. setPull(svg, t) goes from t = 0 (a short pour, no foam yet)
// to t = 1 (a long, high pour and thick foam). The markup in the page is already the t = 1 pose, so the
// drawing is complete without JavaScript. The motion layer will call setPull while the visitor scrolls.
const X = 180;           // where the stream falls, in drawing units
const LIP = [560, 200];  // height of the steel mug's lip
const WIDTH = [22, 14];  // the stream thins as it falls further
const FOAM = [766, 698]; // top of the foam; the glass rim is at 712
const DRINK = 770;       // top of the tea in the glass

const mix = ([a, b], t) => a + (b - a) * t;
const set = (el, attrs) => {
  for (const name in attrs) el.setAttribute(name, Math.round(attrs[name] * 100) / 100);
};

export function setPull(svg, t) {
  const lip = mix(LIP, t);
  const width = mix(WIDTH, t);
  const foam = mix(FOAM, t);
  svg.querySelector(".mug").setAttribute("transform", `translate(${X} ${lip}) rotate(100)`);
  set(svg.querySelector(".stream"), { x: X - width / 2, y: lip - 2, width, height: foam - lip + 8, rx: width / 2 });
  set(svg.querySelector(".stream-lit"), { x: X - width * 0.32, y: lip + 8, width: width * 0.26, height: Math.max(0, foam - lip - 16), rx: width * 0.13 });
  set(svg.querySelector(".foam"), { y: foam, height: DRINK + 16 - foam });
  set(svg.querySelector(".foam-shade"), { y: foam + 14, height: Math.max(0, DRINK - foam - 14) });
  // Bubbles and splashes belong to a long pour, so they appear in the second half.
  const late = Math.max(0, (t - 0.4) / 0.6);
  for (const group of svg.querySelectorAll(".bubbles, .splash")) {
    group.setAttribute("transform", `translate(0 ${Math.round((foam - FOAM[1]) * 100) / 100})`);
    group.style.opacity = late;
  }
}
