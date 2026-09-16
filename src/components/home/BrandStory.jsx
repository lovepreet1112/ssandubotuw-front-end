import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Shield, Award } from 'lucide-react';
import Button from '../common/Button';

export const BrandStory = () => {
  return (
    <section className="py-20 md:py-28 bg-[#FDFBF7] border-b border-[#DDCBA4]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Dual Imagery Column */}
          <div className="lg:col-span-6 relative">
            <div className="relative grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[3/4] rounded-sm overflow-hidden border border-[#DDCBA4] shadow-warm-sm bg-[#FAEDCD]">
                  <img
                    src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80"
                    alt="Artisan Hand knitting wool"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 bg-[#E9EDC9]/60 rounded-sm border border-[#CCD5AE]/60">
                  <p className="font-serif text-lg font-bold text-[#2A2923]">100% Ethical</p>
                  <p className="text-xs text-[#686558] mt-0.5">Cruelty-free Himalayan Cashmere</p>
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <div className="p-4 bg-[#FAEDCD] rounded-sm border border-[#DDCBA4]">
                  <p className="font-serif text-lg font-bold text-[#D4A373]">ਸੰਧ ਵਿਰਾਸਤ</p>
                  <p className="text-xs text-[#686558] mt-0.5">Generations of Punjabi Textile Grace</p>
                </div>
                <div className="aspect-[3/4] rounded-sm overflow-hidden border border-[#DDCBA4] shadow-warm-sm bg-[#CCD5AE]">
                  <img
                    src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80"
                    alt="Handmade Winter Sweater texture"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Narrative Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#D4A373] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Our Artisanal Philosophy</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#2A2923] leading-tight">
              Slow Fashion, <br />
              <span className="italic font-normal text-[#D4A373]">
                Hand-Knitted with Soul.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-[#686558] leading-relaxed">
              In a world consumed by rapid factory churn, <strong>Sandh Boutique</strong> stands
              firmly for patience, touch, and heirloom artistry. Every sweater in our collection
              begins as raw, certified virgin wool and cashmere fibers, wound by hand and shaped on
              traditional wooden needles in Punjab.
            </p>

            <p className="text-sm sm:text-base text-[#686558] leading-relaxed">
              We collaborate with skilled local artisans who have preserved heritage ribbing,
              intricate diamond cables, and Phulkari motifs across lifetimes. No two garments are
              identical — each bears the subtle hallmark of human hands and genuine winter comfort.
            </p>

            {/* Values Grid */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FAEDCD] flex items-center justify-center text-[#D4A373] shrink-0">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold text-[#2A2923]">Bespoke Custom</h4>
                  <p className="text-xs text-[#686558] mt-0.5">Tailored monogram & sizing options</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#CCD5AE]/60 flex items-center justify-center text-[#2A2923] shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold text-[#2A2923]">Heirloom Quality</h4>
                  <p className="text-xs text-[#686558] mt-0.5">Designed to last through decades</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link to="/about">
                <Button variant="outline" size="md">
                  Read Our Full Story
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
