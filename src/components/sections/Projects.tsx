// 📁 components/sections/Projects.tsx
import ProjectCard from '@/components/cards/ProjectCard';
import { projects } from '@/lib/data';

export default function Projects() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl md:text-6xl font-bold text-center mb-20 tracking-tight">
          Recent projects
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
}