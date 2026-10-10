import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatDay } from "@/components/internal/ProspectBits";
import type { OutboundOverview } from "@/lib/prospects/data";
import type { ProspectRecord } from "@/lib/prospects/types";

const DAILY_TARGET = 8;

function Row({ prospect, detail, urgent = false }: { prospect: ProspectRecord; detail: string; urgent?: boolean }) {
  return (
    <Link href={`/internal/prospects/${prospect.id}`} className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <strong className="block truncate font-sans text-sm">{prospect.business_name}</strong>
        <p className={`mt-0.5 line-clamp-1 font-sans text-xs ${urgent ? "font-semibold text-red-700 dark:text-red-300" : "text-neutral-500 dark:text-neutral-400"}`}>{detail}</p>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-neutral-400" />
    </Link>
  );
}

function Column({ title, count, href, empty, children }: { title: string; count: number; href: string; empty: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[1.6rem] bg-white p-5 shadow-sm dark:bg-neutral-900">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-sans text-sm font-bold">{title}</h3>
        <Link href={href} className="font-mono text-xs font-bold tabular-nums text-[#e95f4d]">{count}</Link>
      </div>
      {count === 0 ? <p className="mt-3 font-sans text-xs text-neutral-400">{empty}</p> : <div className="mt-1 divide-y divide-neutral-100 dark:divide-neutral-800">{children}</div>}
    </section>
  );
}

/** The outbound part of the Home page: what to do today, in the order to do it. */
export function OutboundToday({ overview }: { overview: OutboundOverview }) {
  if (overview.total === 0) return null;
  const headline =
    overview.due.length > 0 ? `Send ${overview.due.length} follow-up${overview.due.length === 1 ? "" : "s"} first.`
    : overview.replied.length > 0 ? `Answer ${overview.replied.length} repl${overview.replied.length === 1 ? "y" : "ies"} first.`
    : overview.ready.length > 0 ? `${overview.ready.length} audited and ready to message.`
    : overview.toAudit.length > 0 ? "Nothing is due. Audit the next few and send them."
    : "Nothing is due.";
  return (
    <div className="mt-7">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-sans text-lg font-bold">Outbound today</h2>
          <p className="mt-1 font-sans text-xs text-neutral-500 dark:text-neutral-400">{headline}</p>
        </div>
        <Link href="/internal/prospects" className="shrink-0 font-sans text-xs font-bold text-[#e95f4d]">All prospects</Link>
      </div>
      <p className="mt-3 rounded-2xl bg-white px-4 py-3 font-sans text-xs shadow-sm dark:bg-neutral-900">
        <strong className="font-mono text-sm tabular-nums">{overview.sentLast7Days}</strong> sent in the last 7 days. The plan is {DAILY_TARGET} to 10 a day.
        {overview.replyRate.messaged > 0 && <> Replies so far: <strong className="tabular-nums">{overview.replyRate.replied} of {overview.replyRate.messaged}</strong>.</>}
      </p>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Column title="Follow-ups due" count={overview.due.length} href="/internal/prospects?view=due" empty="No follow-ups due today.">
          {overview.due.slice(0, 5).map((prospect) => <Row key={prospect.id} prospect={prospect} urgent detail={prospect.next_follow_up === overview.today ? "Due today" : `Due since ${formatDay(prospect.next_follow_up)}`} />)}
        </Column>
        <Column title="Replies waiting" count={overview.replied.length} href="/internal/prospects?view=replied" empty="No replies waiting.">
          {overview.replied.slice(0, 5).map((prospect) => <Row key={prospect.id} prospect={prospect} detail={`Replied ${formatDay(prospect.last_contact)}`} />)}
        </Column>
        <Column title="Ready to message" count={overview.ready.length} href="/internal/prospects?view=ready" empty={overview.toAudit.length > 0 ? `None yet. ${overview.toAudit.length} still need an audit.` : "None."}>
          {overview.ready.slice(0, 5).map((prospect) => <Row key={prospect.id} prospect={prospect} detail={prospect.top_finding || "Audited"} />)}
        </Column>
      </div>
    </div>
  );
}
