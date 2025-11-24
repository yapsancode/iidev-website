// 📁 components/cards/ServiceCard.tsx
interface ServiceCardProps {
  title: string;
  price: string;
  description: string;
}

export default function ServiceCard({ title, price, description }: ServiceCardProps) {
  return (
    <div className="bg-white rounded-2xl p-10 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-gray-100 hover:border-emerald-500 space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-4xl font-bold text-emerald-600">{price}</p>
      </div>
      <p className="text-gray-600 text-lg leading-relaxed">
        {description}
      </p>
    </div>
  );
}