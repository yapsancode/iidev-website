import { Inbox } from "lucide-react";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="rounded-3xl bg-white p-8 text-center shadow-sm dark:bg-neutral-900"><Inbox className="mx-auto h-8 w-8 text-neutral-400" /><h2 className="mt-4 font-sans text-lg font-bold">{title}</h2><p className="mx-auto mt-2 max-w-md font-sans text-sm text-neutral-500 dark:text-neutral-400">{description}</p></div>;
}
