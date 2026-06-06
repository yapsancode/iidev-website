// 📁 lib/data.ts

export interface Project {
  title: string;
  category: string;
  image: string;
  result?: string;
  tags: string[];
  link?: string;
}

export const projects: Project[] = [
  {
    title: "Locum Connect",
    category: "Mobile App",
    image: "/images/locum-connect.png",
    tags: ["Expo", "React", "Spring Boot"],
    link: "https://locum-connect.com/"
  },
  {
    title: "Klinik Mekar Website",
    category: "Healthcare Platform",
    image: "/images/klinik-mekar-landingpage.png",
    // result: "+240% User Signups",
    tags: ["Next.js", "Tailwind", "Spring Boot"],
    link: "https://klinikmekar.com"
  },
];