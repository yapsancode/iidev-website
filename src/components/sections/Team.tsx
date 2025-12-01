"use client"
import React from 'react';
import { motion } from 'framer-motion';

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  alt: string;
  funFact: string;
}

const members: TeamMember[] = [
  {
    name: "Imran Ariff",
    role: "Co-Founder & Tech Lead",
    // Using placeholder since local image won't load in this environment, 
    // but in a real app, this would be "/images/imran-ariff.jpg"
    image: "https://picsum.photos/400/500?random=1",
    alt: "Imran Ariff",
    funFact: "Can debug complex race conditions while sleepwalking. Fueled entirely by iced americanos."
  },
  {
    name: "Isyraf Afifi",
    role: "Co-Founder & Product",
    // Using placeholder since local image won't load in this environment
    image: "/images/isyraf-afifi.jpg",
    alt: "Isyraf Afifi",
    funFact: "Collects vintage mechanical keyboards and claims he can hear the difference between 62g and 67g switches."
  },
];

const Team: React.FC = () => {
  return (
    <section id="team" className="py-24 bg-[#FAFAFA] border-y border-neutral-100 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-neutral-900 mb-6 tracking-tight"
          >
            Just two dedicated developers.<br />
            <span className="text-neutral-400">No middlemen. No surprises.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-neutral-500 max-w-2xl mx-auto"
          >
            Direct access to the founders shipping your code.
            Hover over the cards to learn a bit more about the humans behind the screen.
          </motion.p>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12 perspective-container">
          {members.map((member, index) => (
            <TeamCard key={member.name} member={member} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

interface TeamCardProps {
  member: TeamMember;
  index: number;
}

const TeamCard: React.FC<TeamCardProps> = ({ member, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: -10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        delay: index * 0.2,
        type: "spring",
        stiffness: 100,
        damping: 20
      }}
      className="group h-[420px] w-full max-w-[320px] [perspective:1000px]"
    >
      <div className="relative h-full w-full transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] shadow-xl rounded-2xl">

        {/* Front Face */}
        <div className="absolute inset-0 h-full w-full rounded-2xl bg-white [backface-visibility:hidden] overflow-hidden border border-neutral-200">
          <div className="h-full w-full relative">
            <img
              src={member.image}
              alt={member.alt}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Text Content */}
            <div className="absolute bottom-0 left-0 w-full p-6 text-left">
              <h3 className="text-2xl font-bold text-white mb-1">{member.name}</h3>
              <p className="text-sm font-medium text-neutral-300 uppercase tracking-wider">{member.role}</p>
            </div>
          </div>
        </div>

        {/* Back Face */}
        <div className="absolute inset-0 h-full w-full rounded-2xl bg-neutral-900 px-8 text-center text-slate-200 [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col items-center justify-center border border-neutral-700 shadow-inner">
          <div className="mb-6 h-12 w-12 rounded-full bg-neutral-800 flex items-center justify-center text-2xl">
            💡
          </div>
          <h4 className="text-lg font-semibold text-white mb-4">Fun Fact</h4>
          <p className="text-neutral-300 leading-relaxed font-light italic">
            "{member.funFact}"
          </p>
          <div className="mt-8 pt-6 border-t border-neutral-800 w-full">
            <span className="text-xs font-bold tracking-widest uppercase text-neutral-500">iidev studio</span>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default Team;