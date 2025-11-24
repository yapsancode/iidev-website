// 📁 components/cards/TeamMember.tsx
interface TeamMemberProps {
  name: string;
  role: string;
  gradient: string;
}

export default function TeamMember({ name, role, gradient }: TeamMemberProps) {
  return (
    <div className="text-center space-y-4">
      <div className={`w-32 h-32 rounded-full ${gradient} mx-auto hover:scale-110 transition-transform duration-300 shadow-xl`} />
      <div>
        <h3 className="text-2xl font-bold">{name}</h3>
        <p className="text-gray-600">{role}</p>
      </div>
    </div>
  );
}