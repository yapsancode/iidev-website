// 📁 lib/data.ts
import { Zap, Palette, Clock } from 'lucide-react';

export interface Project {
  title: string;
  category: string;
  image: string;
  result?: string;
  tags: string[];
  link?: string;
}

export const problems = [
  {
    problem: "Slow loading times",
    solution: "95–100 Lighthouse scores",
    icon: <Zap className="w-6 h-6" />
  },
  {
    problem: "Generic design",
    solution: "Custom premium UI",
    icon: <Palette className="w-6 h-6" />
  },
  {
    problem: "Endless revisions",
    solution: "Fixed price & timeline",
    icon: <Clock className="w-6 h-6" />
  }
];

export const projects: Project[] = [
  {
    title: "Klinik Mekar Website",
    category: "Healthcare Platform",
    image: "images/klinik-mekar-landingpage.png",
    // result: "+240% User Signups",
    tags: ["Next.js", "Tailwind", "Spring Boot"],
    link: "https://klinikmekar.com"
  },
];

export const teamMembers = [
  {
    name: "Alex Chen",
    role: "Full-stack Engineer",
    gradient: "bg-gradient-to-br from-emerald-400 to-emerald-600"
  },
  {
    name: "Jordan Lee",
    role: "UI/UX Developer",
    gradient: "bg-gradient-to-br from-gray-700 to-gray-900"
  }
];

export const services = [
  {
    title: "Full Website Build",
    price: "From $5,000",
    description: "Custom-designed, lightning-fast website built from scratch with modern tech stack."
  },
  {
    title: "Redesign & Performance",
    price: "From $3,500",
    description: "Transform your existing site into a conversion machine with optimized UX and speed."
  },
  {
    title: "Monthly Growth Retainer",
    price: "$1,200+/mo",
    description: "Continuous optimization, A/B testing, and feature development to scale your business."
  }
];