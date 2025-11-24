// 📁 components/sections/Footer.tsx
import React from 'react';
import { Mail, Linkedin, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 bg-white border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div className="text-center md:text-left">
          <span className="text-lg font-bold text-neutral-900">iidev<span className="text-emerald-500">.</span></span>
          <p className="text-neutral-400 text-sm mt-1">© 2025 iidev studio. All rights reserved.</p>
        </div>

        <div className="flex items-center gap-6">
          <a href="#" className="text-neutral-400 hover:text-emerald-500 transition-colors">
            <Mail size={20} />
          </a>
          <a href="#" className="text-neutral-400 hover:text-emerald-500 transition-colors">
            <Linkedin size={20} />
          </a>
          <a href="#" className="text-neutral-400 hover:text-emerald-500 transition-colors">
            <Twitter size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;