// Data and rules for the small sample system on the Business OS page (see
// BusinessOsDemo). Everything here is made up. Names are first names only and
// there are no phone numbers, so nothing can point at a real person or company.
//
// Only show what the price list on that page offers: customers, invoices and
// quotations, stock, bookings, and a dashboard. No e-invoicing — that module is
// not available yet.

export type BusinessId = "shop" | "service" | "supplier";
export type TabId = "today" | "customers" | "bills" | "stock" | "bookings";
export type BillStatus = "quote" | "unpaid" | "overdue" | "paid";

/** A sale, an invoice, or a quotation that has not become an invoice yet. */
export interface Bill {
  id: string;
  customer: string;
  detail: string;
  amount: number;
  status: BillStatus;
  /** For quotations: what leaves the stock once it becomes an invoice. */
  stockId?: string;
  quantity?: number;
}

export interface StockItem {
  id: string;
  name: string;
  quantity: number;
  /** At this many or fewer, the item counts as running low. */
  lowAt: number;
  /** Set when the item can be sold one at a time over the counter. */
  price?: number;
}

export interface Booking {
  id: string;
  time: string;
  customer: string;
  job: string;
  amount: number;
  done: boolean;
}

export interface DemoState {
  business: BusinessId;
  collected: number;
  nextBillNo: number;
  bills: Bill[];
  stock: StockItem[];
  bookings: Booking[];
  /** One line about what the last tap changed. */
  message: string | null;
}

export interface DemoPreset {
  label: string;
  title: string;
  tabs: { id: TabId; label: string }[];
  billsHeading: string;
  billPrefix: string;
  stockUnit: string;
  hint: string;
  customers: { name: string; note: string }[];
  start: Omit<DemoState, "business" | "message">;
}

export type DemoAction =
  | { type: "reset"; business: BusinessId }
  | { type: "pay"; billId: string }
  | { type: "invoice"; billId: string }
  | { type: "sell"; stockId: string }
  | { type: "restock"; stockId: string }
  | { type: "finish"; bookingId: string };

export interface DemoAlert {
  tab: TabId;
  tone: "red" | "amber" | "blue";
  text: string;
}

export const BUSINESS_IDS: BusinessId[] = ["shop", "service", "supplier"];

const RESTOCK_BY = 20;

export const DEMO_PRESETS: Record<BusinessId, DemoPreset> = {
  shop: {
    label: "Shop",
    title: "Your shop",
    tabs: [
      { id: "today", label: "Today" },
      { id: "customers", label: "Customers" },
      { id: "bills", label: "Sales" },
      { id: "stock", label: "Stock" },
    ],
    billsHeading: "Sales",
    billPrefix: "S-",
    stockUnit: "left",
    hint: "Open Stock and sell one cat food. Then go back to Today.",
    customers: [
      { name: "Farid", note: "Regular · 14 visits" },
      { name: "Aina", note: "Regular · 9 visits" },
      { name: "Mr Tan", note: "New this month" },
      { name: "Kumar", note: "Regular · 6 visits" },
    ],
    start: {
      collected: 1240,
      nextBillNo: 313,
      bills: [
        { id: "S-0312", customer: "Farid", detail: "Cat food × 2, cat litter", amount: 89, status: "unpaid" },
        { id: "S-0311", customer: "Aina", detail: "Dog treats × 3", amount: 36, status: "paid" },
        { id: "S-0310", customer: "Mr Tan", detail: "Pet shampoo, cat food", amount: 50, status: "paid" },
        { id: "S-0298", customer: "Kumar", detail: "Cat litter × 4", amount: 100, status: "overdue" },
      ],
      stock: [
        { id: "cat-food", name: "Cat food 1.5kg", quantity: 4, lowAt: 3, price: 32 },
        { id: "cat-litter", name: "Cat litter 10L", quantity: 2, lowAt: 3, price: 25 },
        { id: "shampoo", name: "Pet shampoo", quantity: 12, lowAt: 5, price: 18 },
        { id: "treats", name: "Dog treats", quantity: 9, lowAt: 4, price: 12 },
      ],
      bookings: [],
    },
  },
  service: {
    label: "Service",
    title: "Your service business",
    tabs: [
      { id: "today", label: "Today" },
      { id: "customers", label: "Customers" },
      { id: "bookings", label: "Bookings" },
      { id: "bills", label: "Invoices" },
    ],
    billsHeading: "Invoices",
    billPrefix: "INV-",
    stockUnit: "left",
    hint: "Open Bookings and mark a job as done. Then check Invoices and Today.",
    customers: [
      { name: "Farid", note: "3 jobs this year" },
      { name: "Mei Ling", note: "Service every 4 months" },
      { name: "Aina", note: "2 units at home" },
      { name: "Mr Tan", note: "New customer" },
      { name: "Kumar", note: "Shop lot, 4 units" },
      { name: "Siti", note: "1 job last year" },
    ],
    start: {
      collected: 480,
      nextBillNo: 1044,
      bills: [
        { id: "INV-1041", customer: "Farid", detail: "Chemical wash, 3 units", amount: 350, status: "overdue" },
        { id: "INV-1042", customer: "Mei Ling", detail: "Aircond service, 1 unit", amount: 120, status: "unpaid" },
        { id: "INV-1043", customer: "Aina", detail: "Aircond service, 2 units", amount: 180, status: "paid" },
      ],
      stock: [],
      bookings: [
        { id: "job-1", time: "9:00", customer: "Aina", job: "Aircond service, 2 units", amount: 180, done: true },
        { id: "job-2", time: "11:30", customer: "Mr Tan", job: "Aircond repair", amount: 250, done: false },
        { id: "job-3", time: "2:30", customer: "Kumar", job: "New unit installation", amount: 600, done: false },
        { id: "job-4", time: "4:30", customer: "Siti", job: "Chemical wash, 1 unit", amount: 150, done: false },
      ],
    },
  },
  supplier: {
    label: "Supplier",
    title: "Your company",
    tabs: [
      { id: "today", label: "Today" },
      { id: "customers", label: "Customers" },
      { id: "bills", label: "Quotations" },
      { id: "stock", label: "Stock" },
    ],
    billsHeading: "Quotations and invoices",
    billPrefix: "INV-",
    stockUnit: "cartons",
    hint: "Open Quotations and make an invoice for Mr Lim. Then check Stock.",
    customers: [
      { name: "Mr Lim", note: "Restaurant · orders monthly" },
      { name: "Daniel", note: "Café · new customer" },
      { name: "Pn. Rohana", note: "Hotel · orders every 2 weeks" },
      { name: "Kak Zah", note: "Catering · orders weekly" },
    ],
    start: {
      collected: 2150,
      nextBillNo: 521,
      bills: [
        { id: "Q-208", customer: "Mr Lim", detail: "Takeaway boxes × 20 cartons", amount: 1200, status: "quote", stockId: "boxes", quantity: 20 },
        { id: "Q-207", customer: "Daniel", detail: "Paper cups × 10 cartons", amount: 650, status: "quote", stockId: "cups", quantity: 10 },
        { id: "INV-0519", customer: "Pn. Rohana", detail: "Paper bags × 40 cartons", amount: 2400, status: "overdue" },
        { id: "INV-0520", customer: "Kak Zah", detail: "Takeaway boxes × 15 cartons", amount: 900, status: "unpaid" },
      ],
      stock: [
        { id: "boxes", name: "Takeaway boxes", quantity: 24, lowAt: 10 },
        { id: "cups", name: "Paper cups", quantity: 30, lowAt: 10 },
        { id: "bags", name: "Paper bags", quantity: 6, lowAt: 10 },
        { id: "straws", name: "Paper straws", quantity: 40, lowAt: 10 },
      ],
      bookings: [],
    },
  },
};

/** "RM 1,240". Written by hand so the server and the browser always agree. */
export function formatRM(amount: number): string {
  return `RM ${String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

export function startDemo(business: BusinessId): DemoState {
  return { ...DEMO_PRESETS[business].start, business, message: null };
}

export function isLow(item: StockItem): boolean {
  return item.quantity <= item.lowAt;
}

function isOwed(bill: Bill): boolean {
  return bill.status === "unpaid" || bill.status === "overdue";
}

function sumOf(bills: Bill[]): number {
  return bills.reduce((total, bill) => total + bill.amount, 0);
}

export function amountToCollect(state: DemoState): number {
  return sumOf(state.bills.filter(isOwed));
}

export function amountOwedBy(state: DemoState, customer: string): number {
  return sumOf(state.bills.filter((bill) => isOwed(bill) && bill.customer === customer));
}

function plural(count: number, one: string, many: string): string {
  return `${count} ${count === 1 ? one : many}`;
}

/** What the owner should look at today, worst first. */
export function getAlerts(state: DemoState): DemoAlert[] {
  const alerts: DemoAlert[] = [];

  const overdue = state.bills.filter((bill) => bill.status === "overdue");
  if (overdue.length > 0) {
    alerts.push({
      tab: "bills",
      tone: "red",
      text: `${plural(overdue.length, "overdue payment", "overdue payments")} · ${formatRM(sumOf(overdue))}`,
    });
  }

  const low = state.stock.filter(isLow);
  if (low.length > 0) {
    alerts.push({
      tab: "stock",
      tone: "amber",
      text: `${plural(low.length, "item is", "items are")} running low`,
    });
  }

  const jobsLeft = state.bookings.filter((booking) => !booking.done);
  if (jobsLeft.length > 0) {
    alerts.push({
      tab: "bookings",
      tone: "blue",
      text: `${plural(jobsLeft.length, "job", "jobs")} still to do today`,
    });
  }

  const quotes = state.bills.filter((bill) => bill.status === "quote");
  if (quotes.length > 0) {
    alerts.push({
      tab: "bills",
      tone: "blue",
      text: `${plural(quotes.length, "quotation", "quotations")} waiting for an answer`,
    });
  }

  return alerts;
}

function nextBillId(state: DemoState): string {
  const prefix = DEMO_PRESETS[state.business].billPrefix;
  return `${prefix}${String(state.nextBillNo).padStart(4, "0")}`;
}

export function reduceDemo(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case "reset":
      return startDemo(action.business);

    case "pay": {
      const bill = state.bills.find((entry) => entry.id === action.billId);
      if (!bill || !isOwed(bill)) return state;
      return {
        ...state,
        collected: state.collected + bill.amount,
        bills: state.bills.map((entry) =>
          entry === bill ? { ...entry, status: "paid" } : entry,
        ),
        message: `${bill.customer} paid ${formatRM(bill.amount)}. "Collected today" went up.`,
      };
    }

    case "invoice": {
      const quote = state.bills.find((entry) => entry.id === action.billId);
      if (!quote || quote.status !== "quote") return state;
      const id = nextBillId(state);
      const item = state.stock.find((entry) => entry.id === quote.stockId);
      const taken = Math.min(quote.quantity ?? 0, item?.quantity ?? 0);
      const unit = DEMO_PRESETS[state.business].stockUnit;
      return {
        ...state,
        nextBillNo: state.nextBillNo + 1,
        bills: state.bills.map((entry) =>
          entry === quote ? { ...entry, id, status: "unpaid" } : entry,
        ),
        stock: state.stock.map((entry) =>
          entry === item ? { ...entry, quantity: entry.quantity - taken } : entry,
        ),
        message: item
          ? `Invoice ${id} made for ${quote.customer}. ${taken} ${unit} of ${item.name.toLowerCase()} left the stock.`
          : `Invoice ${id} made for ${quote.customer}.`,
      };
    }

    case "sell": {
      const item = state.stock.find((entry) => entry.id === action.stockId);
      if (!item || item.price === undefined || item.quantity === 0) return state;
      const left = item.quantity - 1;
      const becameLow = !isLow(item) && left <= item.lowAt;
      return {
        ...state,
        collected: state.collected + item.price,
        nextBillNo: state.nextBillNo + 1,
        bills: [
          { id: nextBillId(state), customer: "Walk-in customer", detail: item.name, amount: item.price, status: "paid" },
          ...state.bills,
        ],
        stock: state.stock.map((entry) =>
          entry === item ? { ...entry, quantity: left } : entry,
        ),
        message: `Sold 1 ${item.name.toLowerCase()}. ${left} left.${becameLow ? " Today now shows a low-stock alert." : ""}`,
      };
    }

    case "restock": {
      const item = state.stock.find((entry) => entry.id === action.stockId);
      if (!item) return state;
      const quantity = item.quantity + RESTOCK_BY;
      return {
        ...state,
        stock: state.stock.map((entry) =>
          entry === item ? { ...entry, quantity } : entry,
        ),
        message: `${item.name} restocked. ${quantity} in stock now.`,
      };
    }

    case "finish": {
      const booking = state.bookings.find((entry) => entry.id === action.bookingId);
      if (!booking || booking.done) return state;
      const id = nextBillId(state);
      return {
        ...state,
        nextBillNo: state.nextBillNo + 1,
        bookings: state.bookings.map((entry) =>
          entry === booking ? { ...entry, done: true } : entry,
        ),
        bills: [
          { id, customer: booking.customer, detail: booking.job, amount: booking.amount, status: "unpaid" },
          ...state.bills,
        ],
        message: `Job done. Invoice ${id} for ${formatRM(booking.amount)} was made by itself.`,
      };
    }
  }
}
