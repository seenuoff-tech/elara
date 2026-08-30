import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const defaultBanner = {
  image: '/images/first_access_banner.png',
  heading1: 'FIRST ACCESS',
  heading2: "to what's new!",
  text: 'New design destined to become bestsellers',
  buttonText: 'Shop Early',
  link: '/shop?collection=new'
};

export default function FirstAccessBanner() {
  const [banner, setBanner] = useState(defaultBanner);

  useEffect(() => {
    fetch('/api/settings/homepage')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data?.banner) {
          setBanner(json.data.banner);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <section className="relative w-full mt-12 mb-4 z-10 px-4 md:px-12 max-w-[1400px] mx-auto">
      <div 
        className="relative w-full overflow-hidden rounded-2xl bg-[#0B5E64] shadow-xl flex flex-col md:flex-row items-center justify-center min-h-[300px] md:min-h-[400px] bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: `url('${banner.image}')` }}
      >
        {/* Dark overlay to ensure text readability */}
        <div className="absolute inset-0 bg-[#0B5E64]/60 md:bg-transparent pointer-events-none" />

        {/* Center Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 py-12 md:py-0 w-full max-w-2xl mx-auto">
          <h2 className="text-white font-sans font-bold text-4xl md:text-6xl tracking-wide uppercase mb-2 drop-shadow-md">
            {banner.heading1}
          </h2>
          <h3 className="text-white font-serif italic text-2xl md:text-3xl mb-6 drop-shadow-md">
            {banner.heading2}
          </h3>
          <p className="text-white/90 font-medium text-lg md:text-xl tracking-wide mb-8 max-w-md mx-auto leading-relaxed drop-shadow-sm">
            {banner.text}
          </p>
          
          <Link href={banner.link} className="group">
            <div className="bg-white text-[#0B5E64] px-8 py-3 rounded-full text-base font-bold tracking-wide hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg">
              {banner.buttonText}
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
