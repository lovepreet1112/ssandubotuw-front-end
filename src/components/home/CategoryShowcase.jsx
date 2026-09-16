import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const CATEGORIES = [
  {
    name: 'Winter Sweaters',
    desc: 'Dense pullovers, mock-necks & roll-collars',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80',
    path: '/clothing?category=Winter+Sweaters',
  },
  {
    name: 'Handmade Sweaters',
    desc: 'Heavy gauge moss stitch & honeycomb weaves',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80',
    path: '/clothing?category=Handmade+Sweaters',
  },
  {
    name: 'Custom Designs',
    desc: 'Personalized initials & custom sizing commissions',
    image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=600&q=80',
    path: '/clothing?category=Custom+Designs',
  },
  {
    name: 'Cardigans',
    desc: 'Horn button closures & cocoon wraps',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80',
    path: '/clothing?category=Cardigans',
  },
  {
    name: 'Shawls & Wraps',
    desc: 'Hand-loomed Pashmina and winter stoles',
    image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=600&q=80',
    path: '/clothing?category=Shawls+%26+Wraps',
  },
];

export const CategoryShowcase = () => {
  return (
    <section className="py-16 md:py-24 bg-[#E9EDC9]/30 border-b border-[#DDCBA4]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-[#D4A373] font-semibold">
            Handcrafted Taxonomy
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2A2923] mt-2">
            Explore by Category
          </h2>
          <p className="text-sm text-[#686558] mt-2">
            Each winter category is crafted with distinct yarns, weight specifications, and needle
            gauges.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={cat.path}
              className="group relative rounded-sm overflow-hidden bg-[#FAEDCD] border border-[#DDCBA4]/60 aspect-[3/4] flex flex-col justify-end p-5 shadow-sm hover:shadow-warm-md transition-all"
            >
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <div className="relative z-10 space-y-1 text-white">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-base font-semibold leading-snug">{cat.name}</h3>
                  <ArrowUpRight className="w-4 h-4 text-[#FAEDCD] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
                <p className="text-[11px] text-white/80 line-clamp-2">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;
