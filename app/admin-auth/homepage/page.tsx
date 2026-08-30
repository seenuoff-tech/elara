'use client';

import React, { useState, useEffect } from 'react';

// Default values as fallback
const defaultColors = [
  {
    name: 'Pure 925 Silver',
    href: '/shop?color=silver',
    image: '/images/shop_by_color_silver.png',
    tag: '✨ Pure 925 Silver',
    tagBg: 'bg-gradient-to-r from-gray-100 to-gray-300 text-gray-800',
    swatch: 'bg-gradient-to-br from-gray-200 to-gray-400',
  },
  {
    name: 'Gold Plated',
    href: '/shop?color=gold',
    image: '/images/shop_by_color_gold.png',
    tag: '✨ 18 KT Gold Plated',
    tagBg: 'bg-gradient-to-r from-[#fae7b2] to-[#e6c175] text-[#7a5b17]',
    swatch: 'bg-gradient-to-br from-[#fdf0cc] to-[#d6ad53]',
  },
  {
    name: 'Rose Gold Plated',
    href: '/shop?color=rosegold',
    image: '/images/shop_by_color_rosegold.png',
    tag: '✨ 18 KT Rose Gold Plated',
    tagBg: 'bg-gradient-to-r from-[#fbe3de] to-[#f4b6ad] text-[#9b3e34]',
    swatch: 'bg-gradient-to-br from-[#fceced] to-[#e79f97]',
  },
  {
    name: 'Oxidised Silver',
    href: '/shop?color=oxidised',
    image: '/images/shop_by_color_oxidised.png',
    tag: '✨ Pure 925 Silver',
    tagBg: 'bg-gradient-to-r from-gray-300 to-gray-500 text-gray-900',
    swatch: 'bg-gradient-to-br from-gray-400 to-gray-600',
  },
];

const defaultGifts = [
  {
    title: 'For Him',
    image: '/images/curated_him.png',
    link: '/shop?category=men',
  },
  {
    title: 'For Kids',
    image: '/images/curated_kids.png',
    link: '/shop?category=kids',
  },
  {
    title: 'For Her',
    image: '/images/curated_her.png',
    link: '/shop?category=women',
  },
];

const defaultBanner = {
  image: '/images/first_access_banner.png',
  heading1: 'FIRST ACCESS',
  heading2: "to what's new!",
  text: 'New design destined to become bestsellers',
  buttonText: 'Shop Early',
  link: '/shop?collection=new'
};

export default function HomepageEditor() {
  const [colors, setColors] = useState(defaultColors);
  const [gifts, setGifts] = useState(defaultGifts);
  const [banner, setBanner] = useState(defaultBanner);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings/homepage');
        const json = await res.json();
        if (json.success && json.data) {
          if (json.data.colors) setColors(json.data.colors);
          if (json.data.gifts) setGifts(json.data.gifts);
          if (json.data.banner) setBanner(json.data.banner);
        }
      } catch (error) {
        console.error('Failed to load settings', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/settings/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ colors, gifts, banner }),
      });
      if (res.ok) alert('Saved successfully!');
      else alert('Failed to save');
    } catch (error) {
      console.error(error);
      alert('Error saving');
    }
    setIsSaving(false);
  };

  const uploadImage = async (file: File, callback: (url: string) => void) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) callback(data.url);
      else alert('Upload failed');
    } catch (e) {
      alert('Upload error');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-8 pb-24">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Homepage Editor</h1>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="px-6 py-2 bg-[#0B5E64] text-white rounded-lg hover:bg-[#094A4F] disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      {/* Shop By Colour Section */}
      <section className="bg-white p-6 rounded-xl border border-gray-200">
        <h2 className="text-lg font-bold mb-4">Shop by Colour</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {colors.map((c, i) => (
            <div key={i} className="border p-4 rounded-lg flex flex-col gap-3">
              <h3 className="font-semibold">Item {i + 1}</h3>
              <div className="flex gap-4 items-center">
                <img src={c.image} alt="preview" className="w-20 h-20 object-cover bg-gray-100 rounded" />
                <input type="file" accept="image/*" onChange={(e) => {
                  if (e.target.files?.[0]) uploadImage(e.target.files[0], (url) => {
                    const newColors = [...colors]; newColors[i].image = url; setColors(newColors);
                  });
                }} className="text-sm" />
              </div>
              <input type="text" value={c.name} onChange={e => { const nc = [...colors]; nc[i].name = e.target.value; setColors(nc); }} placeholder="Name" className="border p-2 rounded" />
              <input type="text" value={c.tag} onChange={e => { const nc = [...colors]; nc[i].tag = e.target.value; setColors(nc); }} placeholder="Tag Text" className="border p-2 rounded" />
              <input type="text" value={c.href} onChange={e => { const nc = [...colors]; nc[i].href = e.target.value; setColors(nc); }} placeholder="Link" className="border p-2 rounded" />
            </div>
          ))}
        </div>
      </section>

      {/* Gifts For You Section */}
      <section className="bg-white p-6 rounded-xl border border-gray-200">
        <h2 className="text-lg font-bold mb-4">Gifts For You</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {gifts.map((g, i) => (
            <div key={i} className="border p-4 rounded-lg flex flex-col gap-3">
              <h3 className="font-semibold">Item {i + 1}</h3>
              <div className="flex gap-4 items-center">
                <img src={g.image} alt="preview" className="w-20 h-20 object-cover bg-gray-100 rounded" />
                <input type="file" accept="image/*" onChange={(e) => {
                  if (e.target.files?.[0]) uploadImage(e.target.files[0], (url) => {
                    const ng = [...gifts]; ng[i].image = url; setGifts(ng);
                  });
                }} className="text-sm" />
              </div>
              <input type="text" value={g.title} onChange={e => { const ng = [...gifts]; ng[i].title = e.target.value; setGifts(ng); }} placeholder="Title" className="border p-2 rounded" />
              <input type="text" value={g.link} onChange={e => { const ng = [...gifts]; ng[i].link = e.target.value; setGifts(ng); }} placeholder="Link" className="border p-2 rounded" />
            </div>
          ))}
        </div>
      </section>

      {/* First Access Banner */}
      <section className="bg-white p-6 rounded-xl border border-gray-200">
        <h2 className="text-lg font-bold mb-4">First Access Banner</h2>
        <div className="flex flex-col gap-4 max-w-xl">
          <div className="flex gap-4 items-center">
            <img src={banner.image} alt="preview" className="w-40 h-20 object-cover bg-gray-100 rounded" />
            <input type="file" accept="image/*" onChange={(e) => {
              if (e.target.files?.[0]) uploadImage(e.target.files[0], (url) => setBanner({ ...banner, image: url }));
            }} className="text-sm" />
          </div>
          <input type="text" value={banner.heading1} onChange={e => setBanner({ ...banner, heading1: e.target.value })} placeholder="Heading 1" className="border p-2 rounded" />
          <input type="text" value={banner.heading2} onChange={e => setBanner({ ...banner, heading2: e.target.value })} placeholder="Heading 2" className="border p-2 rounded" />
          <input type="text" value={banner.text} onChange={e => setBanner({ ...banner, text: e.target.value })} placeholder="Subtext" className="border p-2 rounded" />
          <input type="text" value={banner.buttonText} onChange={e => setBanner({ ...banner, buttonText: e.target.value })} placeholder="Button Text" className="border p-2 rounded" />
          <input type="text" value={banner.link} onChange={e => setBanner({ ...banner, link: e.target.value })} placeholder="Link URL" className="border p-2 rounded" />
        </div>
      </section>
    </div>
  );
}
