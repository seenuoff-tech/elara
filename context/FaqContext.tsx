'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Faq {
  id: string;
  question: string;
  answer: string;
  key: string;
}

interface FaqContextType {
  faqs: Faq[];
  addFaq: (faq: Omit<Faq, 'id' | 'key'>) => void;
  updateFaq: (id: string, faq: Partial<Faq>) => void;
  deleteFaq: (id: string) => void;
}

const FaqContext = createContext<FaqContextType | undefined>(undefined);

export function FaqProvider({ children }: { children: React.ReactNode }) {
  const defaultFaqs: Faq[] = [
    {
      id: 'FAQ-001',
      key: 'size',
      question: 'Find Ring Size',
      answer: 'Our bands conform to standard US sizing. To discover your fit, measure the inner circumference of a current ring in millimeters, or wrap a thread around the base of your finger. We can also dispatch a complimentary physical ring sizer casing.'
    },
    {
      id: 'FAQ-002',
      key: 'finish',
      question: 'Bespoke Finishes',
      answer: 'We provide Glossy Chrome (mirror reflection), Satin Matte (velvety luster), and Vintage Oxidized (antique shadow grooves) variants. You can preview these in real time on our Bespoke Customizer page segment.'
    },
    {
      id: 'FAQ-003',
      key: 'care',
      question: 'Silver Care Guide',
      answer: 'Sterling silver requires simple care to avoid tarnish. Store pieces in dry velvet enclosures, avoid contact with chemical spray, and clean using our micro-fiber polishing cloths. Our rhodium plating acts as a highly durable tarnish barrier.'
    },
    {
      id: 'FAQ-004',
      key: 'consult',
      question: 'Book Consultation',
      answer: 'Certainly. Please submit your email in our Patron Concierge block at the bottom of the page, and a private client advisor will coordinate a personal showroom scheduling consultation.'
    }
  ];

  const [faqs, setFaqs] = useState<Faq[]>(defaultFaqs);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch from Database
  const fetchFaqs = async () => {
    try {
      const res = await fetch('/api/faqs');
      const data = await res.json();
      if (data.success && data.faqs.length > 0) {
        setFaqs(data.faqs);
      }
    } catch (error) {
      console.error("Failed to fetch FAQs from DB", error);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const addFaq = async (faqData: Omit<Faq, 'id' | 'key'>) => {
    const key = `faq_${Date.now()}`;
    try {
      const res = await fetch('/api/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...faqData, key })
      });
      const data = await res.json();
      if (data.success) {
        setFaqs((prev) => [...prev, data.faq]);
      }
    } catch (error) {
      console.error("Error adding FAQ", error);
    }
  };

  const updateFaq = (id: string, updatedData: Partial<Faq>) => {
    // Note: If you want to persist updates to DB, implement a PUT /api/faqs route.
    // For now, updating local state as placeholder for update.
    setFaqs((prev) => prev.map(faq => faq.id === id ? { ...faq, ...updatedData } : faq));
  };

  const deleteFaq = async (id: string) => {
    try {
      await fetch(`/api/faqs?id=${id}`, { method: 'DELETE' });
      setFaqs((prev) => prev.filter(faq => faq.id !== id));
    } catch (error) {
      console.error("Error deleting FAQ", error);
    }
  };

  return (
    <FaqContext.Provider value={{ faqs, addFaq, updateFaq, deleteFaq }}>
      {children}
    </FaqContext.Provider>
  );
}

export function useFaq() {
  const context = useContext(FaqContext);
  if (context === undefined) {
    throw new Error('useFaq must be used within a FaqProvider');
  }
  return context;
}
