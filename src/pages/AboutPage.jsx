import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Feather, ShieldCheck, ArrowRight } from 'lucide-react';
import Button from '../components/common/Button';

export const AboutPage = () => {
  return (
    <div className="space-y-20 md:space-y-28 pb-20">
      {/* Hero Header */}
      <section className="relative py-20 md:py-28 bg-[#FAEDCD]/40 border-b border-[#DDCBA4]/40 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs uppercase tracking-[0.25em] text-[#D4A373] font-semibold">
            ਸਾਡੀ ਕਹਾਣੀ • Our Heritage Story
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[#2A2923] leading-tight">
            Born in the Winter Heart <br />
            <span className="italic font-normal text-[#D4A373]">of Punjab’s Textile Artisans</span>
          </h1>
          <p className="text-sm sm:text-base text-[#686558] max-w-2xl mx-auto leading-relaxed pt-2">
            Sandh Boutique was founded on a simple, uncompromising premise: that true winter luxury
            cannot be manufactured by automated assembly lines. It must be felt through human hands,
            patient needlework, and heirloom fiber.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-[0.2em] text-[#D4A373] font-semibold">
              The Slow Fashion Ethos
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2A2923]">
              Every Stitched Row Has a Voice
            </h2>
            <p className="text-xs sm:text-sm text-[#686558] leading-relaxed">
              In an era dominated by synthetic fast fashion that falls apart in a single season,
              Sandh Boutique revives the dignified patience of slow knitting. Our artisans in
              Amritsar and across Punjab take between 28 and 48 hours to create a single sweater.
            </p>
            <p className="text-xs sm:text-sm text-[#686558] leading-relaxed">
              We reject petroleum-based acrylics and synthetics. We work exclusively with certified
              cruelty-free Himalayan Cashmere, dense Australian Merino wool, and fine silk blends
              that naturally regulate temperature and insulate against biting sub-zero winds.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="aspect-[4/3] rounded-sm overflow-hidden border border-[#DDCBA4] shadow-warm-md bg-[#CCD5AE]">
              <img
                src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80"
                alt="Artisan weaving wool fibers"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* The 4-Stage Crafting Process */}
      <section className="bg-[#E9EDC9]/30 py-16 md:py-24 border-y border-[#DDCBA4]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.2em] text-[#D4A373] font-semibold">
              From Fleece to Garment
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2A2923] mt-2">
              Our Artisanal Process
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#FDFBF7] p-6 border border-[#DDCBA4] rounded-sm space-y-3 shadow-sm">
              <span className="font-serif text-3xl font-bold text-[#D4A373]">01</span>
              <h3 className="font-serif text-base font-semibold text-[#2A2923]">Fiber Selection</h3>
              <p className="text-xs text-[#686558] leading-relaxed">
                Hand-grading 15-micron Himalayan Cashmere and multi-ply Australian Merino for optimal
                loft and warmth.
              </p>
            </div>

            <div className="bg-[#FDFBF7] p-6 border border-[#DDCBA4] rounded-sm space-y-3 shadow-sm">
              <span className="font-serif text-3xl font-bold text-[#D4A373]">02</span>
              <h3 className="font-serif text-base font-semibold text-[#2A2923]">Botanical Dyeing</h3>
              <p className="text-xs text-[#686558] leading-relaxed">
                Natural mineral and plant-based bath infusions creating rich earthy camel, sage, and
                terracotta tones.
              </p>
            </div>

            <div className="bg-[#FDFBF7] p-6 border border-[#DDCBA4] rounded-sm space-y-3 shadow-sm">
              <span className="font-serif text-3xl font-bold text-[#D4A373]">03</span>
              <h3 className="font-serif text-base font-semibold text-[#2A2923]">Hand Knitting</h3>
              <p className="text-xs text-[#686558] leading-relaxed">
                Seamless ergonomic needle shaping using traditional wooden pins to form durable moss
                and diamond cables.
              </p>
            </div>

            <div className="bg-[#FDFBF7] p-6 border border-[#DDCBA4] rounded-sm space-y-3 shadow-sm">
              <span className="font-serif text-3xl font-bold text-[#D4A373]">04</span>
              <h3 className="font-serif text-base font-semibold text-[#2A2923]">Artisan Quality Audit</h3>
              <p className="text-xs text-[#686558] leading-relaxed">
                Rigorous tension checks, hand-stitched horn buttons, and careful steam-finishing
                before packaging.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Commissions Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 md:p-14 bg-[#FAEDCD]/50 border border-[#DDCBA4] rounded-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs uppercase tracking-[0.2em] text-[#D4A373] font-semibold">
              Bespoke Studio
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2A2923]">
              Wish to Commission a Custom Sweater?
            </h3>
            <p className="text-xs sm:text-sm text-[#686558] leading-relaxed">
              Have your initials monogrammed, select custom chest measurements, or co-design a
              one-of-a-kind Fair Isle pattern with our head knitter.
            </p>
          </div>

          <div className="flex gap-4">
            <Link to="/contact">
              <Button variant="primary" size="md" icon={ArrowRight} iconPosition="right">
                Inquire for Bespoke
              </Button>
            </Link>
            <Link to="/clothing">
              <Button variant="outline" size="md">
                View Collection
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
