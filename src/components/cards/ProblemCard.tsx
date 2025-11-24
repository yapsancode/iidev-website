// 📁 components/cards/ProblemCard.tsx
import { ArrowRight, LucideIcon } from 'lucide-react';

interface ProblemCardProps {
  problem: string;
  solution: string;
  icon: React.ReactNode;
}

export default function ProblemCard({ problem, solution, icon }: ProblemCardProps) {
  return (
    <div className="group bg-white rounded-2xl p-10 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
      <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 text-emerald-600 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div className="space-y-4">
        <p className="text-xl text-gray-500 line-through">{problem}</p>
        <div className="flex items-center gap-2">
          <ArrowRight className="w-5 h-5 text-emerald-500" />
          <p className="text-2xl font-bold text-gray-900">{solution}</p>
        </div>
      </div>
    </div>
  );
}