'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import LuxuryButton from './luxury/LuxuryButton';
import SearchOverlay from './luxury/SearchOverlay';
import { usePathname } from 'next/navigation';
import { useProducts } from '../context/ProductsContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLinks, setShowLinks] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [sidebarQuery, setSidebarQuery] = useState('');
  const [navSearchQuery, setNavSearchQuery] = useState('');
  const [isNavSearchActive, setIsNavSearchActive] = useState(false);
  const sidebarInputRef = useRef<HTMLInputElement>(null);
  const { cartCount, setIsCartOpen, isCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, logout } = useAuth();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [desktopExpandedCategory, setDesktopExpandedCategory] = useState<string | null>(null);
  const pathname = usePathname();
  const activeMaterial = pathname?.startsWith('/sleet') ? 'Sleet' : 'Silver';

  const navigationMenu = [
    {
      name: 'New arrivals',
      href: '/shop'
    },
    {
      name: 'Women\'s jewellery',
      items: [
        { name: 'All', href: '/shop?gender=women' },
        { name: 'Rings', href: '/shop?category=rings' },
        { name: 'Necklace', href: '/shop?category=necklace' },
        { name: 'Minimalist chains', href: '/shop?category=minimalist-chains' },
        { name: 'Bracelet', href: '/shop?category=bracelet' },
        { name: 'Earings', href: '/shop?category=earings' },
        { name: 'Anklets', href: '/shop?category=anklets' },
        { name: 'Chains', href: '/shop?category=chains' },
        { name: 'Toe rings', href: '/shop?category=toe-rings' },
      ]
    },
    {
      name: 'Men\'s jewellery',
      items: [
        { name: 'All', href: '/shop?gender=men' },
        { name: 'Rings', href: '/shop?category=mens-rings' },
        { name: 'Chains', href: '/shop?category=mens-chains' },
        { name: 'Bracelet', href: '/shop?category=mens-bracelet' },
        { name: 'Kada', href: '/shop?category=mens-kada' },
      ]
    },
    {
      name: 'Kids jewellery',
      items: [
        { name: 'All', href: '/shop?gender=kids' },
        { name: 'Earings', href: '/shop?category=kids-earings' },
        { name: 'Bracelet', href: '/shop?category=kids-bracelet' },
        { name: 'Anklets', href: '/shop?category=kids-anklets' },
      ]
    },
    {
      name: 'About us',
      href: '/about'
    }
  ];

  const { products } = useProducts();
  
  // Filter products for sidebar search
  const sidebarResults = sidebarQuery.trim() === ''
    ? []
    : products.filter(p =>
        p.name.toLowerCase().includes(sidebarQuery.toLowerCase()) ||
        (p.category && p.category.toLowerCase().includes(sidebarQuery.toLowerCase()))
      ).slice(0, 5);

  const navSearchResults = navSearchQuery.trim() === ''
    ? []
    : products.filter(p =>
        p.name.toLowerCase().includes(navSearchQuery.toLowerCase()) ||
        (p.category && p.category.toLowerCase().includes(navSearchQuery.toLowerCase()))
      ).slice(0, 5);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // If scrolling up or at the very top, show the links
      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setShowLinks(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // If scrolling down, hide the links
        setShowLinks(false);
      }
      
      setLastScrollY(currentScrollY);
      setIsScrolled(currentScrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close desktop dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.desktop-dropdown')) {
        setDesktopExpandedCategory(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 flex flex-col transition-all duration-500 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-xl border-b border-black/5 shadow-md'
          : 'bg-white border-transparent'
      }`}
    >
      <div className="w-full max-w-full px-4 md:px-6 flex flex-col">
        {/* Top Row: Hamburger, Logo, Icons */}
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Left: Hamburger (Always Visible based on image) */}
          <div className="flex items-center w-1/3">
            <button 
              className="flex flex-col gap-1 p-2 group cursor-pointer" 
              aria-label="Menu"
              onClick={() => setIsSidebarOpen(true)}
            >
              <span className="w-6 h-0.5 bg-black group-hover:bg-gray-700 transition-colors block rounded-full" />
              <span className="w-6 h-0.5 bg-black group-hover:bg-gray-700 transition-colors block rounded-full" />
              <span className="w-6 h-0.5 bg-black group-hover:bg-gray-700 transition-colors block rounded-full" />
            </button>
          </div>

          {/* Center: Logo */}
          <div className="flex justify-center items-center w-1/3">
            <Link href="/" className="hover:scale-105 transition-transform duration-500 flex items-center justify-center">
              {isScrolled ? (
                <span style={{ fontFamily: "'tan mon cheri', sans-serif" }} className="text-xl font-bold tracking-widest text-black">
                  ELARA
                </span>
              ) : (
                <img 
                  src="/images/org.png" 
                  alt="Elara Silver Logo" 
                  className="h-12 md:h-16 object-contain drop-shadow-sm transition-all duration-500 brightness-0" 
                />
              )}
            </Link>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center justify-end gap-6 w-1/3">
            {/* Search Icon */}
            <button onClick={() => setIsSearchOpen(true)} className="hidden md:block hover:opacity-60 transition-opacity" title="Search">
              <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Wishlist (Solid Red Heart) */}
            <Link href="/wishlist" className="relative hover:opacity-80 transition-opacity" title="Wishlist">
              <svg className="w-6 h-6 text-[#0B5E64]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-[#0B5E64] text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart (Solid Cart) */}
            <button onClick={() => setIsCartOpen(!isCartOpen)} className="relative hover:opacity-60 transition-opacity" title="Cart">
              <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0020 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-[#0B5E64] text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account (Solid User) */}
            <div className="relative">
              <button 
                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)} 
                className="hover:opacity-60 transition-opacity flex items-center" 
                title="Account"
              >
                <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </button>
              
              {/* Account Dropdown */}
              <div 
                className={`absolute right-0 mt-4 w-48 bg-white border border-gray-100 shadow-xl rounded-md overflow-hidden transition-all duration-300 origin-top-right ${
                  isAccountMenuOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
                }`}
              >
                <div className="py-2 flex flex-col">
                  {user ? (
                    <>
                      <Link href="/account" className="px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors" onClick={() => setIsAccountMenuOpen(false)}>
                        My Account
                      </Link>
                      <button 
                        onClick={() => {
                          logout();
                          setIsAccountMenuOpen(false);
                        }}
                        className="text-left px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors w-full"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors" onClick={() => setIsAccountMenuOpen(false)}>
                        Login
                      </Link>
                      <Link href="/register" className="px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors" onClick={() => setIsAccountMenuOpen(false)}>
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar (Visible only on mobile) */}
        <div 
          className={`md:hidden transition-all duration-500 ease-in-out relative ${
            showLinks ? 'max-h-[500px] opacity-100 pb-4 overflow-visible' : 'max-h-0 opacity-0 pb-0 overflow-hidden'
          }`}
        >
          <div className="flex items-center border border-gray-300 rounded-md bg-white h-11 relative z-50 overflow-hidden">
            <input 
              type="text"
              placeholder='Search "Gifts For Her"'
              className="flex-grow px-4 text-[13px] text-gray-800 font-medium tracking-wide outline-none w-full h-full bg-transparent"
              value={navSearchQuery}
              onChange={(e) => setNavSearchQuery(e.target.value)}
              onFocus={() => setIsNavSearchActive(true)}
              onBlur={() => setTimeout(() => setIsNavSearchActive(false), 200)}
            />
            <div className="px-4 text-gray-500 bg-white">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          {/* Mobile Material Toggle removed as per user request */}

          {/* Search Dropdown */}
          {isNavSearchActive && navSearchQuery.trim() !== '' && (
            <div className="absolute top-12 left-0 w-full bg-white border border-gray-200 shadow-2xl rounded-md overflow-hidden z-50 mt-1 max-h-80 overflow-y-auto">
              {navSearchResults.length > 0 ? (
                navSearchResults.map((product) => (
                  <Link 
                    key={product.id} 
                    href={`/product/${product.id}`}
                    className="flex items-center gap-4 p-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors"
                    onClick={() => {
                      setNavSearchQuery('');
                      setIsNavSearchActive(false);
                    }}
                  >
                    <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-md border border-gray-100" />
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-gray-900 tracking-wider uppercase">{product.name}</span>
                      <span className="text-[11px] text-gray-500 font-semibold">{product.price}</span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-6 text-center text-[13px] text-gray-500 tracking-wider uppercase">No results found for "{navSearchQuery}"</div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Row: Links — hidden on mobile, visible md+ */}
        <div 
          className={`hidden md:flex flex-col justify-center items-center transition-all duration-500 ease-in-out ${
            showLinks ? 'max-h-40 opacity-100 pb-2 overflow-visible' : 'max-h-0 opacity-0 pb-0 overflow-hidden'
          }`}
        >
          <div className="flex items-center gap-8 md:gap-12 text-[13px] font-medium text-gray-800 tracking-widest uppercase relative mb-2 mt-0">
            {navigationMenu.map((nav) => (
              <div key={nav.name} className="relative py-2 desktop-dropdown">
                {nav.href ? (
                  <Link 
                    href={nav.href}
                    className="hover:text-[#067964] transition-colors cursor-pointer hover:underline underline-offset-8 decoration-1 flex items-center gap-1"
                  >
                    {nav.name}
                  </Link>
                ) : (
                  <>
                    <span 
                      onClick={(e) => {
                        e.stopPropagation();
                        setDesktopExpandedCategory(desktopExpandedCategory === nav.name ? null : nav.name);
                      }}
                      className="hover:text-[#067964] transition-colors cursor-pointer hover:underline underline-offset-8 decoration-1 flex items-center gap-1"
                    >
                      {nav.name}
                      <svg className={`w-3 h-3 transition-transform ${desktopExpandedCategory === nav.name ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                    
                    {/* Dropdown Menu */}
                    <div className={`absolute top-full left-0 pt-2 transition-all duration-300 z-50 ${desktopExpandedCategory === nav.name ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                      <div className="bg-white border border-gray-100 shadow-xl py-3 w-48 rounded-sm">
                        {nav.items?.map((subItem) => (
                          <Link 
                            key={subItem.name} 
                            href={subItem.href}
                            onClick={() => setDesktopExpandedCategory(null)}
                            className="block px-5 py-2.5 text-xs text-gray-600 hover:bg-gray-50 hover:text-[#067964] transition-colors"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Material Toggle */}
          <div className="flex items-center border border-[#D4AF37] rounded-full p-0.5 mb-1 mt-1">
            <Link
              href="/"
              className={`w-60 py-1.5 text-[13px] font-medium rounded-full transition-all duration-300 flex items-center justify-center ${activeMaterial === 'Silver' ? 'bg-[#0B5E64] text-white shadow-md' : 'bg-transparent text-gray-600 hover:text-black hover:bg-gray-50'}`}
            >
              Silver Jewellery
            </Link>
            <Link
              href="/sleet"
              className={`w-60 py-1.5 text-[13px] font-medium rounded-full transition-all duration-300 flex items-center justify-center ${activeMaterial === 'Sleet' ? 'bg-[#A5F2F3] text-black shadow-md' : 'bg-transparent text-gray-600 hover:text-black hover:bg-gray-50'}`}
            >
              Sleet Jewellery
            </Link>
          </div>
        </div>
      </div>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-700 ${
          isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => { setIsSidebarOpen(false); setSidebarQuery(''); }}
      >
        <div 
          className={`absolute top-0 left-0 h-[100dvh] w-[400px] max-w-[85vw] bg-white/95 backdrop-blur-3xl shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Sidebar Header */}
          <div className="px-8 pt-8 pb-5 border-b border-black/5 flex justify-between items-center shrink-0">
            <span className="text-xs font-semibold tracking-[0.4em] text-black">MENU</span>
            <button 
              onClick={() => { setIsSidebarOpen(false); setSidebarQuery(''); }} 
              className="hover:rotate-90 transition-transform duration-500 text-black/50 hover:text-black"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Sidebar Search Bar Removed as per user request */}
          
          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-8 px-10 flex flex-col gap-6">
            <span className="text-[9px] font-semibold tracking-[0.4em] text-black/30 uppercase">Categories</span>
            <div className="flex flex-col gap-4">
              {navigationMenu.map((nav, i) => (
                <div 
                  key={nav.name}
                  className="flex flex-col"
                  style={{
                    transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-20px)',
                    opacity: isSidebarOpen ? 1 : 0,
                    transition: `all 0.5s cubic-bezier(0.16,1,0.3,1) ${0.15 + i * 0.06}s`
                  }}
                >
                  {nav.href ? (
                    <Link
                      href={nav.href}
                      onClick={() => { setIsSidebarOpen(false); setSidebarQuery(''); }}
                      className="flex items-center justify-between text-xs font-bold tracking-[0.2em] uppercase text-black/80 hover:text-[#067964] transition-colors duration-300 w-full text-left"
                    >
                      {nav.name}
                    </Link>
                  ) : (
                    <>
                      <button 
                        onClick={() => setExpandedCategory(expandedCategory === nav.name ? null : nav.name)}
                        className="flex items-center justify-between text-xs font-bold tracking-[0.2em] uppercase text-black/80 hover:text-[#067964] transition-colors duration-300 w-full text-left"
                      >
                        {nav.name}
                        <svg 
                          className={`w-4 h-4 transition-transform duration-300 ${expandedCategory === nav.name ? 'rotate-180' : ''}`} 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor" 
                          strokeWidth="2"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {/* Subcategories */}
                      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedCategory === nav.name ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}`}>
                        <div className="flex flex-col gap-3 pl-4 border-l-2 border-black/5">
                          {nav.items?.map((subItem) => (
                            <Link 
                              key={subItem.name} 
                              href={subItem.href}
                              onClick={() => { setIsSidebarOpen(false); setSidebarQuery(''); }}
                              className="text-sm font-light tracking-widest uppercase text-gray-500 hover:text-[#067964] transition-colors py-1"
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
              
              <div 
                className="flex flex-col gap-6 mt-6 pt-6 border-t border-black/5"
                style={{
                  transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-20px)',
                  opacity: isSidebarOpen ? 1 : 0,
                  transition: `all 0.5s cubic-bezier(0.16,1,0.3,1) ${0.15 + navigationMenu.length * 0.06}s`
                }}
              >
                <Link
                  href="/login"
                  className="text-xs font-bold tracking-[0.2em] uppercase text-black/80 hover:text-[#067964] transition-colors duration-300"
                  onClick={() => { setIsSidebarOpen(false); setSidebarQuery(''); }}
                >
                  LOGIN
                </Link>
                <Link
                  href="/orders"
                  className="text-xs font-bold tracking-[0.2em] uppercase text-black/80 hover:text-[#067964] transition-colors duration-300"
                  onClick={() => { setIsSidebarOpen(false); setSidebarQuery(''); }}
                >
                  ORDER
                </Link>
                <Link
                  href="/track-order"
                  className="text-xs font-bold tracking-[0.2em] uppercase text-black/80 hover:text-[#067964] transition-colors duration-300"
                  onClick={() => { setIsSidebarOpen(false); setSidebarQuery(''); }}
                >
                  TRACKORDER
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="p-8 border-t border-black/5 flex flex-col gap-4 bg-gray-50/50 shrink-0">
            <div className="flex justify-center mb-2">
              <img src="/images/org.png" alt="Elara Silver Logo" className="h-12 object-contain drop-shadow-sm brightness-0" />
            </div>
            {user ? (
              <>
                <Link 
                  href="/account"
                  className="px-6 py-4 bg-[#0B5E64] text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-black transition-colors text-center shadow-lg"
                  onClick={() => { setIsSidebarOpen(false); setSidebarQuery(''); }}
                >
                  My Account
                </Link>
                <button 
                  onClick={() => {
                    logout();
                    setIsSidebarOpen(false);
                    setSidebarQuery('');
                  }}
                  className="px-6 py-4 border border-black/20 text-black text-xs font-bold tracking-[0.2em] uppercase hover:border-black transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                href="/login"
                className="px-6 py-4 bg-[#0B5E64] text-white text-xs font-bold tracking-[0.2em] uppercase hover:opacity-90 transition-opacity text-center shadow-lg"
                onClick={() => { setIsSidebarOpen(false); setSidebarQuery(''); }}
              >
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

