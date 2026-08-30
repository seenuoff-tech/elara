import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const defaultCuratedItems = [
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

export default function CuratedForYou() {
  const [curatedItems, setCuratedItems] = useState(defaultCuratedItems);

  useEffect(() => {
    fetch('/api/settings/homepage')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data?.gifts) {
          setCuratedItems(json.data.gifts);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <section className="relative pt-2 md:pt-8 pb-6 md:pb-24 px-6 md:px-12 bg-[#ffffff] z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-black font-serif">
            Gifts For You
          </h2>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-12 max-w-7xl mx-auto px-2 md:px-0">
          {curatedItems.map((item, index) => (
            <div key={index} className="relative w-full">
              
              {/* MOBILE VIEW (Arched 3-column layout) */}
              <Link href={item.link} className="flex md:hidden relative group flex-col w-full">
                <div className="w-full flex flex-col bg-[#A0154D] rounded-t-full rounded-b-lg overflow-hidden shadow-sm transition-transform hover:-translate-y-1">
                  <div className="relative w-full aspect-[4/5] bg-gray-50">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                      sizes="(max-width: 768px) 33vw, 33vw"
                    />
                  </div>
                  <div className="w-full py-2 text-center">
                    <span className="text-white text-[11px] font-medium tracking-wide">
                      Gifts {item.title}
                    </span>
                  </div>
                </div>
              </Link>

              {/* DESKTOP VIEW (Original layout) */}
              <div className="hidden md:flex relative group flex-col items-center">
                <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-pink-50 shadow-sm border border-black/5">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="33vw"
                  />
                  <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/20 to-transparent z-10" />
                  <div className="absolute top-8 left-0 right-0 text-center z-20">
                    <h3 className="text-3xl lg:text-4xl italic font-serif text-white drop-shadow-md">
                      {item.title}
                    </h3>
                  </div>
                </div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-30">
                  <Link
                    href={item.link}
                    className="inline-block bg-[#0B5E64] hover:bg-[#08494E] text-white text-base font-medium px-8 py-3 rounded-xl shadow-lg transition-colors duration-300 min-w-[180px] text-center"
                  >
                    View Collection
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
