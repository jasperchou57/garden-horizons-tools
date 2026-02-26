import { HelpCircle, Calculator, Leaf, TrendingUp, AlertTriangle, Users, CheckCircle } from 'lucide-react';

const faqs = [
  {
    question: "What is Garden Horizons?",
    answer: "Garden Horizons is a Roblox game where you plant, grow, and sell plants to earn in-game currency (Shillings). The goal is to maximize your profits by choosing the right plants and timing your harvests.",
  },
  {
    question: "What do the growth stages mean?",
    answer: "There are three growth stages:\n• **Unripe (0.5x)**: Plant is not fully grown - you'll lose 50% of potential value\n• **Ripened (1x)**: Plant is ready to harvest - full base value\n• **Lush (1.5x)**: Plant is fully mature with bonus - highest value (requires staying online during growth)",
  },
  {
    question: "How do mutations work?",
    answer: "Mutations are special bonuses that multiply your plant's sell value. Some mutations are:\n• **Stackable**: Can combine with other stackable mutations\n• **Exclusive**: Only one non-stackable mutation can apply at a time\n\nMutations trigger randomly during gameplay (weather events, rare spawns, etc.).",
  },
  {
    question: "What is ROI and why does it matter?",
    answer: "ROI (Return on Investment) shows how much profit you make relative to your initial cost. Formula: `(Sell Price - Cost) / Cost × 100%`. A higher ROI means more efficient use of your money.",
  },
  {
    question: "What is Profit Per Hour?",
    answer: "Profit per hour calculates how much you earn factoring in grow time. It's crucial for short play sessions - a plant with high ROI but long grow time might earn less per hour than a faster plant.",
  },
  {
    question: "Should I wait for Lush stage?",
    answer: "Generally yes! Lush stage gives 50% bonus over ripened. However, if you're about to log off or the grow time is very long, you might want to harvest at ripened to start your next cycle.",
  },
  {
    question: "How accurate is the data?",
    answer: "We use a confidence system:\n• **A (Green)**: High trust - verified through 3+ tests\n• **B (Yellow)**: Medium trust - 1-2 tests\n• **C (Red)**: Initial data - needs community verification\n\nAll data includes source attribution. Help us improve by submitting corrections!",
  },
  {
    question: "How do I use the Planner?",
    answer: "The Planner helps you decide what to plant based on your situation:\n1. Enter your budget (how much you can spend)\n2. Enter your playtime (how long you'll be online)\n3. Select your goal (maximize profit/hour, ROI, or total profit)\n4. Get personalized recommendations!",
  },
  {
    question: "Can I save my calculations?",
    answer: "Yes! Click 'Save Plan' in the Calculator to save your setup. Saved plans appear in the My Plans page where you can track your best strategies and compare performance.",
  },
  {
    question: "How do I contribute data?",
    answer: "We welcome community contributions! Data is collected through:\n1. Self-testing in-game\n2. Community cross-checking\n3. Wiki verification\n\nLook for the 'Submit Data' feature coming soon!",
  },
  {
    question: "What's the best plant for beginners?",
    answer: "For beginners, we recommend starting with plants that have:\n• Low cost (under 500 coins)\n• Short grow time (under 5 minutes)\n• High ROI\n\nCheck the Calculator for current recommendations based on your budget.",
  },
  {
    question: "Is this affiliated with the game developers?",
    answer: "No, Garden Horizons Tools is an independent fan-made tool. We are not affiliated with or endorsed by the game developers.",
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-green/10 text-accent-green text-sm mb-4">
              <HelpCircle className="w-4 h-4" />
              Help
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Frequently Asked <span className="text-accent-green">Questions</span>
            </h1>
            <p className="text-text-muted max-w-2xl mx-auto">
              Everything you need to know about Garden Horizons and how to maximize your profits.
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="#growth-stages" className="bg-surface border border-border rounded-xl p-4 text-center hover:border-accent-green/30 transition-colors">
              <Leaf className="w-6 h-6 text-accent-green mx-auto mb-2" />
              <div className="font-medium">Growth Stages</div>
            </a>
            <a href="#mutations" className="bg-surface border border-border rounded-xl p-4 text-center hover:border-accent-green/30 transition-colors">
              <TrendingUp className="w-6 h-6 text-accent-green mx-auto mb-2" />
              <div className="font-medium">Mutations</div>
            </a>
            <a href="#roi" className="bg-surface border border-border rounded-xl p-4 text-center hover:border-accent-green/30 transition-colors">
              <Calculator className="w-6 h-6 text-accent-green mx-auto mb-2" />
              <div className="font-medium">ROI</div>
            </a>
            <a href="#data" className="bg-surface border border-border rounded-xl p-4 text-center hover:border-accent-green/30 transition-colors">
              <CheckCircle className="w-6 h-6 text-accent-green mx-auto mb-2" />
              <div className="font-medium">Data Accuracy</div>
            </a>
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="bg-surface border border-border rounded-xl group"
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                  <span className="font-medium pr-4">{faq.question}</span>
                  <span className="w-6 h-6 rounded-full bg-background flex items-center justify-center group-open:rotate-180 transition-transform">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <div className="px-5 pb-5 text-text-muted whitespace-pre-line">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="bg-surface border border-border rounded-xl p-6 text-center">
            <h3 className="font-bold text-lg mb-2">Still have questions?</h3>
            <p className="text-text-muted mb-4">
              Can't find the answer you're looking for? Reach out to our community!
            </p>
            <div className="flex items-center justify-center gap-4">
              <a
                href="https://discord.gg/gardenhorizons"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#5865F2] text-white font-medium hover:bg-[#4752C4] transition-colors"
              >
                <Users className="w-4 h-4" />
                Join Discord
              </a>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-surface/50 border border-border rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-accent-gold flex-shrink-0 mt-0.5" />
            <div className="text-sm text-text-muted">
              <p className="font-medium text-foreground mb-1">Disclaimer</p>
              <p>
                This tool is fan-made and not affiliated with Garden Horizons or Roblox Corporation. 
                Game data may change with updates. Always verify important information in-game.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
