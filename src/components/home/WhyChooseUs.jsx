import React from 'react';
import { Feather, Scissors, Sparkles, CheckCircle2 } from 'lucide-react';

const FEATURES = [
  {
    icon: Feather,
    title: '100% Handcrafted',
    description: 'Every sweater is hand-knitted on wooden needles by master artisans, never mass-produced.',
  },
  {
    icon: Scissors,
    title: 'Bespoke Sizing & Initials',
    description: 'Custom measurements and personalized monogramming available for a true bespoke fit.',
  },
  {
    icon: Sparkles,
    title: 'Grade-A Pure Wool',
    description: 'We source only cruelty-free Himalayan Cashmere and Australian Merino wool for enduring warmth.',
  },
  {
    icon: CheckCircle2,
    title: 'Heirloom Longevity',
    description: 'Dense multi-ply knit structures engineered to retain shape and softness across generations.',
  },
];

export const WhyChooseUs = () => {
  return (
    <section className="py-16 md:py-24 bg-[#FDFBF7] border-b border-[#DDCBA4]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.2em] text-[#D4A373] font-semibold">
            The Sandh Standard
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2A2923] mt-2">
            Why Discerning Clients Choose Us
          </h2>
          <p className="text-sm text-[#686558] mt-2">
            Honoring honest textile craftsmanship, ethical sourcing, and uncompromising winter
            warmth.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="p-6 bg-[#FAEDCD]/30 hover:bg-[#FAEDCD]/70 border border-[#DDCBA4]/60 rounded-sm transition-all duration-300 hover:shadow-warm-sm group"
              >
                <div className="w-12 h-12 rounded-full bg-[#E9EDC9] border border-[#CCD5AE] flex items-center justify-center text-[#D4A373] group-hover:scale-110 transition-transform mb-5">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-base font-semibold text-[#2A2923] mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs text-[#686558] leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
