// 📁 lib/types.ts
export interface Problem {
  problem: string;
  solution: string;
  icon: React.ReactNode;
}

export interface Project {
  name: string;
  result: string;
  image: string;
  tags: string[];
}

export interface TeamMember {
  name: string;
  role: string;
  gradient: string;
}

export interface Service {
  title: string;
  price: string;
  description: string;
}