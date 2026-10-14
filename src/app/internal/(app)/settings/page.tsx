import type { Metadata } from "next";
import { LogOut } from "lucide-react";
import { InstallAppButton } from "@/components/internal/InstallAppButton";
import { ThemeChoice } from "@/components/internal/ThemeChoice";
import { buttonClass, PageHeader, Panel, Tag } from "@/components/internal/ui";
import { requireInternalUser } from "@/lib/auth/internal-user";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await requireInternalUser();
  const services = [
    { label: "Database", detail: "Cloudflare D1, where prospects and enquiries live", ready: true },
    { label: "Telegram alerts", detail: "A message to the founders' group for every new enquiry", ready: Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) },
  ];
  return (
    <>
      <PageHeader eyebrow="Founders only" title="Settings" />
      <div className="mt-6 grid gap-2 lg:grid-cols-2">
        <Panel>
          <h2 className="text-base font-medium">Signed in</h2>
          <p className="mt-2 text-[15px]">{user.full_name}</p>
          <p className="text-[13px] text-os-muted">{user.email}</p>
          <a href="/cdn-cgi/access/logout" className={`${buttonClass("secondary")} mt-4`}>
            <LogOut className="h-4 w-4" strokeWidth={1.75} aria-hidden />Sign out
          </a>
        </Panel>

        <Panel>
          <h2 className="text-base font-medium">Connections</h2>
          <ul className="mt-2 divide-y divide-os-line">
            {services.map((service) => (
              <li key={service.label} className="flex items-center justify-between gap-4 py-3">
                <span>
                  <span className="block text-sm">{service.label}</span>
                  <span className="block text-[13px] text-os-muted">{service.detail}</span>
                </span>
                <Tag tone={service.ready ? "neutral" : "alert"}>{service.ready ? "On" : "Not set up"}</Tag>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[13px] text-os-muted">
            Enquiry summaries are written by Claude in the chat app, when you ask. Nothing is summarised on its own. Secret keys are stored in Cloudflare and never shown here.
          </p>
        </Panel>

        <Panel>
          <h2 className="text-base font-medium">Appearance</h2>
          <p className="mt-1 text-[13px] text-os-muted">Applies to this browser.</p>
          <div className="mt-3"><ThemeChoice /></div>
        </Panel>

        <Panel>
          <h2 className="text-base font-medium">Put it on your home screen</h2>
          <p className="mt-1 text-[13px] text-os-muted">Opens like an app. Prospect data is never saved on the phone for offline use.</p>
          <div className="mt-3"><InstallAppButton /></div>
        </Panel>
      </div>
    </>
  );
}
