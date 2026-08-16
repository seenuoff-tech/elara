'use client';

import React, { useState, useEffect } from 'react';

export default function HeroSliderManagement() {
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<any>(null);

  const fetchSlides = async () => {
    try {
      const res = await fetch('/api/slides', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setSlides(data.slides);
      }
    } catch (error) {
      console.error('Error fetching slides:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this slide?')) {
      try {
        const res = await fetch(`/api/slides/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setSlides(slides.filter(s => s.id !== id));
        }
      } catch (error) {
        console.error('Error deleting slide:', error);
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const res = await fetch(`/api/upload`, {
          method: 'POST',
          body: formData,
        });
        
        const data = await res.json();
        if (data.success) {
          if (editingSlide) setEditingSlide({...editingSlide, image: data.url});
        } else {
          alert('Upload failed: ' + data.error);
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert('Failed to upload image');
      }
    }
  };

  const handleSaveSlide = async () => {
    if (editingSlide) {
      try {
        let res;
        if (editingSlide.id === 0) {
          res = await fetch('/api/slides', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editingSlide)
          });
        } else {
          res = await fetch(`/api/slides/${editingSlide.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editingSlide)
          });
        }
        
        const data = await res.json();
        if (data.success) {
          if (editingSlide.id === 0) {
            setSlides([...slides, data.slide]);
          } else {
            setSlides(slides.map(s => s.id === editingSlide.id ? data.slide : s));
          }
          setEditingSlide(null);
        }
      } catch (error) {
        console.error('Error saving slide:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hero Slider Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage the hero banners displayed on the homepage.</p>
        </div>
        <button 
          onClick={() => setEditingSlide({ id: 0, title: '', subtitle: '', image: '', status: 'Active' })}
          className="px-4 py-2 bg-[#0B5E64] text-white text-sm font-medium rounded-lg hover:bg-[#084A4F] transition-colors"
        >
          Add New Slide
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">Title / Subtitle</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {slides.map((slide) => (
              <tr key={slide.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="w-32 h-16 bg-gray-200 rounded-md overflow-hidden relative">
                    <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-gray-900">{slide.title}</div>
                  <div className="text-gray-500 text-xs mt-1">{slide.subtitle}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                    slide.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {slide.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button 
                    onClick={() => setEditingSlide(slide)}
                    className="text-[#0B5E64] hover:underline font-medium"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(slide.id)}
                    className="text-red-600 hover:underline font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Slide Modal */}
      {editingSlide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">{editingSlide.id === 0 ? 'Add New Slide' : 'Edit Slide'}</h3>
              <button 
                onClick={() => {
                  setEditingSlide(null);
                }} 
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image Upload (or URL)</label>
                <div className="flex gap-2 items-center">
                  <input 
                    type="text" 
                    value={editingSlide ? editingSlide.image : ''}
                    onChange={(e) => editingSlide && setEditingSlide({...editingSlide, image: e.target.value})}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#0B5E64] focus:outline-none" 
                    placeholder="e.g. /images/slider1.jpg" 
                  />
                  <div className="relative overflow-hidden inline-block shrink-0">
                    <button className="px-4 py-2 bg-gray-100 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap">
                      Browse Files
                    </button>
                    <input 
                      type="file" 
                      accept=".jpg,.jpeg,.png,.gif,.webp,.mp4"
                      onChange={handleImageUpload}
                      className="absolute left-0 top-0 opacity-0 w-full h-full cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button 
                onClick={() => {
                  setEditingSlide(null);
                }} 
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveSlide} 
                className="px-4 py-2 text-sm font-medium text-white bg-[#0B5E64] rounded-lg hover:bg-[#084A4F] transition-colors"
              >
                {editingSlide.id === 0 ? 'Save Slide' : 'Update Slide'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
