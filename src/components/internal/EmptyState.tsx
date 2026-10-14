export function EmptyState({ title, description, children }: { title: string; description: string; children?: React.ReactNode }) {
  return (
    <div className="bg-os-paper px-5 py-10 text-center">
      <h2 className="font-os-display text-2xl leading-tight">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-os-muted">{description}</p>
      {children && <div className="mt-5 flex justify-center gap-2">{children}</div>}
    </div>
  );
}
