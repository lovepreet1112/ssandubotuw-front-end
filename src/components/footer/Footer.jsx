import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Heart, ArrowRight } from 'lucide-react';
import contactService from '../../services/contactService';
import Button from '../common/Button';

export const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    try {
      setIsSubscribing(true);
      await contactService.subscribeNewsletter(newsletterEmail.trim());
      setNewsletterEmail('');
    } catch (err) {
      // Handled by toast in apiRequest
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-[#E9EDC9]/40 border-t border-[#DDCBA4] text-[#2A2923] pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#DDCBA4]/60">
          {/* Brand Philosophy */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <h2 className="font-serif text-2xl font-bold tracking-wider text-[#2A2923]">
                SANDH BOUTIQUE
              </h2>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#D4A373] font-serif">
                ਸੰਧ ਬੁਟੀਕ • Handcrafted Winter Warmth
              </p>
            </Link>
            <p className="text-sm text-[#686558] max-w-sm leading-relaxed">
              Rooted in the timeless textile traditions of Punjab and artisanal knitting heritage,
              Sandh Boutique handcrafts bespoke winter sweaters, cardigans, and wraps tailored with
              pure Himalayan Cashmere and Australian Merino wool.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#FAEDCD] hover:bg-[#D4A373] hover:text-white border border-[#DDCBA4] flex items-center justify-center text-[#2A2923] transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#FAEDCD] hover:bg-[#D4A373] hover:text-white border border-[#DDCBA4] flex items-center justify-center text-[#2A2923] transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#2A2923] mb-4">
              Atelier
            </h4>
            <ul className="space-y-2.5 text-xs md:text-sm text-[#686558]">
              <li>
                <Link to="/" className="hover:text-[#D4A373] transition-colors">
                  Home Collection
                </Link>
              </li>
              <li>
                <Link to="/clothing" className="hover:text-[#D4A373] transition-colors">
                  All Knitwear
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#D4A373] transition-colors">
                  Our Craft & Philosophy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#D4A373] transition-colors">
                  Custom Design Inquiry
                </Link>
              </li>
              <li>
                <Link to="/clothing?category=Custom+Designs" className="hover:text-[#D4A373] transition-colors">
                  Bespoke Monograms
                </Link>
              </li>
            </ul>
          </div>

          {/* Clothing Categories */}
          <div>
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#2A2923] mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-xs md:text-sm text-[#686558]">
              <li>
                <Link to="/clothing?category=Winter+Sweaters" className="hover:text-[#D4A373] transition-colors">
                  Winter Sweaters
                </Link>
              </li>
              <li>
                <Link to="/clothing?category=Cardigans" className="hover:text-[#D4A373] transition-colors">
                  Merino Cardigans
                </Link>
              </li>
              <li>
                <Link to="/clothing?category=Shawls+%26+Wraps" className="hover:text-[#D4A373] transition-colors">
                  Handloomed Shawls
                </Link>
              </li>
              <li>
                <Link to="/clothing?category=Handmade+Sweaters" className="hover:text-[#D4A373] transition-colors">
                  Chunky Fisherman Knits
                </Link>
              </li>
              <li>
                <Link to="/clothing?sort=newest" className="hover:text-[#D4A373] transition-colors">
                  New Season Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Atelier Contact & Newsletter */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#2A2923]">
              Join the Circle
            </h4>
            <p className="text-xs text-[#686558] leading-relaxed">
              Receive invitations to limited artisanal drops and private winter trunk shows.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-3 py-2 text-xs bg-white border border-[#DDCBA4] rounded-sm focus:outline-none focus:border-[#D4A373] pr-9"
                />
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="absolute right-1 top-1 bottom-1 px-2 text-[#D4A373] hover:text-[#2A2923] disabled:opacity-50"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            <div className="space-y-1.5 pt-2 text-xs text-[#686558]">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#D4A373] shrink-0" />
                <span>Mall Road, Amritsar, Punjab</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#D4A373] shrink-0" />
                <span>+91 98765 43210</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#D4A373] shrink-0" />
                <span>contact@sandhboutique.com</span>
              </p>
            </div>
          </div>
        </div>

        {/* Copyright and Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#686558]">
          <p className="flex items-center gap-1">
            © {new Date().getFullYear()} Sandh Boutique (ਸੰਧ ਬੁਟੀਕ). Crafted with{' '}
            <Heart className="w-3 h-3 text-[#D4A373] fill-[#D4A373]" /> for winter elegance.
          </p>
          <div className="flex space-x-6 text-[11px]">
            <Link to="/about" className="hover:text-[#D4A373] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/about" className="hover:text-[#D4A373] transition-colors">
              Terms & Conditions
            </Link>
            <Link to="/contact" className="hover:text-[#D4A373] transition-colors">
              Shipping & Care
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
