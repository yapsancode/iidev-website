"use client"
import React from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { motion } from 'framer-motion';

interface Project {
  title: string;
  category: string;
  image: string;
  result: string;
  tags: string[];
}

const projects: Project[] = [
  {
    title: "FinFlow SaaS",
    category: "Fintech Platform",
    image: "https://picsum.photos/id/1/800/600",
    result: "+240% User Signups",
    tags: ["Next.js", "Tailwind", "Stripe"]
  },
  {
    title: "Lumina Interiors",
    category: "E-Commerce",
    image: "https://picsum.photos/id/180/800/600",
    result: "0.8s Load Time",
    tags: ["Shopify Headless", "Framer Motion"]
  },
  {
    title: "Apex Logistics",
    category: "Corporate Site",
    image: "https://picsum.photos/id/20/800/600",
    result: "2x Lead Generation",
    tags: ["React", "TypeScript", "GSAP"]
  },
  {
    title: "HealthCore",
    category: "Medical App",
    image: "https://picsum.photos/id/48/800/600",
    result: "HIPAA Compliant",
    tags: ["Next.js", "Postgres", "Tailwind"]
  }
];

const Portfolio: React.FC = () => {
  return (
    <section id="work" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 mb-4">
              Recent projects
            </h2>
            <p className="text-neutral-500 text-lg">
              Hand-picked work that drove real business results.
            </p>
          </div>
          <a href="#" className="hidden md:flex items-center gap-2 text-emerald-500 font-medium hover:gap-3 transition-all">
            View all projects <ExternalLink size={18} />
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-2xl mb-6 bg-neutral-100 aspect-[4/3]">
                <img
                  src={project.image}
                  alt={project.title}
                  className="object-cover w-full h-full transform transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-neutral-900 shadow-sm">
                    {project.result}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-2xl font-bold text-neutral-900 group-hover:text-emerald-500 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-neutral-500">{project.category}</p>
                </div>
                <div className="p-2 rounded-full border border-neutral-200 text-neutral-400 group-hover:border-emerald-500 group-hover:text-emerald-500 transition-colors">
                  <ExternalLink size={20} />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span key={tag} className="text-xs font-medium text-neutral-500 bg-neutral-100 px-2 py-1 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center md:hidden">
          <a href="#" className="inline-flex items-center gap-2 text-emerald-500 font-medium">
            View all projects <ExternalLink size={18} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;