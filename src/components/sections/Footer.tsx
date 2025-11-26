// 📁 components/sections/Footer.tsx
import React from "react";
import { Mail, Linkedin } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="py-12 bg-white border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">

        {/* Left – Brand & copyright */}
        <div className="text-center md:text-left">
          <span className="text-lg font-bold text-neutral-900">
            iidev<span className="text-emerald-500">.</span>
          </span>
          <p className="text-neutral-400 text-sm mt-1">
            © {new Date().getFullYear()} iidev studio. All rights reserved.
          </p>
        </div>

        {/* Right – Icons only */}
        <div className="flex items-center gap-8">
          <a
            href="mailto:team.iidevstudio@gmail.com"
            className="text-neutral-400 hover:text-emerald-500 transition-colors"
            aria-label="Email us"
          >
            <Mail size={22} />
          </a>
          <a
            href="https://www.linkedin.com/in/iidev-studio"
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