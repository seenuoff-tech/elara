'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface ImageFile {
  name: string;
  url: string;
  size: number;
  createdAt: string;
}

export default function MediaGallery() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchImages = async () => {
    try {
      const API_BASE = '';
      const res = await fetch(`${API_BASE}/api/images`);
      const data = await res.json();
      if (data.success) {
        setImages(data.images);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    let uploadedCount = 0;
    
    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);
        
        const API_BASE = '';
        const res = await fetch(`${API_BASE}/api/upload`, {
          method: 'POST',
          body: formData,
        });
        
        const data = await res.json();
        if (data.success) {
          uploadedCount++;
        } else {
          alert('Upload failed for ' + files[i].name + ': ' + data.error);
        }
      }

      if (uploadedCount > 0) {
        fetchImages(); // Refresh gallery
      }
    } catch (error) {
      alert('Error uploading files');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (filename: string) => {
    if (!confirm(`Are you sure you want to delete ${filename}?`)) return;

    try {
      const API_BASE = '';
      const res = await fetch(`${API_BASE}/api/images?filename=${encodeURIComponent(filename)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      
      if (data.success) {
        setImages(images.filter(img => img.name !== filename));
      } else {
        alert(data.error || 'Failed to delete image');
      }
    } catch (error) {
      alert('Error deleting image');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`Copied filename to clipboard: ${text}`);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Drag and drop handlers
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileUpload(e.dataTransfer.files);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Gallery</h1>
          <p className="text-sm text-gray-500 mt-1">Upload and manage product images for your store.</p>
        </div>
        <div>
          <label className={`px-4 py-2 bg-[#0B5E64] text-white text-sm font-medium rounded-lg transition-colors cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#084A4F]'}`}>
            {isUploading ? 'Uploading...' : 'Upload Images'}
            <input 
              type="file" 
              multiple 
              className="hidden" 
              accept="image/*"
              onChange={(e) => handleFileUpload(e.target.files)}
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      {/* Upload Zone */}
      <div 
        onDragOver={onDragOver}
        onDrop={onDrop}
        className="w-full h-40 border-2 border-dashed border-[#0B5E64]/30 rounded-xl flex flex-col items-center justify-center text-[#0B5E64] bg-[#0B5E64]/5 hover:bg-[#0B5E64]/10 transition-colors"
      >
        <svg className="w-10 h-10 text-[#0B5E64] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        <p className="font-medium text-gray-900">Drag & Drop images here</p>
        <p className="text-sm text-gray-500 mt-1">or click the Upload button above</p>
      </div>

      {/* Gallery */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <svg className="w-8 h-8 text-[#0B5E64] animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-500">No images found. Upload some to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {images.map((img) => (
            <div key={img.name} className="bg-white border border-gray-200 rounded-lg overflow-hidden group relative">
              <div className="aspect-square relative bg-gray-100">
                <Image 
                  src={img.url} 
                  alt={img.name} 
                  fill 
                  className="object-contain p-2"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />
                
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                  <button 
                    onClick={() => copyToClipboard(img.name)}
                    className="w-full bg-white text-gray-900 text-xs font-medium py-1.5 rounded hover:bg-gray-100 flex items-center justify-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Name
                  </button>
                  <button 
                    onClick={() => handleDelete(img.name)}
                    className="w-full bg-red-600 text-white text-xs font-medium py-1.5 rounded hover:bg-red-700 flex items-center justify-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
              <div className="p-2 border-t border-gray-100">
                <p className="text-[10px] text-gray-800 font-medium truncate" title={img.name}>{img.name}</p>
                <p className="text-[9px] text-gray-400 mt-0.5">{formatSize(img.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
