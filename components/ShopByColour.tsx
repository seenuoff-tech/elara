import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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

export default function ShopByColour() {
  const [colors, setColors] = useState(defaultColors);

  useEffect(() => {
    fetch('/api/settings/homepage')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data?.colors) {
          setColors(json.data.colors);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <section className="py-16 px-4 md:px-12 bg-white max-w-7xl mx-auto z-10 relative">
      <div className="flex flex-col items-center text-center mb-10 gap-2">
        <h2 className="text-2xl md:text-3xl font-medium tracking-wide text-black">
          Shop by Colour
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {colors.map((color, index) => (
          <Link key={index} href={color.href} className="flex flex-col items-center group">
            {/* Image Card */}
            <div className="relative w-full aspect-[4/3] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-[#0B5E64] shadow-sm group-hover:shadow-lg transition-shadow duration-300">
              {/* Tag at Top Center */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
                <div className={`px-4 py-1.5 rounded-b-xl text-[10px] md:text-xs font-semibold shadow-sm ${color.tagBg}`}>
                  {color.tag}
                </div>
              </div>

              {/* Product Image */}
              <Image
                src={color.image}
                alt={color.name}
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>

            {/* Swatch & Title */}
            <div className="flex flex-col items-center -mt-6 z-20">
              <div className="p-1.5 bg-white rounded-full shadow-sm mb-3">
                <div className={`w-8 h-8 rounded-full ${color.swatch} shadow-inner`} />
              </div>
              <h3 className="text-sm md:text-base font-semibold text-gray-900 tracking-wide text-center">
                {color.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
