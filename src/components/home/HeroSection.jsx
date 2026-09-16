import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Button from '../common/Button';

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAEDCD]/40 via-[#FDFBF7] to-[#FDFBF7] pt-8 pb-16 md:pt-14 md:pb-24 border-b border-[#DDCBA4]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Typography & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Heritage Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E9EDC9] border border-[#CCD5AE] text-xs font-semibold text-[#2A2923]">
              <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>ਸੰਧ ਬੁਟੀਕ • Heirloom Winter Knitwear 2026</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2A2923] leading-[1.15] tracking-tight">
              Handcrafted Warmth, <br />
              <span className="italic font-normal text-[#D4A373]">
                Woven with Heritage & Care.
              </span>
            </h1>

            {/* Narrative Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-[#686558] max-w-xl leading-relaxed">
              Every sweater at Sandh Boutique is individually hand-knitted by master artisans using
              100% pure Himalayan Cashmere and Australian Merino wool. Create bespoke custom designs
              that feel like they were made exclusively for you.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link to="/clothing">
                <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
                  Shop Collection
                </Button>
              </Link>
              <Link to="/clothing?category=Custom+Designs">
                <Button variant="warm" size="lg">
                  Explore Custom Designs
                </Button>
              </Link>
            </div>

            {/* Atelier Trust Indicators */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#DDCBA4]/50 text-left">
              <div>
                <p className="font-serif text-xl sm:text-2xl font-bold text-[#2A2923]">100%</p>
                <p className="text-[11px] text-[#686558] mt-0.5">Handmade Knitwear</p>
              </div>
              <div>
                <p className="font-serif text-xl sm:text-2xl font-bold text-[#2A2923]">32+ Hrs</p>
                <p className="text-[11px] text-[#686558] mt-0.5">Crafted per Piece</p>
              </div>
              <div>
                <p className="font-serif text-xl sm:text-2xl font-bold text-[#2A2923]">Bespoke</p>
                <p className="text-[11px] text-[#686558] mt-0.5">Custom Sizing & Initials</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Hero Visual Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative warm glow back-layer */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#CCD5AE]/40 to-[#FAEDCD]/70 rounded-2xl filter blur-xl opacity-70 -z-10" />

              {/* Main Luxury Imagery */}
              <div className="relative rounded-sm overflow-hidden border border-[#DDCBA4] shadow-warm-lg aspect-[4/5] bg-[#FAEDCD]">
                <img
                  src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=85"
                  alt="Sandh Boutique Handcrafted Winter Sweater"
                  className="w-full h-full object-cover object-center"
                />

                {/* Floating Highlight Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-[#FDFBF7]/90 backdrop-blur-md p-3.5 rounded-sm border border-[#DDCBA4] shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#D4A373] font-bold">
                      Artisan Spotlight
                    </span>
                    <h4 className="text-xs font-serif font-semibold text-[#2A2923]">
                      Cashmere Diamond Cable
                    </h4>
                    <p className="text-[11px] text-[#686558]">Grade-A Himalayan Wool</p>
                  </div>
                  <Link
                    to="/clothing?category=Winter+Sweaters"
                    className="text-xs font-semibold text-[#D4A373] hover:underline"
                  >
                    View →
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
