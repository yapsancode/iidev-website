// 📁 lib/data.ts
import { Zap, Palette, Clock } from 'lucide-react';

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

export const projects = [
  {
    name: "TechFlow SaaS",
    result: "+240% conversions",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    tags: ["Next.js", "Tailwind", "Framer Motion"]
  },
  {
    name: "Luxe Real Estate",
    result: "50% faster load time",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
    tags: ["React", "TypeScript", "Sanity CMS"]
  },
  {
    name: "FitCore App",
    result: "+180% mobile engagement",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop",
    tags: ["Next.js", "Supabase", "Stripe"]
  },
  {
    name: "Artisan Marketplace",
    result: "$2M+ in sales",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=600&fit=crop",
    tags: ["Shopify", "React", "Tailwind"]
  }
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