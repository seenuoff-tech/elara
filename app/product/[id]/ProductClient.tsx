'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useProducts } from '../../../context/ProductsContext';
import { usePricing } from '../../../components/PricingProvider';
import { useWishlist } from '../../../context/WishlistContext';
import { useCart } from '../../../context/CartContext';
import SimilarProducts from '../../../components/SimilarProducts';

export default function ProductClient() {
  const { id } = useParams();
  const router = useRouter();
  const { products, isLoaded } = useProducts();
  const decodedId = decodeURIComponent(String(id));
  const product = products.find(p => 
    String(p.id) === decodedId || 
    p.name.toLowerCase().replace(/[\s-]+/g, '-') === decodedId.toLowerCase().replace(/[\s-]+/g, '-')
  );
  const { wishlist, toggleWishlist } = useWishlist();
  const { calculatePrice } = usePricing();
  const { triggerPackagingAnimation, setIsGiftWrap } = useCart();
  
  const [selectedFinish, setSelectedFinish] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [pincode, setPincode] = useState('');
  const [deliveryMessage, setDeliveryMessage] = useState('');
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isGift, setIsGift] = useState(false);

  // Parse sizes
  const productSizes: string[] = Array.isArray(product?.sizes) 
    ? product.sizes 
    : (product?.sizes ? (typeof product.sizes === 'string' ? JSON.parse(product.sizes) : product.sizes) : []);

  useEffect(() => {
    if (productSizes.length > 0 && !selectedSize) {
      setSelectedSize(productSizes[0]);
    }
  }, [productSizes, selectedSize]);

  const isOutOfStock = (product?.stock !== undefined && product.stock <= 0) || product?.status === 'Out of Stock';

  // Show spinner while products are loading from API
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-48">
        <div className="w-10 h-10 border-4 border-[#0B5E64] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-48">
        <h1 className="text-2xl">Product not found</h1>
        <button onClick={() => router.push('/')} className="ml-4 underline">Go Home</button>
      </div>
    );
  }

  // Always show main image first, then sub gallery images
  const mainImageEntry = { url: product.image || '/images/org.png', alt: product.name };
  const subGallery = product.gallery && product.gallery.length > 0 ? product.gallery : [];
  const gallery = [mainImageEntry, ...subGallery];
    
  const finishes = product.finishes || [];
  
  // Handle case where description is a JSON string or an object
  let parsedDescription = product.description;
  try {
    // Loop to unwrap multiple layers of stringification if they exist
    while (typeof parsedDescription === 'string') {
      const trimmed = parsedDescription.trim();
      if (trimmed.startsWith('{') || trimmed.startsWith('[') || (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
        const nextParsed = JSON.parse(trimmed);
        if (typeof nextParsed === 'string' && nextParsed === parsedDescription) break;
        parsedDescription = nextParsed;
      } else {
        break;
      }
    }
  } catch (e) {
    // Fallback to whatever we successfully parsed so far
  }

  const descInspiration = typeof parsedDescription === 'string' 
    ? parsedDescription 
    : (parsedDescription?.inspiration || 'A beautiful piece crafted with precision.');
    
  const descDesign = typeof parsedDescription === 'object' && parsedDescription !== null && parsedDescription.design 
    ? parsedDescription.design 
    : null;

  const isWishlisted = wishlist.includes(product.id);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product.id);
  };

  const handleCheckPincode = () => {
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      setDeliveryMessage('Delivery available in 3-5 business days.');
    } else {
      setDeliveryMessage('Please enter a valid 6-digit pincode.');
    }
  };

  const handleAddToCart = () => {
    // We mock the shop product structure for the animation
    const mockProduct = {
      id: product.id.toString(),
      name: product.name,
      category: 'Necklace',
      collection: 'New Arrivals',
      price: product.newPrice ? `₹${product.newPrice}` : (product.price ? `₹${product.price}` : calculatePrice(product.weightInGrams || 0, product.category)),
      image: product.image || '/images/org.png',
      tagline: product.tagline || '',
      description: typeof product.description === 'string' ? product.description : (product.description?.design || ''),
      hallmark: product.hallmark || '',
      stock: product.stock !== undefined ? product.stock : Infinity,
      sizes: product.sizes || [],
      specs: product.specs || [],
      details: product.details || [],
      colorTheme: product.colorTheme || '#E5E4E2',
      ringGeometry: product.ringGeometry || {
        radius: 1.4, tubularRadius: 0.28, radialSegments: 32, tubularSegments: 64,
        hasDiamonds: false, diamondCount: 0, diamondSize: 0, diamondLayout: 'none' as const,
        twist: false, facets: false
      }
    };
    if (isGift) {
      setIsGiftWrap(true);
    }
    triggerPackagingAnimation(mockProduct, 'Standard');
  };

  const rawPriceStr = product.newPrice ? String(product.newPrice) : (product.price ? String(product.price) : calculatePrice(product.weightInGrams || 0, product.category));
  const sellingPriceNum = parseFloat(rawPriceStr.replace(/[^\d.]/g, '')) || 0;
  const strikePriceNum = Math.round(sellingPriceNum * 1.10);

  return (
    <div className="min-h-screen bg-[#fafafa] pt-48 md:pt-56 pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Breadcrumb (Optional, basic implementation) */}
        <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-8 mt-4">
          <span className="hover:text-black cursor-pointer" onClick={() => router.push('/')}>Home</span> 
          <span className="mx-2">/</span> 
          <span className="hover:text-black cursor-pointer" onClick={() => router.push('/shop')}>Shop</span>
          {product.category && (
            <>
              <span className="mx-2">/</span>
              <span className="hover:text-black cursor-pointer" onClick={() => router.push(`/shop?category=${encodeURIComponent(product.category)}`)}>{product.category}</span>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-black">{product.name}</span>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Left Column: Image Gallery */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <div className="aspect-[4/5] md:aspect-square relative bg-gray-50 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden">
              <Image 
                src={gallery[activeImageIndex]?.url || gallery[0]?.url}
                alt={gallery[activeImageIndex]?.alt || product.name || 'Product Image'}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <button 
                onClick={() => document.getElementById('similar-products')?.scrollIntoView({ behavior: 'smooth' })}
                className="absolute bottom-4 right-4 bg-white/80 backdrop-blur border border-black/10 text-xs px-3 py-1.5 rounded-full flex items-center gap-2 hover:bg-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                See Similar
              </button>
              <div className="absolute bottom-4 left-4 flex items-center gap-1 text-xs font-semibold text-gray-600 bg-white/80 backdrop-blur px-2 py-1 rounded-full border border-black/5">
                <span className="text-amber-400">★</span>
                <span>{product.rating || '4.8'} | {product.reviewsCount || '154'}</span>
              </div>
            </div>
            
            {/* Thumbnails */}
            {gallery.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {gallery.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 shrink-0 bg-gray-50 rounded-xl border overflow-hidden ${activeImageIndex === idx ? 'border-black' : 'border-gray-200'} hover:border-black/50 transition-colors`}
                  >
                    <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details */}
          <div className="w-full md:w-1/2 flex flex-col">
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <div className="flex items-end gap-3 mb-1">
                  <span className="text-3xl font-bold text-[#0B5E64]">
                    ₹{product.newPrice 
                      ? product.newPrice 
                      : String(product.price ? product.price : calculatePrice(product.weightInGrams || 0, product.category)).replace('₹', '')}
                  </span>
                  <span className="text-lg text-gray-400 line-through mb-1">₹{strikePriceNum.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-3">MRP Incl. of all taxes</p>
                
                {/* Reward Points */}
                <div className="inline-flex items-center gap-2 bg-[#fdf5e6] border border-[#f5d08e] px-3 py-1.5 rounded-md">
                  <span className="text-xs text-[#b8860b] font-medium tracking-wide">
                    Buy this product and earn <span className="font-bold">{Math.floor(sellingPriceNum * 0.05)} Points</span>
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button onClick={handleToggleWishlist} className="hover:scale-110 transition-transform">
                  {isWishlisted ? (
                    <svg className="w-6 h-6 text-[#0B5E64]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-gray-400 hover:text-[#0B5E64]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  )}
                </button>
                <button className="hover:scale-110 transition-transform text-gray-400 hover:text-black">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
              </div>
            </div>

            <h1 className="text-xl text-gray-700 mb-2">{product.name}</h1>
            <p className="text-sm font-semibold tracking-wide uppercase text-black mb-8">Made With {product.material || 'Premium Material'}</p>

            {/* Choose Finish */}
            {finishes.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-3">Choose Your Finish</p>
                <div className="flex gap-4 flex-wrap">
                  {finishes.map((finish, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setSelectedFinish(idx)}
                      className={`flex flex-col items-center p-3 border rounded-xl transition-all ${selectedFinish === idx ? 'border-black shadow-md bg-black/5' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <div className="w-14 h-14 relative mb-2">
                        <Image src={finish.image} alt={finish.name} fill className="object-contain" />
                      </div>
                      <span className="text-[10px] font-bold tracking-widest uppercase">{finish.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Choose Size */}
            {productSizes.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-700">Select Size</p>
                  <span className="text-xs text-gray-400">Selected: <strong className="text-[#0B5E64]">{selectedSize || 'None'}</strong></span>
                </div>
                <div className="flex gap-2.5 flex-wrap">
                  {productSizes.map((sizeOption, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSize(sizeOption)}
                      className={`min-w-[48px] h-10 px-3.5 text-xs font-semibold rounded-lg border transition-all ${
                        selectedSize === sizeOption
                          ? 'border-[#0B5E64] bg-[#0B5E64] text-white shadow-sm'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {sizeOption}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Estimated Delivery */}
            <div className="mb-8">
              <p className="text-sm text-gray-600 mb-2">Estimated Delivery Time</p>
              <div className="flex border border-gray-200 rounded-lg overflow-hidden bg-white max-w-sm mb-6">
                <input 
                  type="text" 
                  placeholder="Enter 6 digit pincode" 
                  className="flex-1 px-4 py-3 text-sm focus:outline-none"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  maxLength={6}
                />
                <button 
                  onClick={handleCheckPincode}
                  className="bg-[#0B5E64] text-white px-6 text-sm font-semibold hover:bg-[#08494E] transition-colors"
                >
                  Check
                </button>
              </div>
              {deliveryMessage && (
                <p className={`text-sm mb-6 -mt-4 ${deliveryMessage.includes('valid') ? 'text-red-500' : 'text-green-600 font-medium'}`}>
                  {deliveryMessage}
                </p>
              )}
            </div>

            {/* Action Area (Sticky on mobile, inline on desktop) */}
            <div className="fixed bottom-0 left-0 w-full bg-white p-4 border-t border-gray-200 z-50 md:static md:bg-transparent md:p-0 md:border-0 md:z-auto shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.1)] md:shadow-none mb-0 md:mb-12">
              {/* Stock Notice */}
              {isOutOfStock ? (
                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  Currently Out of Stock. This item cannot be purchased right now.
                </div>
              ) : (
                /* Gift Wrap */
                <div className="flex items-center gap-2 mb-3">
                  <input 
                    type="checkbox" 
                    id="giftWrap" 
                    checked={isGift}
                    onChange={(e) => setIsGift(e.target.checked)}
                    className="w-4 h-4 text-[#0B5E64] focus:ring-[#0B5E64] border-gray-300 rounded"
                  />
                  <label htmlFor="giftWrap" className="text-sm text-gray-700">
                    Is this a <span className="text-[#0B5E64] font-semibold">Gift?</span> 🎁 Wrap it for just (₹50)
                  </label>
                </div>
              )}

              <div className="flex gap-3">
                <button 
                  disabled={isOutOfStock}
                  className={`flex-1 py-3 border font-bold tracking-widest uppercase rounded-lg transition-colors ${
                    isOutOfStock 
                      ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white border-[#0B5E64] text-[#0B5E64] hover:bg-gray-50'
                  }`}
                >
                  {isOutOfStock ? 'Unavailable' : 'Buy Now'}
                </button>
                <button 
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className={`flex-1 py-3 font-bold tracking-widest uppercase rounded-lg transition-colors ${
                    isOutOfStock 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' 
                      : 'bg-[#0B5E64] text-white shadow-md hover:bg-[#08494E]'
                  }`}
                >
                  {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>

            {/* Product Description Expandable */}
            <div className="mb-12 bg-[#fafafa]">
              <div className="bg-[#fce4e9]/30 py-3 px-4 rounded-t-xl border border-b-0 border-[#fce4e9]">
                <span className="text-gray-700 text-lg font-medium">Product Description</span>
              </div>
              <div className="border border-[#fce4e9] rounded-b-xl p-6 bg-white">
                <div className="text-sm text-gray-700 space-y-4">
                  <div>
                    <h4 className="font-bold text-black mb-1">{descDesign ? 'The Inspiration:' : 'Details:'}</h4>
                    <p className="leading-relaxed whitespace-pre-line">
                      {isDescriptionExpanded 
                        ? descInspiration 
                        : `${descInspiration.substring(0, 100)}...`}
                    </p>
                  </div>
                  
                  {isDescriptionExpanded && descDesign && (
                    <div className="mt-4">
                      <h4 className="font-bold text-black mb-1">The Design:</h4>
                      <p className="leading-relaxed whitespace-pre-line">{descDesign}</p>
                    </div>
                  )}
                  
                  {descInspiration.length > 100 && (
                    <button 
                      onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                      className="text-[#849fb4] text-sm hover:underline font-medium mt-2 focus:outline-none"
                    >
                      {isDescriptionExpanded ? 'Show Less' : 'Show More'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products Section */}
      <SimilarProducts currentProductId={product.id} />
    </div>
  );
}
