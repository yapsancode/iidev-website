import { serveConceptPage } from "@/lib/concept-page";

// Read per request: the file comes from the static-files binding, which does not exist at build time.
export const dynamic = "force-dynamic";

export function GET(request: Request) {
  return serveConceptPage(request, "/concept/tariklagi/index.html");
}
