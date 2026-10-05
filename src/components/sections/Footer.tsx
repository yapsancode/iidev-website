// 📁 components/sections/Footer.tsx
import React from "react";
import { Mail, Linkedin } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import {
  BRAND_NAME,
  CONTACT_EMAIL,
  WHATSAPP_DISPLAY,
  WHATSAPP_URL,
} from "@/lib/site-config";

const Footer: React.FC = () => {
  return (
    <footer className="py-12 bg-[#FAFAFA] dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">

        {/* Left – Brand & copyright */}
        <div className="text-center md:text-left">
          <span className="text-lg font-bold text-neutral-900 dark:text-white">
            {BRAND_NAME}<span className="text-emerald-500">.</span>
          </span>
          <p className="text-neutral-400 dark:text-neutral-500 text-sm mt-1">
            © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
          </p>
          <p className="text-neutral-400 dark:text-neutral-500 text-xs mt-0.5">
            IIDEV STUDIO · SSM Reg. 202603215168 (CA0426006-D)
          </p>
        </div>

        {/* Middle – Visible contact details (trust signal + answer-engine friendly) */}
        <div className="flex flex-col items-center gap-1.5 text-sm md:items-start">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 dark:text-neutral-400 hover:text-emerald-500 transition-colors"
          >
            WhatsApp: {WHATSAPP_DISPLAY}
          </a>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-neutral-500 dark:text-neutral-400 hover:text-emerald-500 transition-colors"
          >
            {CONTACT_EMAIL}
          </a>
          <p className="text-neutral-400 dark:text-neutral-500">
            Serving service businesses across Malaysia
          </p>
        </div>

        {/* Right – Social / quick-contact icons */}
        <div className="flex items-center gap-8">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-emerald-500 transition-colors"
            aria-label="Chat with us on WhatsApp"
          >
            <WhatsAppIcon size={22} />
          </a>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-neutral-400 hover:text-emerald-500 transition-colors"
            aria-label="Email us"
          >
            <Mail size={22} />
          </a>
          <a
            href="https://www.linkedin.com/company/iidevstudio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-emerald-500 transition-colors"
            aria-label={`${BRAND_NAME} on LinkedIn`}
          >
            <Linkedin size={22} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;