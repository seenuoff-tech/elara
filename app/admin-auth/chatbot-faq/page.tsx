'use client';

import React, { useState } from 'react';
import { useFaq, Faq } from '@/context/FaqContext';

export default function ChatbotFaqManagement() {
  const { faqs, addFaq, updateFaq, deleteFaq } = useFaq();
  
  const [isEditingOpen, setIsEditingOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Partial<Faq> & { id: string }>({ id: '', question: '', answer: '', key: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const handleSave = () => {
    if (editingFaq.id === '') {
      // Add new
      if (editingFaq.question && editingFaq.answer) {
        addFaq({
          question: editingFaq.question,
          answer: editingFaq.answer
        });
      }
    } else {
      // Update
      updateFaq(editingFaq.id, {
        question: editingFaq.question,
        answer: editingFaq.answer
      });
    }
    setIsEditingOpen(false);
    setEditingFaq({ id: '', question: '', answer: '', key: '' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      deleteFaq(id);
    }
  };

  const filteredFaqs = faqs.filter(f => 
    f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chatbot FAQs</h1>
          <p className="text-sm text-gray-500 mt-1">Manage the questions and answers for the Concierge Assistant.</p>
        </div>
        <button 
          onClick={() => {
            setEditingFaq({ id: '', question: '', answer: '', key: '' });
            setIsEditingOpen(true);
          }}
          className="px-4 py-2 bg-[#0B5E64] text-white text-sm font-medium rounded-lg hover:bg-[#084A4F] transition-colors"
        >
          Add FAQ
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center">
        <div className="relative w-full sm:w-96">
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search FAQs..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0B5E64] focus:outline-none"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 w-1/4">Question</th>
                <th className="px-6 py-4 w-1/2">Answer</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFaqs.map((faq) => (
                <tr key={faq.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{faq.question}</td>
                  <td className="px-6 py-4 text-gray-600 line-clamp-2">{faq.answer}</td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button 
                      onClick={() => {
                        setEditingFaq(faq);
                        setIsEditingOpen(true);
                      }}
                      className="text-[#0B5E64] hover:underline font-medium"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(faq.id)}
                      className="text-gray-400 hover:text-red-600 font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredFaqs.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                    No FAQs found. Add a new one to show in the chatbot.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isEditingOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
              <h3 className="text-lg font-bold text-gray-900">
                {editingFaq.id === '' ? 'Add New FAQ' : 'Edit FAQ'}
              </h3>
              <button 
                onClick={() => setIsEditingOpen(false)} 
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question (Suggestion Label)</label>
                <input 
                  type="text" 
                  value={editingFaq.question || ''}
                  onChange={(e) => setEditingFaq({...editingFaq, question: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#0B5E64] focus:outline-none" 
                  placeholder="e.g. Find Ring Size" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Answer (Concierge Reply)</label>
                <textarea 
                  value={editingFaq.answer || ''}
                  onChange={(e) => setEditingFaq({...editingFaq, answer: e.target.value})}
                  rows={5}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#0B5E64] focus:outline-none" 
                  placeholder="The text that the chatbot will reply with..." 
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button 
                onClick={() => setIsEditingOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                disabled={!editingFaq.question || !editingFaq.answer}
                className="px-4 py-2 text-sm font-medium text-white bg-[#0B5E64] rounded-lg hover:bg-[#084A4F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save FAQ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
