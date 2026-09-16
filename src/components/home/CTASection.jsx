import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import Button from '../common/Button';

export const CTASection = () => {
  return (
    <section className="relative overflow-hidden py-20 md:py-28 bg-[#CCD5AE]/40 border-b border-[#DDCBA4]/50 text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAEDCD] text-[#2A2923] text-xs font-semibold border border-[#DDCBA4]">
          <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
          <span>Made for You • ਹੱਥੀਂ ਬੁਣਿਆ</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#2A2923] leading-tight">
          Find a sweater that feels like it was{' '}
          <span className="italic text-[#D4A373]">crafted exclusively for you.</span>
        </h2>

        <p className="text-sm sm:text-base text-[#686558] max-w-2xl mx-auto leading-relaxed">
          Whether you desire our signature cable-knit pullover or wish to commission a bespoke
          hand-embroidered creation, our master artisans are at your service.
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Link to="/clothing">
            <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
              Explore All Knitwear
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="warm" size="lg">
              Commission Bespoke Knit
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
