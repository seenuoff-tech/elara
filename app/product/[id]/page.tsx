import React from 'react';
import ProductClient from './ProductClient';
import { newArrivalsData } from '../../../data/newArrivals';
import { mensProducts } from '../../../data/mensProducts';


export function generateStaticParams() {
  const allProducts = [...newArrivalsData, ...mensProducts];
  const params = [];
  
  allProducts.forEach(product => {
    // Generate the path for the actual product ID
    params.push({ id: product.id.toString() });
    
    // Generate the path for the URL-friendly product name (slug) used in the shop page
    if (product.name) {
      params.push({ id: product.name.toLowerCase().replace(/\s+/g, '-') });
    }
  });
  
  return params;
}

export default function Page() {
  return <ProductClient />;
}
