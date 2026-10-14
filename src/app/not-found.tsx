import Link from "next/link";
import { SitePage } from "@/components/site/chrome";

export default function NotFound() {
  return (
    <SitePage>
      <div className="wrap notfound">
        <div>
          <p className="page-kicker">Error 404</p>
          <h1 className="display page-title">Page not found</h1>
        </div>
        <p>
          The page you are looking for may have moved, or the address may be incorrect.
        </p>
        <div className="notfound-actions">
          <Link href="/" className="btn">
            Back home
          </Link>
          <Link href="/services" className="link link-line">
            View services
          </Link>
        </div>
      </div>
    </SitePage>
  );
}
