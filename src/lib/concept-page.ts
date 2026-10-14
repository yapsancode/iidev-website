/**
 * Serves a concept site's plain HTML file (kept in public/concept/...) at a clean address.
 * A rewrite in next.config.ts cannot do this: on Cloudflare the Worker does not find public
 * files after a rewrite. So the route asks the static-files binding for the file itself.
 */
export async function serveConceptPage(request: Request, file: string): Promise<Response> {
  const url = new URL(file, request.url);
  const { getCloudflareContext } = await import("@opennextjs/cloudflare");
  const { env } = await getCloudflareContext({ async: true });
  const assets = (env as { ASSETS?: Fetcher }).ASSETS;
  // `next dev` has no static-files binding, so there the file is fetched from the dev server.
  const found = assets ? await assets.fetch(url) : await fetch(url);
  if (!found.ok) return new Response("Not found", { status: 404 });
  return new Response(found.body, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // The clinic is invented, so it must never be listed in a search engine.
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
