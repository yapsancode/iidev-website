import React from 'react';
import Image from 'next/image';
import { CARD_WHITE, LABEL } from '@/lib/styles';
import { cn } from '@/lib/utils';

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
    // TODO: add a real photo at /images/imran-ariff.jpg — falls back to an
    // initials avatar while empty (never ship a random stock face for a founder)
    image: "",
    alt: "Imran Ariff",
    funFact: "Can debug complex race conditions while sleepwalking. Fueled entirely by iced americanos."
  },
  {
    name: "Isyraf Afifi",
    role: "Co-Founder & Product",
    image: "/images/isyraf-afifi.jpg",
    alt: "Isyraf Afifi",
    funFact: "Collects vintage mechanical keyboards and claims he can hear the difference between 62g and 67g switches."
  },
];

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const Team: React.FC = () => {
  return (
    <section id="team" className="max-w-3xl mx-auto px-6 pb-20">
      <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white mb-5">
        Just two dedicated developers.<br />
        <span className="text-neutral-500 dark:text-neutral-400">No middlemen. No surprises.</span>
      </h2>
      <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed mb-8">
        Direct access to the founders shipping your code.
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        {members.map((member) => (
          <TeamCard key={member.name} member={member} />
        ))}
      </div>
    </section>
  );
};

// Everything is visible without hovering, so it reads the same on a phone.
const TeamCard: React.FC<{ member: TeamMember }> = ({ member }) => {
  return (
    <article className={cn(CARD_WHITE, "flex flex-col")}>
      <div className="relative aspect-[4/3] overflow-hidden border-b-2 border-black bg-emerald-300 dark:border-white dark:bg-emerald-400 sm:aspect-[4/5]">
        {member.image ? (
          <Image
            src={member.image}
            alt={`${member.name}, ${member.role} at IIDev Studio`}
            fill
            sizes="(max-width: 640px) 100vw, 350px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="select-none text-7xl font-extrabold tracking-wide text-black" aria-hidden="true">
              {getInitials(member.name)}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-2xl font-bold leading-tight">{member.name}</h3>
        <p className={cn(LABEL, "mt-2 text-emerald-700 dark:text-emerald-400")}>{member.role}</p>
        <p className={cn(LABEL, "mt-6 text-neutral-600 dark:text-neutral-400")}>Fun fact</p>
        <p className="mt-2 leading-relaxed text-neutral-700 dark:text-neutral-300">
          {member.funFact}
        </p>
      </div>
    </article>
  );
};

export default Team;
