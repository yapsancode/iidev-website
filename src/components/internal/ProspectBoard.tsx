"use client";

import Link from "next/link";
import { useOptimistic, useState, useTransition } from "react";
import { moveProspect } from "@/app/internal/prospect-actions";
import { prospectStatuses, prospectStatusLabels, type ProspectStatus } from "@/lib/prospects/types";

export interface BoardCard {
  id: string;
  business_name: string;
  category: string;
  priority: "A" | "B";
  status: ProspectStatus;
  website_state: "none" | "weak" | "ok" | null;
  next_follow_up_label: string | null;
  due: boolean;
}

const stateLabels = { none: "No site", weak: "Weak site", ok: "Site ok" } as const;

/**
 * One column per status. On a desktop, drag a card to another column.
 * On a phone, drag-and-drop does not exist in the browser, so every card also has a "Move to" menu.
 */
export function ProspectBoard({ cards }: { cards: BoardCard[] }) {
  const [optimisticCards, moveOptimistically] = useOptimistic(
    cards,
    (current, move: { id: string; status: ProspectStatus }) =>
      current.map((card) => (card.id === move.id ? { ...card, status: move.status } : card)),
  );
  const [dragging, setDragging] = useState<string | null>(null);
  const [target, setTarget] = useState<ProspectStatus | null>(null);
  const [failed, setFailed] = useState(false);
  const [, startTransition] = useTransition();

  function move(id: string, status: ProspectStatus) {
    const card = optimisticCards.find((entry) => entry.id === id);
    if (!card || card.status === status) return;
    setFailed(false);
    startTransition(async () => {
      moveOptimistically({ id, status });
      try {
        await moveProspect(id, status);
      } catch {
        setFailed(true);
      }
    });
  }

  return (
    <div className="mt-5">
      {failed && <p role="alert" className="mb-3 rounded-2xl bg-red-50 px-4 py-3 font-sans text-xs text-red-800 dark:bg-red-950 dark:text-red-200">The move did not save. Reload the page and try again.</p>}
      <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-4 sm:-mx-7 sm:px-7 lg:mx-0 lg:px-0">
        {prospectStatuses.map((status) => {
          const column = optimisticCards.filter((card) => card.status === status);
          const active = target === status && dragging !== null;
          return (
            <section
              key={status}
              aria-label={`${prospectStatusLabels[status]}, ${column.length}`}
              onDragOver={(event) => { event.preventDefault(); setTarget(status); }}
              onDragLeave={() => setTarget((current) => (current === status ? null : current))}
              onDrop={(event) => {
                event.preventDefault();
                const id = event.dataTransfer.getData("text/plain") || dragging;
                setTarget(null);
                setDragging(null);
                if (id) move(id, status);
              }}
              className={`flex w-[240px] shrink-0 snap-start flex-col rounded-[1.4rem] p-3 transition ${active ? "bg-emerald-100 dark:bg-emerald-950" : "bg-black/[0.04] dark:bg-white/[0.05]"}`}
            >
              <header className="flex items-center justify-between px-1 pb-2">
                <h2 className="font-sans text-xs font-bold">{prospectStatusLabels[status]}</h2>
                <span className="rounded-full bg-white px-2 py-0.5 font-mono text-[10px] tabular-nums dark:bg-neutral-800">{column.length}</span>
              </header>
              <ul className="flex min-h-16 flex-col gap-2">
                {column.length === 0 && <li className="rounded-xl border border-dashed border-black/10 px-3 py-4 text-center font-sans text-[10px] text-neutral-400 dark:border-white/10">Empty</li>}
                {column.map((card) => (
                  <li
                    key={card.id}
                    draggable
                    onDragStart={(event) => { event.dataTransfer.setData("text/plain", card.id); event.dataTransfer.effectAllowed = "move"; setDragging(card.id); }}
                    onDragEnd={() => { setDragging(null); setTarget(null); }}
                    className={`cursor-grab rounded-xl bg-white p-3 shadow-sm active:cursor-grabbing dark:bg-neutral-900 ${dragging === card.id ? "opacity-50" : ""}`}
                  >
                    <Link href={`/internal/prospects/${card.id}`} draggable={false} className="block font-sans text-xs font-bold leading-snug hover:underline">{card.business_name}</Link>
                    <p className="mt-1 font-sans text-[10px] text-neutral-500 dark:text-neutral-400">
                      {card.category} · Priority {card.priority}{card.website_state ? ` · ${stateLabels[card.website_state]}` : ""}
                    </p>
                    {card.next_follow_up_label && (
                      <p className={`mt-1 font-sans text-[10px] font-semibold ${card.due ? "text-red-700 dark:text-red-300" : "text-neutral-500 dark:text-neutral-400"}`}>
                        {card.due ? "Follow-up due" : "Follow up"} {card.next_follow_up_label}
                      </p>
                    )}
                    <label className="relative mt-2 block">
                      <span className="sr-only">Move {card.business_name} to</span>
                      <select
                        value={card.status}
                        onChange={(event) => move(card.id, event.target.value as ProspectStatus)}
                        className="w-full rounded-lg bg-neutral-100 px-2 py-2 font-sans text-[11px] dark:bg-neutral-800"
                      >
                        {prospectStatuses.map((option) => <option key={option} value={option}>{option === card.status ? prospectStatusLabels[option] : `Move to ${prospectStatusLabels[option]}`}</option>)}
                      </select>
                    </label>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
