'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LuxuryButton from './LuxuryButton';
import { useFaq } from '@/context/FaqContext';

interface Message {
  sender: 'user' | 'concierge';
  text: string;
}

export default function ConciergeAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const { faqs } = useFaq();
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'concierge',
      text: "Welcome to ELARA. I am your Elara Chatbot. How may I guide your jewelry search today?"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleOptionClick = (optionText: string, replyKey: string) => {
    // Add user message
    setMessages((prev) => [...prev, { sender: 'user', text: optionText }]);
    setIsTyping(true);

    const matchedFaq = faqs.find(f => f.key === replyKey);
    const replyText = matchedFaq ? matchedFaq.answer : "Understood. Please let me know how else I may assist your showroom search.";

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'concierge',
          text: replyText
        }
      ]);
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[99] select-none">
      {/* Concierge Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-20 right-0 w-[320px] md:w-[380px] h-[450px] border border-black/10 bg-neutral-50/90 backdrop-blur-2xl flex flex-col justify-between shadow-[0_30px_60px_rgba(0,0,0,0.85)]"
          >
            {/* Header */}
            <div className="p-5 border-b border-black/10 flex justify-between items-center bg-[#ffffff]/40">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-silver-chrome" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0 C12 6.627 6.627 12 0 12 C6.627 12 12 17.373 12 24 C12 17.373 17.373 12 24 12 C17.373 12 12 6.627 12 0 Z" />
                </svg>
                <div>
                  <h4 className="text-xs font-bold tracking-widest text-black uppercase">
                    Elara Chatbot
                  </h4>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-black/40 hover:text-black text-[9px] tracking-widest uppercase transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-grow p-5 overflow-y-auto space-y-4 scrollbar-none bg-neutral-50/20">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 text-xs font-light leading-relaxed border ${
                      msg.sender === 'user'
                        ? 'bg-white text-black border-black'
                        : 'bg-[#ffffff]/60 text-black/85 border-black/5'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#ffffff]/60 border border-black/5 p-3.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce delay-200" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Interactive Options */}
            <div className="p-5 border-t border-black/10 space-y-2.5 bg-[#ffffff]/40 max-h-[180px] overflow-y-auto scrollbar-hide">
              <span className="text-[8px] tracking-widest uppercase text-black/35 font-mono block">
                Suggested Inquiries
              </span>
              <div className="grid grid-cols-2 gap-2">
                {faqs.map((faq) => (
                  <button
                    key={faq.id}
                    onClick={() => handleOptionClick(faq.question, faq.key)}
                    className="text-[9px] font-semibold text-black/60 tracking-wider text-left border border-black/5 px-3 py-2 hover:bg-white hover:text-black hover:border-black transition-colors uppercase cursor-pointer"
                  >
                    {faq.question}
                  </button>
                ))}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Badge */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-[#0B5E64] border border-black/10 shadow-[0_10px_35px_rgba(0,0,0,0.7)] flex items-center justify-center cursor-pointer relative group"
      >
        {/* Pulsing halo */}
        <div className="absolute inset-0 rounded-full border border-silver-chrome opacity-20 group-hover:scale-115 transition-transform duration-700 animate-ping pointer-events-none" />

        <svg className="w-6 h-6 text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </motion.button>
    </div>
  );
}
