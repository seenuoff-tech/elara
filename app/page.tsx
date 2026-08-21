'use client';

import React from 'react';
import HeroSlider from '../components/HeroSlider';
import ShopByCategory from '../components/ShopByCategory';
import CuratedForYou from '../components/CuratedForYou';

// Import newly integrated premium luxury experience modules
import AtmosphereBackground from '../components/luxury/AtmosphereBackground';
import NewArrivals from '../components/NewArrivals';
import Testimonials from '../components/Testimonials';
import StoreFront from '../components/luxury/StoreFront';
import ConciergeAssistant from '../components/luxury/ConciergeAssistant';
import LuxuryWithinReach from '../components/LuxuryWithinReach';
import HotRightNowBanner from '../components/HotRightNowBanner';
import ShopByColour from '../components/ShopByColour';
import MensCollection from '../components/MensCollection';
import FirstAccessBanner from '../components/FirstAccessBanner';
import ElaraPromises from '../components/ElaraPromises';

export default function Home() {
  return (
    <div className="bg-[#ffffff] text-black selection:bg-black/10 selection:text-black relative min-h-screen">
      {/* Immersive Background Atmosphere (Subtle floating silver dust and sparkles) */}
      <AtmosphereBackground />

      {/* Hero Section */}
      <HeroSlider />

      {/* Shop by Category Section */}
      <ShopByCategory />

      {/* New Arrivals Section */}
      <div className="relative z-10">
        <NewArrivals />
      </div>

      {/* Elara Promise Section (Above Affordable Elegance) */}
      <ElaraPromises />

      {/* Affordable Elegance (Luxury Within Reach) Section (Below New Arrivals) */}
      <LuxuryWithinReach />

      {/* Hot Right Now Banner */}
      <HotRightNowBanner />

      {/* Shop by Colour Section */}
      <ShopByColour />

      {/* Curated For You Section */}
      <CuratedForYou />

      {/* Men's Collection */}
      <MensCollection />

      {/* First Access Banner */}
      <FirstAccessBanner />

      {/* Store Front Section */}
      <div className="relative z-10">
        <StoreFront />
      </div>

      <Testimonials />
    </div>
  );
}
