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
    <div className="bg-[#ffffff] text-black selection:bg-[#ffffff]/20 min-h-screen pt-48">


      {/* Grid Content */}
      <section className="max-w-3xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 gap-16 items-start mb-20">
        {/* Left Side: Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="border border-black/10 p-8 md:p-12 bg-neutral-50/40 backdrop-blur-sm"
        >
          <h3 className="text-xl font-bold tracking-widest uppercase mb-8 text-black">
            Send a Message
          </h3>

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


      </section>
    </div>
  );
}
