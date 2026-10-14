// Senja Dental — small, separate pieces. Each one runs in its own try/catch so a failure in one
// never stops the others, and the page reads and books fine with none of them.

const strings = (() => {
  try { return JSON.parse(document.getElementById('i18n').textContent); } catch { return {}; }
})();

const piece = (name, run) => {
  try { run(); } catch (error) { console.error(`[senja] ${name} failed`, error); }
};

// Reveal once when an element enters the viewport. Never leaves content hidden.
piece('reveal', () => {
  const targets = document.querySelectorAll('[data-reveal]');
  const show = (el) => el.classList.add('is-in');
  if (!('IntersectionObserver' in window)) { targets.forEach(show); return; }
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      show(entry.target);
      io.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  targets.forEach((el) => io.observe(el));
  window.addEventListener('load', () => setTimeout(() => {
    targets.forEach((el) => { const r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) show(el); });
  }, 2500));
});

// Open now? The clinic is open Monday to Saturday, 2pm to 10pm, Kuala Lumpur time.
piece('status', () => {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kuala_Lumpur', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
  const get = (type) => parts.find((p) => p.type === type).value;
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  const minutes = (Number(get('hour')) % 24) * 60 + Number(get('minute'));
  const OPEN = 14 * 60, CLOSE = 22 * 60;
  const working = day >= 1 && day <= 6;

  let text;
  if (working && minutes >= OPEN && minutes < CLOSE) text = strings.openUntil;
  else if (working && minutes < OPEN) text = strings.opensToday;
  else if (day === 6) text = strings.opensMonday;
  else text = strings.opensTomorrow;
  if (text) document.querySelectorAll('[data-status]').forEach((el) => { el.textContent = text; });

  const today = document.querySelector(`.day[data-day="${day}"]`);
  if (today) {
    today.classList.add('is-today');
    today.setAttribute('aria-current', 'date');
    const label = today.querySelector('[data-today]');
    if (label && strings.today) label.textContent = strings.today;
  }
});

// Prices: on a wide screen with a mouse, pointing at a row shows it in the frame on the left.
// On touch screens each row simply opens in place, which needs no script.
piece('prices', () => {
  const section = document.querySelector('.prices');
  const rows = [...section.querySelectorAll('.row')];
  const frames = section.querySelectorAll('[data-frame]');
  const name = section.querySelector('[data-frame-name]');
  const text = section.querySelector('[data-frame-text]');
  const price = section.querySelector('[data-frame-price]');
  const book = section.querySelector('[data-frame-book]');
  const wide = window.matchMedia('(min-width: 64em) and (hover: hover) and (pointer: fine)');
  let timer;

  const fill = (row) => {
    name.textContent = row.querySelector('[data-name]').textContent;
    text.textContent = row.querySelector('[data-text]').textContent;
    price.textContent = row.dataset.price;
    book.dataset.pick = row.dataset.key;
  };
  const select = (row) => {
    if (row.classList.contains('is-current')) return;
    rows.forEach((r) => r.classList.toggle('is-current', r === row));
    clearTimeout(timer);
    frames.forEach((f) => f.classList.add('is-out'));
    timer = setTimeout(() => { fill(row); frames.forEach((f) => f.classList.remove('is-out')); }, 180);
  };
  const apply = () => {
    section.classList.toggle('is-index', wide.matches);
    if (wide.matches) return;
    // back to plain accordions: the frame shows the first row again
    rows.forEach((r, i) => r.classList.toggle('is-current', i === 0));
    fill(rows[0]);
  };

  rows.forEach((row) => {
    const summary = row.querySelector('summary');
    summary.addEventListener('pointerenter', () => { if (wide.matches) select(row); });
    summary.addEventListener('focus', () => { if (wide.matches) select(row); });
    summary.addEventListener('click', (event) => { if (wide.matches) { event.preventDefault(); select(row); } });
  });
  wide.addEventListener('change', apply);
  apply();
});

// Booking: the page writes the WhatsApp message from the choices on the appointment card.
piece('booking', () => {
  const form = document.querySelector('[data-book]');
  const treatment = form.querySelector('[data-treatment]');
  const day = form.querySelector('[data-daypick]');
  const time = form.querySelector('[data-time]');
  const nameIn = form.querySelector('[data-name-in]');
  const preview = form.querySelector('[data-preview]');
  const out = form.querySelector('[data-text-out]');
  const said = (select) => { const o = select.selectedOptions[0]; return o.dataset.say || o.textContent.trim(); };

  const write = () => {
    let message = strings.message.replace('{t}', said(treatment)).replace('{d}', said(day)).replace('{h}', said(time));
    const who = nameIn.value.trim().slice(0, 60);
    if (who) message += strings.messageName.replace('{n}', who);
    preview.textContent = message;
    out.value = message;
  };
  form.addEventListener('input', write);
  form.addEventListener('change', write);

  // "Book this" on a price sets the treatment on the card before the page jumps to it.
  document.addEventListener('click', (event) => {
    const link = event.target.closest('[data-pick]');
    if (!link) return;
    const option = [...treatment.options].find((o) => o.value === link.dataset.pick);
    if (option) { treatment.value = option.value; write(); }
  });
  write();
});
