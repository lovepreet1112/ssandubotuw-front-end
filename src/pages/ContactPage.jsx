import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, Sparkles } from 'lucide-react';
import contactService from '../services/contactService';
import Button from '../components/common/Button';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await contactService.submitContact(formData);
      setSubmittedSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      // Handled by toast in apiRequest
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-[0.25em] text-[#D4A373] font-semibold">
          Get In Touch • ਰਾਬਤਾ ਕਾਇਮ ਕਰੋ
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#2A2923]">
          Let's Create Something Warm Together
        </h1>
        <p className="text-xs sm:text-sm text-[#686558] leading-relaxed">
          Have an inquiry regarding bespoke custom sizing, wedding orders, or wool care? Our
          atelier team in Punjab is eager to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Contact Information */}
        <div className="lg:col-span-5 bg-[#FAEDCD]/40 p-8 border border-[#DDCBA4] rounded-sm space-y-8">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#2A2923]">Sandh Atelier & Studio</h3>
            <p className="text-xs text-[#686558] mt-1">
              Visiting our physical workshop by appointment for bespoke measurements.
            </p>
          </div>

          <div className="space-y-4 text-xs md:text-sm text-[#2A2923]">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#D4A373] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#2A2923]">Heritage Workshop:</strong>
                <span className="text-[#686558]">
                  42 Mall Road, Near Heritage Quarter, Amritsar, Punjab 143001
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-[#D4A373] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#2A2923]">Client Concierge:</strong>
                <span className="text-[#686558]">+91 98765 43210 / +91 98123 45678</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-[#D4A373] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#2A2923]">Direct Inquiries:</strong>
                <span className="text-[#686558]">atelier@sandhboutique.com</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#D4A373] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#2A2923]">Atelier Hours:</strong>
                <span className="text-[#686558]">Monday – Saturday: 10:00 AM – 7:00 PM IST</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#E9EDC9]/60 border border-[#CCD5AE] rounded-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-[#2A2923]">
              <Sparkles className="w-4 h-4 text-[#D4A373]" />
              <span>Wedding & Bulk Orders</span>
            </div>
            <p className="text-[11px] text-[#686558] mt-1 leading-relaxed">
              We specialize in heirloom matching shawls and monogrammed pullovers for winter
              weddings. Please specify dates and quantities.
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Form */}
        <div className="lg:col-span-7 bg-[#FDFBF7] p-8 border border-[#DDCBA4] rounded-sm shadow-warm-sm">
          {submittedSuccess ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#2A2923]">Message Dispatched</h3>
              <p className="text-xs text-[#686558] max-w-sm mx-auto">
                Thank you for contacting Sandh Boutique. One of our artisans will respond within 24
                hours.
              </p>
              <Button
                variant="warm"
                size="sm"
                className="mt-4"
                onClick={() => setSubmittedSuccess(false)}
              >
                Send Another Note
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#2A2923] block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Simran Kaur"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#DDCBA4] rounded-sm focus:outline-none focus:border-[#D4A373]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2A2923] block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="simran@example.com"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#DDCBA4] rounded-sm focus:outline-none focus:border-[#D4A373]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#2A2923] block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#DDCBA4] rounded-sm focus:outline-none focus:border-[#D4A373]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2A2923] block mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Custom Sizing / Order Inquiry"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#DDCBA4] rounded-sm focus:outline-none focus:border-[#D4A373]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#2A2923] block mb-1">
                  Your Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Tell us about the design, size, or custom winter request you have in mind..."
                  className="w-full p-3 text-xs bg-white border border-[#DDCBA4] rounded-sm focus:outline-none focus:border-[#D4A373]"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
                isLoading={isSubmitting}
                disabled={isSubmitting}
                icon={Send}
                iconPosition="right"
              >
                Send Message to Atelier
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
