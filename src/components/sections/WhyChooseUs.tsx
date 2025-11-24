// components/WhyChooseMe.tsx
import { motion } from "framer-motion";
import { Check, Clock, MessageSquare, Smartphone, TrendingUp, Wallet } from "lucide-react";
import WhatsAppButton from "../buttons/WhatsAppButton";

export default function WhyChooseUs() {
    const reasons = [
        {
            icon: <Clock className="w-8 h-8 text-blue-600" />,
            title: "Done in 10–14 days (not 2–6 months)",
            desc: "Most freelancers or agencies drag your project forever. We deliver your complete website in 2 weeks or less — guaranteed.",
        },
        {
            icon: <Smartphone className="w-8 h-8 text-blue-600" />,
            title: "100% mobile-friendly + lightning fast",
            desc: "Your customers use phones. We make sure your site looks perfect and loads in <2 seconds on Maxis, Digi, or even slow kampung Wi-Fi.",
        },
        {
            icon: <MessageSquare className="w-8 h-8 text-blue-600" />,
            title: "You can WhatsApp us directly (reply in minutes)",
            desc: "No account manager, no ticket system. Message us on WhatsApp anytime — We answer fast, even nights and weekends.",
        },
        {
            icon: <Wallet className="w-8 h-8 text-blue-600" />,
            title: "Fixed price, zero hidden costs",
            desc: "You know the exact price from day 1. No surprise “hosting fee”, “maintenance fee”, or “extra revision” charges.",
        },
        {
            icon: <TrendingUp className="w-8 h-8 text-blue-600" />,
            title: "Built to get you more calls & sales",
            desc: "This is not just a pretty website. We design it to turn visitors into paying customers (Google-friendly + strong call-to-actions).",
        },
        {
            icon: <Check className="w-8 h-8 text-blue-600" />,
            title: "You own everything + easy to update yourself",
            desc: "After launch, you can change text, photos, prices yourself (no need to call us or pay extra). I’ll even record a 10-minute training video for you.",
        },
    ];

    return (
        <section className="py-16 px-6 md:py-20 bg-white">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Why work with us instead of the other 1,000 freelancers?
                    </h2>
                    <p className="text-lg text-gray-600 mt-4">
                        Simple: We remove all the usual pain of getting a website done.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reasons.map((reason, index) => (
                        <div
                            key={index}
                            className="flex flex-col bg-gray-50 rounded-xl p-6 hover:bg-blue-50 hover:shadow-md transition-all duration-300 border border-gray-100"
                        >
                            <div className="mb-4">{reason.icon}</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {reason.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {reason.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}