import React from 'react';
import Image from 'next/image';
import { order } from '@/components/site/chrome';

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
    <section id="team" className="wrap cols part">
      <div className="part-head">
        <h2 className="display is-small" data-reveal>
          Just two dedicated developers.<br />
          <span className="muted">No middlemen. No surprises.</span>
        </h2>
        <p data-reveal style={order(1)}>
          Direct access to the founders shipping your code.
        </p>
      </div>

      <div className="part-body people">
        {members.map((member, index) => (
          <TeamCard key={member.name} member={member} index={index} />
        ))}
      </div>
    </section>
  );
};

// Everything is visible without hovering, so it reads the same on a phone.
const TeamCard: React.FC<{ member: TeamMember; index: number }> = ({ member, index }) => {
  return (
    <article className="person" data-reveal style={order(index)}>
      <div className="person-photo">
        {member.image ? (
          <Image
            src={member.image}
            alt={`${member.name}, ${member.role} at IIDev Studio`}
            fill
            sizes="(max-width: 559px) 100vw, 30vw"
          />
        ) : (
          <span className="display person-initials" aria-hidden="true">
            {getInitials(member.name)}
          </span>
        )}
      </div>

      <h3 className="display">{member.name}</h3>
      <p className="person-role">{member.role}</p>
      <dl>
        <dt>Fun fact</dt>
        <dd>{member.funFact}</dd>
      </dl>
    </article>
  );
};

export default Team;
