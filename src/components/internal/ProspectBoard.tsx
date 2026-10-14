"use client";

import Link from "next/link";
import { useOptimistic, useState, useTransition } from "react";
import { moveProspect } from "@/app/internal/prospect-actions";
import { buttonClass, fieldClass, labelClass } from "@/components/internal/ui";
import { lostReasonLabels, lostReasons, prospectStatuses, prospectStatusLabels, type LostReason, type ProspectStatus } from "@/lib/prospects/types";
import { cn } from "@/lib/utils";

export interface BoardCard {
  id: string;
  business_name: string;
  category: string;
  priority: "A" | "B";
  status: ProspectStatus;
  website_state: "none" | "weak" | "ok" | null;
  next_follow_up_label: string | null;
  due: boolean;
  /** They asked us to stop. The card stays where it is. */
  stopped: boolean;
}

const stateLabels = { none: "No site", weak: "Weak site", ok: "Site ok" } as const;

/** Reasons a founder can pick here. "Asked us to stop" has its own button on the prospect page. */
const boardLostReasons = lostReasons.filter((reason) => reason !== "asked_to_stop");

/**
 * One column per status. On a computer, drag a card to another column.
 * On a phone, drag-and-drop does not exist in the browser, so every card also has a "Move to" menu.
 * A move is saved the same way as the buttons on the prospect page: Messaged sets the follow-up
 * date, Replied counts as a reply, and Lost asks for the reason first.
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
  const [askingLost, setAskingLost] = useState<string | null>(null);
  const [reason, setReason] = useState<LostReason | "">("");
  const [, startTransition] = useTransition();

  function save(id: string, status: ProspectStatus, lostReason?: LostReason) {
    setFailed(false);
    startTransition(async () => {
      moveOptimistically({ id, status });
      try {
        await moveProspect(id, status, lostReason);
      } catch {
        setFailed(true);
      }
    });
  }

  function move(id: string, status: ProspectStatus) {
    const card = optimisticCards.find((entry) => entry.id === id);
    if (!card || card.status === status || card.stopped) return;
    if (status === "lost") {
      setReason("");
      setAskingLost(id);
      return;
    }
    save(id, status);
  }

  const lostCard = askingLost ? optimisticCards.find((card) => card.id === askingLost) : null;

  return (
    <div className="mt-6">
      {failed && <p role="alert" className="mb-3 bg-os-alert-soft px-4 py-3 text-sm text-os-alert">The move did not save. Reload the page and try again.</p>}
      {lostCard && (
        <form
          className="mb-4 grid gap-3 border-t-4 border-os-ink bg-os-paper p-4 sm:max-w-md"
          onSubmit={(event) => {
            event.preventDefault();
            if (!reason) return;
            save(lostCard.id, "lost", reason);
            setAskingLost(null);
          }}
        >
          <label className={labelClass}>
            Why was {lostCard.business_name} lost?
            <select required value={reason} onChange={(event) => setReason(event.target.value as LostReason)} className={fieldClass}>
              <option value="" disabled>Pick a reason</option>
              {boardLostReasons.map((entry) => <option key={entry} value={entry}>{lostReasonLabels[entry]}</option>)}
            </select>
          </label>
          <p className="text-xs text-os-muted">If they asked us to stop, use the button on their prospect page instead.</p>
          <div className="grid grid-cols-2 gap-2">
            <button type="submit" className={buttonClass("primary")}>Mark lost</button>
            <button type="button" onClick={() => setAskingLost(null)} className={buttonClass("secondary")}>Cancel</button>
          </div>
        </form>
      )}
      <div className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
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
              className={cn("flex w-[244px] shrink-0 snap-start flex-col p-2 transition-colors", active ? "bg-os-accent-soft" : "bg-os-well")}
            >
              <header className="flex items-center justify-between px-1 pb-2 pt-1">
                <h2 className="text-[13px] font-medium">{prospectStatusLabels[status]}</h2>
                <span className="tabular text-[13px] text-os-muted">{column.length}</span>
              </header>
              <ul className="flex min-h-16 flex-col gap-1.5">
                {column.length === 0 && <li className="border border-dashed border-os-line px-3 py-4 text-center text-xs text-os-muted">Empty</li>}
                {column.map((card) => (
                  <li
                    key={card.id}
                    draggable={!card.stopped}
                    onDragStart={(event) => { event.dataTransfer.setData("text/plain", card.id); event.dataTransfer.effectAllowed = "move"; setDragging(card.id); }}
                    onDragEnd={() => { setDragging(null); setTarget(null); }}
                    className={cn("bg-os-paper p-3", card.stopped ? "cursor-default" : "cursor-grab active:cursor-grabbing", dragging === card.id && "opacity-50")}
                  >
                    <Link href={`/internal/prospects/${card.id}`} draggable={false} className="block text-sm font-medium leading-snug underline-offset-4 hover:underline">{card.business_name}</Link>
                    <p className="mt-1 text-xs text-os-muted">
                      {card.category} · Priority {card.priority}{card.website_state ? ` · ${stateLabels[card.website_state]}` : ""}
                    </p>
                    {card.next_follow_up_label && (
                      <p className={cn("mt-1 text-xs", card.due ? "text-os-alert" : "text-os-muted")}>
                        {card.due ? "Follow-up due" : "Follow up"} {card.next_follow_up_label}
                      </p>
                    )}
                    {card.stopped ? (
                      <p className="mt-2 text-xs text-os-alert">Asked us to stop</p>
                    ) : (
                      <label className="mt-2 block">
                        <span className="sr-only">Move {card.business_name} to</span>
                        <select
                          value={card.status}
                          onChange={(event) => move(card.id, event.target.value as ProspectStatus)}
                          className="block min-h-10 w-full bg-os-ground px-2 text-[13px] text-os-ink outline-none focus:outline-os-accent"
                        >
                          {prospectStatuses.map((option) => <option key={option} value={option}>{option === card.status ? prospectStatusLabels[option] : `Move to ${prospectStatusLabels[option]}`}</option>)}
                        </select>
                      </label>
                    )}
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
