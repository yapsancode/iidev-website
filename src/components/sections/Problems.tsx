import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";

export default function ProblemsSection() {
  const problems = [
    {
      text: "Loads slower than LRT during rush hour",
      impact: "80% of visitors leave before your site even loads"
    },
    {
      text: "Looks like it was designed in 2005 (or by someone's cousin for free)",
      impact: "People judge your business in 0.05 seconds"
    },
    {
      text: "Not mobile-friendly — 70%+ of your customers are on phones and they leave instantly",
      impact: "Missing out on 7 out of 10 potential customers"
    },
    {
      text: "Zero bookings, enquiries, or sales coming in (traffic ada, money tak ada)",
      impact: "Your competitors are eating your lunch"
    },
    {
      text: "You're malu to even share the link with customers",
      impact: "Lost word-of-mouth and social media opportunities"
    },
    {
      text: "Every small change (price, phone number, address) costs RM500+ and 3 weeks of waiting",
      impact: "You're trapped and bleeding money"
    },
  ];

  return (
    <section className="relative bg-[#FAFAFA] dark:bg-neutral-900 py-16 px-6 md:py-24 overflow-hidden">

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header with emoji and stronger hook */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <XCircle className="w-4 h-4" />
            The Silent Business Killer
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Is your website <span className="text-red-600">costing</span> you customers?
          </h2>
          <p className="text-xl text-gray-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed">
            If you're nodding "yes" to <span className="font-semibold text-gray-800 dark:text-neutral-200">even ONE</span> of these,
            you're bleeding money every single day.
          </p>
        </div>

        {/* Enhanced problem cards with impact statements */}
        <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto mb-12">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="group relative bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm border border-gray-200
                         dark:border-neutral-700 hover:shadow-xl hover:border-red-300 dark:hover:border-red-500 hover:-translate-y-1 
                         transition-all duration-300 ease-out"
            >
              {/* Problem number badge */}
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-red-500 text-white rounded-full 
                            flex items-center justify-center text-sm font-bold shadow-lg
                            group-hover:scale-110 transition-transform">
                {index + 1}
              </div>

              <div className="flex items-start gap-4">
                <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1 
                                   group-hover:rotate-12 transition-transform" />
                <div className="flex-1">
                  <p className="text-gray-800 dark:text-neutral-200 font-medium leading-relaxed mb-2">
                    {problem.text}
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-400 font-semibold flex items-center gap-1">
                    <ArrowRight className="w-4 h-4" />
                    {problem.impact}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Strong CTA box with statistics */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 rounded-3xl p-8 md:p-10 
                        shadow-2xl border border-gray-700 dark:border-neutral-800 relative overflow-hidden">
            {/* Accent gradient */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl" />

            <div className="relative z-10 text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                It doesn't have to be this way.
              </h3>
              <p className="text-lg md:text-xl text-gray-300 dark:text-neutral-300 mb-6 leading-relaxed max-w-2xl mx-auto">
                A fast, modern, mobile-friendly website can <span className="text-red-400 font-bold">2x–5x</span> your
                leads and sales in weeks — not months.
              </p>

              {/* Mini stats */}
              <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto pt-6 border-t border-gray-700 dark:border-neutral-800">
                <div>
                  <div className="text-3xl font-bold text-red-400 mb-1">3 sec</div>
                  <div className="text-sm text-gray-400 dark:text-neutral-400">Load time target</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-400 mb-1">100%</div>
                  <div className="text-sm text-gray-400 dark:text-neutral-400">Mobile optimized</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-400 mb-1">5 min</div>
                  <div className="text-sm text-gray-400 dark:text-neutral-400">To update content</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}