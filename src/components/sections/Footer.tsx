// 📁 components/sections/Footer.tsx
import React from "react";
import { Mail, Linkedin } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

const Footer: React.FC = () => {
  return (
    <footer className="py-12 bg-[#FAFAFA] dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">

        {/* Left – Brand & copyright */}
        <div className="text-center md:text-left">
          <span className="text-lg font-bold text-neutral-900 dark:text-white">
            iidev<span className="text-emerald-500">.</span>
          </span>
          <p className="text-neutral-400 dark:text-neutral-500 text-sm mt-1">
            © {new Date().getFullYear()} iidev studio. All rights reserved.
          </p>
        </div>

        {/* Middle – Visible contact details (trust signal + answer-engine friendly) */}
        <div className="flex flex-col items-center gap-1.5 text-sm md:items-start">
          <a
            href="https://wa.me/601133506561"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 dark:text-neutral-400 hover:text-emerald-500 transition-colors"
          >
            WhatsApp: +60 11-3350 6561
          </a>
          <a
            href="mailto:team.iidevstudio@gmail.com"
            className="text-neutral-500 dark:text-neutral-400 hover:text-emerald-500 transition-colors"
          >
            team.iidevstudio@gmail.com
          </a>
          <p className="text-neutral-400 dark:text-neutral-500">
            Serving service businesses across Malaysia
          </p>
        </div>

        {/* Right – Social / quick-contact icons */}
        <div className="flex items-center gap-8">
          <a
            href="https://wa.me/601133506561"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-emerald-500 transition-colors"
            aria-label="Chat with us on WhatsApp"
          >
            <WhatsAppIcon size={22} />
          </a>
          <a
            href="mailto:team.iidevstudio@gmail.com"
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
            aria-label="iidev studio on LinkedIn"
          >
            <Linkedin size={22} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;