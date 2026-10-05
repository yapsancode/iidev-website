/**
 * Re-mounts on every navigation into (and within) /services, so this entrance
 * animation runs each time the user enters a services page.
 *
 * CSS-only on purpose: the server HTML is never hidden while JavaScript loads.
 * Opacity-only as well: transform/filter/blur would make this wrapper the
 * containing block for the `position: fixed` Navbar and break its scroll behavior.
 */
export default function ServicesTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="animate-[menu-fade-in_0.45s_cubic-bezier(0.22,1,0.36,1)_both] motion-reduce:animate-none">
      {children}
    </div>
  );
}
