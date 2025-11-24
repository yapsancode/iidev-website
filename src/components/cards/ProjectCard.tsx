// 📁 components/cards/ProjectCard.tsx
import { ExternalLink } from 'lucide-react';

interface ProjectCardProps {
  name: string;
  result: string;
  image: string;
  tags: string[];
}

export default function ProjectCard({ name, result, image, tags }: ProjectCardProps) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
      <div className="relative h-64 bg-gray-100 overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-8 space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-2xl font-bold">{name}</h3>
          <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
        </div>
        
        <p className="text-emerald-600 font-semibold text-lg">{result}</p>
        
        <div className="flex flex-wrap gap-2 pt-2">
          {tags.map((tag, i) => (
            <span 
              key={i}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}