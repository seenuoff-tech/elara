'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LuxuryButton from '../../components/luxury/LuxuryButton';

export default function ContactPage() {
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formState.name && formState.email && formState.message) {
      setSubmitted(true);
      setFormState({ name: '', email: '', subject: '', message: '' });
    }
  };

  return (
    <div className="bg-[#ffffff] text-black selection:bg-[#ffffff]/20 min-h-screen pt-24">


      {/* Grid Content */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-20">
        {/* Left Side: Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="border border-black/10 p-8 md:p-12 bg-neutral-50/40 backdrop-blur-sm"
        >
          <h3 className="text-xl font-bold tracking-widest uppercase mb-2 text-black">
            Send a Message
          </h3>
          <p className="text-xs text-black/40 font-light uppercase tracking-widest mb-8">
            Reply Guaranteed Within 24 Business Hours
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4 py-8 text-center"
            >
              <svg className="w-12 h-12 text-silver-chrome mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 className="text-sm font-semibold tracking-widest uppercase">Message Received</h4>
              <p className="text-xs text-black/50 font-light">
                Thank you for contacting ELARA. A client advisor will review your request and get back to you shortly.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] tracking-widest uppercase text-black/40 block">Full Name</label>
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full bg-[#ffffff] border border-black/10 focus:border-black text-sm px-4 py-3 text-black focus:outline-none transition-colors duration-300"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] tracking-widest uppercase text-black/40 block">Email Address</label>
                <input
                  type="email"
                  required
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className="w-full bg-[#ffffff] border border-black/10 focus:border-black text-sm px-4 py-3 text-black focus:outline-none transition-colors duration-300"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] tracking-widest uppercase text-black/40 block">Subject (Optional)</label>
                <input
                  type="text"
                  value={formState.subject}
                  onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                  className="w-full bg-[#ffffff] border border-black/10 focus:border-black text-sm px-4 py-3 text-black focus:outline-none transition-colors duration-300"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] tracking-widest uppercase text-black/40 block">Message</label>
                <textarea
                  required
                  rows={4}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  className="w-full bg-[#ffffff] border border-black/10 focus:border-black text-sm px-4 py-3 text-black focus:outline-none transition-colors duration-300 resize-none"
                />
              </div>

              <LuxuryButton isCTA={true}>
                <button
                  type="submit"
                  className="w-full py-4 text-xs font-bold tracking-[0.25em] uppercase bg-white text-black border border-black hover:bg-transparent hover:text-black transition-all duration-500 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] cursor-pointer"
                >
                  Send Message
                </button>
              </LuxuryButton>
            </form>
          )}
        </motion.div>

        {/* Right Side: Corporate & Boutique Coordinates */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-12"
        >


          {/* Column Group 2 */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold tracking-[0.3em] uppercase text-silver-chrome">
              Concierge Contact
            </h4>
            <div className="space-y-2 text-sm font-light">
              <p className="flex justify-between">
                <span className="text-black/40 uppercase tracking-wider text-[11px]">Bespoke Order Assistance</span>
                <span className="text-black font-medium">orders@elarasilver.com</span>
              </p>
              <p className="flex justify-between border-t border-black/5 pt-2">
                <span className="text-black/40 uppercase tracking-wider text-[11px]">Atelier Hours</span>
                <span className="text-black font-medium">Monday — Saturday, 10:00 - 19:00 IST</span>
              </p>
            </div>
          </div>

          {/* Column Group 3 */}
          <div className="space-y-4 border-t border-black/10 pt-8">
            <h4 className="text-xs font-semibold tracking-[0.3em] uppercase text-silver-chrome">
              Complimentary Services
            </h4>
            <ul className="text-xs text-black/50 font-light space-y-2 leading-relaxed list-disc list-inside">
              <li>Free express shipping and carbon-neutral packaging for all items.</li>
              <li>Signature silver-toned luxury hard boxes with velvet linings.</li>
              <li>Free 30-day returns and resizing options for unworn rings.</li>
              <li>Laminated Certificate of Authenticity containing assay Hallmark stamps.</li>
            </ul>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
