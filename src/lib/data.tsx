// 📁 lib/data.ts

export interface Project {
  title: string;
  category: string;
  image: string;
  link?: string;
}

export const projects: Project[] = [
  {
    title: "Locum Connect",
    category: "Mobile App",
    image: "/images/locum-connect.png",
    link: "https://locum-connect.com/"
  },
  {
    title: "Klinik Mekar Website",
    category: "Healthcare Website",
    image: "/images/klinik-mekar-landingpage.png",
    link: "https://klinikmekar.com"
  },
  {
    title: "KerjaKit",
    category: "Web App",
    image: "/images/kerjakit.png",
    link: "https://kerjakit.com"
  },
];
