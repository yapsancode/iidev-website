import { ImageResponse } from "next/og";
import { getProspectByPreviewToken } from "@/lib/prospects/data";
import { tokenFromRef } from "@/lib/prospects/preview";
import { previewCopy } from "@/lib/prospects/preview-copy";

export const alt = "A private page from IIDev Studio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ ref: string }> };

/**
 * The card WhatsApp shows next to the link. Words only: no logo, photo or map of the business.
 * An unknown link gets the same plain card, so the image never reveals whether a link exists.
 */
export default async function PreviewCard({ params }: Props) {
  const token = tokenFromRef((await params).ref);
  const prospect = token ? await getProspectByPreviewToken(token).catch(() => null) : null;
  const copy = previewCopy(prospect?.draft_language ?? null);
  const title = prospect ? `${copy.preparedFor} ${prospect.business_name}` : "IIDev Studio";
  const line = prospect?.preview_findings ? copy.cardLine(prospect.preview_findings.length) : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0A0A0A",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 36, fontWeight: 700, color: "#FFFFFF" }}>IIDev Studio</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: title.length > 40 ? 60 : 76, fontWeight: 800, color: "#FFFFFF", lineHeight: 1.05, maxWidth: 1000 }}>
            {title}
          </div>
          {line ? <div style={{ display: "flex", fontSize: 34, color: "#A3A3A3", marginTop: 28 }}>{line}</div> : null}
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#10B981", fontWeight: 600 }}>
          {prospect ? `${copy.cardPrivate} · iidevstudio.com` : "iidevstudio.com"}
        </div>
      </div>
    ),
    { ...size },
  );
}
