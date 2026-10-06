"use client";

import {
  useReducer,
  useState,
  type Dispatch,
  type ReactNode,
} from "react";
import {
  Boxes,
  CalendarCheck,
  Check,
  ChevronRight,
  LayoutDashboard,
  Monitor,
  Receipt,
  RotateCcw,
  Smartphone,
  Store,
  Truck,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { CARD_FRAME, LABEL } from "@/lib/styles";
import { cn } from "@/lib/utils";
import {
  BUSINESS_IDS,
  DEMO_PRESETS,
  amountOwedBy,
  amountToCollect,
  formatRM,
  getAlerts,
  isLow,
  reduceDemo,
  startDemo,
  type BillStatus,
  type BusinessId,
  type DemoAction,
  type DemoAlert,
  type DemoPreset,
  type DemoState,
  type TabId,
} from "./business-os-demo";

type View = "phone" | "computer";

const BUSINESS_ICONS: Record<BusinessId, LucideIcon> = {
  shop: Store,
  service: Wrench,
  supplier: Truck,
};

const TAB_ICONS: Record<TabId, LucideIcon> = {
  today: LayoutDashboard,
  customers: Users,
  bills: Receipt,
  stock: Boxes,
  bookings: CalendarCheck,
};

const STATUS_LABELS: Record<BillStatus, string> = {
  quote: "Quotation",
  unpaid: "Unpaid",
  overdue: "Overdue",
  paid: "Paid",
};

const STATUS_STYLES: Record<BillStatus, string> = {
  quote: "bg-indigo-100 text-indigo-800",
  unpaid: "bg-amber-100 text-amber-900",
  overdue: "bg-red-100 text-red-800",
  paid: "bg-emerald-100 text-emerald-800",
};

const ALERT_DOTS: Record<DemoAlert["tone"], string> = {
  red: "bg-red-500",
  amber: "bg-amber-500",
  blue: "bg-indigo-500",
};

/**
 * A small sample system the visitor can tap through. It is here to show one
 * idea: do one thing (take a payment, sell an item, finish a job) and every
 * other screen updates by itself.
 *
 * - Three kinds of business, each with its own tabs and made-up data.
 * - The same screens are shown in a phone or a computer frame.
 * - The screens inside the frames are always light, like a screenshot. Only
 *   the controls around them follow the site's dark mode.
 */
export function BusinessOsDemo() {
  const [state, dispatch] = useReducer(reduceDemo, "shop", startDemo);
  const [view, setView] = useState<View>("phone");
  const [tab, setTab] = useState<TabId>("today");
  // A dot on the Today tab: something there changed while you were elsewhere.
  const [todayChanged, setTodayChanged] = useState(false);

  const preset = DEMO_PRESETS[state.business];

  const act = (action: DemoAction) => {
    dispatch(action);
    if (tab !== "today") setTodayChanged(true);
  };

  const openTab = (next: TabId) => {
    setTab(next);
    if (next === "today") setTodayChanged(false);
  };

  const start = (business: BusinessId) => {
    dispatch({ type: "reset", business });
    setTab("today");
    setTodayChanged(false);
  };

  const screen = {
    state,
    preset,
    tab,
    todayChanged,
    openTab,
    act,
  };

  return (
    <section aria-label="A sample system you can try">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <Choice legend="I run a">
          {BUSINESS_IDS.map((id) => (
            <ChoiceButton
              key={id}
              icon={BUSINESS_ICONS[id]}
              pressed={state.business === id}
              onClick={() => start(id)}
            >
              {DEMO_PRESETS[id].label}
            </ChoiceButton>
          ))}
        </Choice>
        <Choice legend="Show it on a">
          <ChoiceButton icon={Smartphone} pressed={view === "phone"} onClick={() => setView("phone")}>
            Phone
          </ChoiceButton>
          <ChoiceButton icon={Monitor} pressed={view === "computer"} onClick={() => setView("computer")}>
            Computer
          </ChoiceButton>
        </Choice>
      </div>

      <div
        className={cn(
          CARD_FRAME,
          "mt-4 bg-neutral-100 bg-[radial-gradient(rgba(0,0,0,0.16)_1px,transparent_1px)] bg-size-[14px_14px] dark:bg-neutral-800 dark:bg-[radial-gradient(rgba(255,255,255,0.16)_1px,transparent_1px)]",
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b-2 border-black bg-emerald-300 px-4 py-2 text-black dark:border-white">
          <p className="py-1 text-sm leading-snug">
            <span className="font-bold">Try this:</span> {preset.hint}
          </p>
          <button
            type="button"
            onClick={() => start(state.business)}
            className={cn(LABEL, "inline-flex min-h-11 shrink-0 items-center gap-1.5 underline-offset-4 hover:underline")}
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Start again
          </button>
        </div>

        <div className="p-3 sm:p-6">
          {view === "phone" ? <PhoneFrame {...screen} /> : <ComputerFrame {...screen} />}
        </div>
      </div>
    </section>
  );
}

function Choice({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className="min-w-0">
      <legend className={cn(LABEL, "mb-2 text-neutral-600 dark:text-neutral-300")}>
        {legend}
      </legend>
      <div className="inline-flex border-2 border-black dark:border-white">{children}</div>
    </fieldset>
  );
}

function ChoiceButton({
  icon: Icon,
  pressed,
  onClick,
  children,
}: {
  icon: LucideIcon;
  pressed: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        LABEL,
        "inline-flex min-h-11 items-center gap-1.5 border-black px-3 not-first:border-l-2 dark:border-white",
        pressed
          ? "bg-black text-white dark:bg-white dark:text-black"
          : "bg-white text-black hover:bg-emerald-300 dark:bg-neutral-900 dark:text-white dark:hover:bg-emerald-400 dark:hover:text-black",
      )}
    >
      <Icon className="hidden h-4 w-4 sm:block" aria-hidden="true" />
      {children}
    </button>
  );
}

interface ScreenProps {
  state: DemoState;
  preset: DemoPreset;
  tab: TabId;
  todayChanged: boolean;
  openTab: (tab: TabId) => void;
  act: Dispatch<DemoAction>;
}

function PhoneFrame(props: ScreenProps) {
  const { preset, tab, todayChanged, openTab } = props;

  return (
    <div className="mx-auto w-full max-w-80 overflow-clip rounded-[2.25rem] border-10 border-black bg-neutral-50 text-neutral-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
      <div className="flex items-center justify-between gap-2 border-b border-neutral-200 bg-white px-4 py-3">
        <p className="truncate text-sm font-bold">{preset.title}</p>
        <SampleTag />
      </div>

      <div className="h-104 overflow-y-auto p-3">
        <Panel {...props} />
      </div>

      <StatusLine message={props.state.message} />

      <div className="grid grid-cols-4 border-t border-neutral-200 bg-white">
        {preset.tabs.map(({ id, label }) => {
          const Icon = TAB_ICONS[id];
          return (
            <button
              key={id}
              type="button"
              aria-pressed={tab === id}
              onClick={() => openTab(id)}
              className={cn(
                "relative flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] font-semibold",
                tab === id ? "text-indigo-700" : "text-neutral-500 hover:text-neutral-900",
              )}
            >
              <Icon className="h-4.5 w-4.5" aria-hidden="true" />
              {label}
              {id === "today" && todayChanged && <ChangedDot className="right-[26%] top-2" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ComputerFrame(props: ScreenProps) {
  const { state, preset, tab, todayChanged, openTab } = props;
  const alerts = getAlerts(state);

  // `@container`: where the frame is narrow (a phone), the side menu folds down
  // to icons instead of the whole screen shrinking until nobody can read it.
  return (
    <div className="@container mx-auto max-w-160">
      <div className="overflow-clip border-2 border-black bg-neutral-50 text-neutral-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
        <div className="flex items-center gap-2 border-b-2 border-black bg-neutral-100 px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
          <div className="ml-2 flex-1 truncate rounded-md border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-500">
            demo.iidevstudio.com
          </div>
        </div>

        <div className="grid h-104 grid-cols-[3.25rem_1fr] grid-rows-[minmax(0,1fr)] @lg:grid-cols-[9.5rem_1fr]">
          <div className="flex min-h-0 flex-col gap-1 border-r border-neutral-200 bg-white p-1 @lg:p-2">
            <p className="hidden px-2 py-2 text-sm font-bold leading-tight @lg:block">
              {preset.title}
            </p>
            {preset.tabs.map(({ id, label }) => {
              const Icon = TAB_ICONS[id];
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={tab === id}
                  onClick={() => openTab(id)}
                  className={cn(
                    "relative flex min-h-11 items-center justify-center gap-2 rounded-md text-[13px] font-semibold @lg:min-h-10 @lg:justify-start @lg:px-2",
                    tab === id
                      ? "bg-indigo-600 text-white"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="sr-only @lg:not-sr-only">{label}</span>
                  {id === "today" && todayChanged && (
                    <ChangedDot className="right-1.5 top-1.5 @lg:right-2 @lg:top-1/2 @lg:-translate-y-1/2" />
                  )}
                </button>
              );
            })}
            <div className="mt-auto hidden px-2 pb-1 @lg:block">
              <SampleTag />
            </div>
          </div>

          <div className="flex min-h-0 min-w-0 flex-col">
            {/* Always in view, so every tap visibly moves a number. */}
            <div className="grid grid-cols-3 gap-1.5 border-b border-neutral-200 p-2 @lg:gap-2 @lg:p-3">
              <Figure label="Collected today" value={formatRM(state.collected)} tone="text-emerald-700" />
              <Figure label="Still to collect" value={formatRM(amountToCollect(state))} tone="text-amber-700" />
              <Figure label="Needs attention" value={String(alerts.length)} tone="text-neutral-900" />
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-2 @lg:p-3">
              <Panel {...props} figuresShown />
            </div>
            <StatusLine message={state.message} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Panel({ state, preset, tab, openTab, act, figuresShown = false }: ScreenProps & { figuresShown?: boolean }) {
  switch (tab) {
    case "today":
      return <TodayPanel state={state} openTab={openTab} figuresShown={figuresShown} />;
    case "customers":
      return <CustomersPanel state={state} preset={preset} />;
    case "bills":
      return <BillsPanel state={state} preset={preset} act={act} />;
    case "stock":
      return <StockPanel state={state} preset={preset} act={act} />;
    case "bookings":
      return <BookingsPanel state={state} act={act} />;
  }
}

function TodayPanel({
  state,
  openTab,
  figuresShown,
}: {
  state: DemoState;
  openTab: (tab: TabId) => void;
  figuresShown: boolean;
}) {
  const alerts = getAlerts(state);
  const toCollect = amountToCollect(state);
  const share = Math.round((state.collected / (state.collected + toCollect || 1)) * 100);

  return (
    <>
      {!figuresShown && (
        <div className="mb-4 rounded-xl bg-neutral-900 p-4 text-white">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            Collected today
          </p>
          <p className="mt-1 text-3xl font-bold tabular-nums text-emerald-300">
            {formatRM(state.collected)}
          </p>
          <div className="mt-3 h-1.5 rounded-full bg-neutral-700">
            <div
              className="h-full rounded-full bg-emerald-300 transition-[width] duration-500 motion-reduce:transition-none"
              style={{ width: `${share}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-neutral-300">
            Still to collect{" "}
            <span className="font-bold tabular-nums text-amber-300">{formatRM(toCollect)}</span>
          </p>
        </div>
      )}

      <PanelHeading>Needs attention</PanelHeading>
      {alerts.length === 0 ? (
        <p className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white p-3 text-[13px]">
          <Check className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
          All clear. Nothing needs you right now.
        </p>
      ) : (
        <ul className="space-y-2">
          {alerts.map((alert) => (
            <li key={alert.text}>
              <button
                type="button"
                onClick={() => openTab(alert.tab)}
                className="flex min-h-11 w-full items-center gap-2.5 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-left text-[13px] font-medium hover:border-neutral-400"
              >
                <span className={cn("h-2 w-2 shrink-0 rounded-full", ALERT_DOTS[alert.tone])} />
                <span className="min-w-0 flex-1">{alert.text}</span>
                <ChevronRight className="h-4 w-4 shrink-0 text-neutral-400" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function CustomersPanel({ state, preset }: { state: DemoState; preset: DemoPreset }) {
  return (
    <>
      <PanelHeading>Customers</PanelHeading>
      <ul className="space-y-2">
        {preset.customers.map(({ name, note }) => {
          const owed = amountOwedBy(state, name);
          return (
            <Row key={name}>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-800">
                {name.replace(/^(Mr|Pn\.|Kak) /, "").charAt(0)}
              </span>
              <RowText title={name} detail={note} />
              <Tag className={owed > 0 ? STATUS_STYLES.unpaid : STATUS_STYLES.paid}>
                {owed > 0 ? `Owes ${formatRM(owed)}` : "All paid"}
              </Tag>
            </Row>
          );
        })}
      </ul>
    </>
  );
}

function BillsPanel({
  state,
  preset,
  act,
}: {
  state: DemoState;
  preset: DemoPreset;
  act: Dispatch<DemoAction>;
}) {
  return (
    <>
      <PanelHeading>{preset.billsHeading}</PanelHeading>
      <ul className="space-y-2">
        {state.bills.map((bill) => (
          <Row key={bill.id}>
            <RowText title={bill.customer} detail={`${bill.id} · ${bill.detail}`}>
              <span className="font-bold tabular-nums">{formatRM(bill.amount)}</span>
              <Tag className={STATUS_STYLES[bill.status]}>{STATUS_LABELS[bill.status]}</Tag>
            </RowText>
            {bill.status === "quote" && (
              <ActionButton onClick={() => act({ type: "invoice", billId: bill.id })}>
                Make invoice
              </ActionButton>
            )}
            {(bill.status === "unpaid" || bill.status === "overdue") && (
              <ActionButton onClick={() => act({ type: "pay", billId: bill.id })}>
                Mark as paid
              </ActionButton>
            )}
          </Row>
        ))}
      </ul>
    </>
  );
}

function StockPanel({
  state,
  preset,
  act,
}: {
  state: DemoState;
  preset: DemoPreset;
  act: Dispatch<DemoAction>;
}) {
  return (
    <>
      <PanelHeading>Stock</PanelHeading>
      <ul className="space-y-2">
        {state.stock.map((item) => (
          <Row key={item.id}>
            <RowText
              title={item.name}
              detail={item.price === undefined ? undefined : `${formatRM(item.price)} each`}
            >
              <span className="font-bold tabular-nums">
                {item.quantity} {preset.stockUnit}
              </span>
              {isLow(item) && <Tag className={STATUS_STYLES.unpaid}>Running low</Tag>}
            </RowText>
            {item.price === undefined ? (
              <ActionButton onClick={() => act({ type: "restock", stockId: item.id })}>
                Restock
              </ActionButton>
            ) : (
              <ActionButton
                disabled={item.quantity === 0}
                onClick={() => act({ type: "sell", stockId: item.id })}
              >
                {item.quantity === 0 ? "Sold out" : "Sell 1"}
              </ActionButton>
            )}
          </Row>
        ))}
      </ul>
    </>
  );
}

function BookingsPanel({ state, act }: { state: DemoState; act: Dispatch<DemoAction> }) {
  return (
    <>
      <PanelHeading>Today&apos;s bookings</PanelHeading>
      <ul className="space-y-2">
        {state.bookings.map((booking) => (
          <Row key={booking.id}>
            <span className="w-11 shrink-0 text-[13px] font-bold tabular-nums">{booking.time}</span>
            <RowText title={booking.customer} detail={booking.job}>
              <span className="font-bold tabular-nums">{formatRM(booking.amount)}</span>
              {booking.done && <Tag className={STATUS_STYLES.paid}>Done</Tag>}
            </RowText>
            {!booking.done && (
              <ActionButton onClick={() => act({ type: "finish", bookingId: booking.id })}>
                Mark done
              </ActionButton>
            )}
          </Row>
        ))}
      </ul>
    </>
  );
}

function PanelHeading({ children }: { children: ReactNode }) {
  return (
    <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
      {children}
    </p>
  );
}

function Row({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-3">
      {children}
    </li>
  );
}

function RowText({
  title,
  detail,
  children,
}: {
  title: string;
  detail?: string;
  children?: ReactNode;
}) {
  return (
    <div className="min-w-0 flex-1">
      <p className="truncate text-[13px] font-bold">{title}</p>
      {detail && <p className="line-clamp-2 text-xs text-neutral-500">{detail}</p>}
      {children && (
        <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px]">{children}</p>
      )}
    </div>
  );
}

function Tag({ className, children }: { className: string; children: ReactNode }) {
  return (
    <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold", className)}>
      {children}
    </span>
  );
}

function ActionButton({
  disabled,
  onClick,
  children,
}: {
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="min-h-10 shrink-0 rounded-md bg-indigo-600 px-3 text-xs font-bold text-white hover:bg-indigo-500 disabled:bg-neutral-200 disabled:text-neutral-500"
    >
      {children}
    </button>
  );
}

function Figure({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white px-1.5 py-1.5 @lg:px-3 @lg:py-2">
      <p className="text-[10px] font-semibold leading-tight text-neutral-500 @lg:text-[11px]">{label}</p>
      <p className={cn("whitespace-nowrap text-xs font-bold tabular-nums @lg:text-lg", tone)}>{value}</p>
    </div>
  );
}

function SampleTag() {
  return (
    <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold text-neutral-600">
      Sample data
    </span>
  );
}

function ChangedDot({ className }: { className: string }) {
  return (
    <span className={cn("absolute h-2 w-2 rounded-full bg-emerald-500", className)}>
      <span className="sr-only">updated</span>
    </span>
  );
}

/** Says what the last tap changed. Keeps its height so the frame never jumps. */
function StatusLine({ message }: { message: string | null }) {
  return (
    <p
      role="status"
      className={cn(
        "flex min-h-12 items-center gap-2 border-t border-neutral-200 px-3 py-1.5 text-xs leading-snug",
        message ? "bg-emerald-50 text-emerald-900" : "bg-white text-neutral-500",
      )}
    >
      {message ? (
        <>
          <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {message}
        </>
      ) : (
        "Nothing here is real. Tap anything."
      )}
    </p>
  );
}
