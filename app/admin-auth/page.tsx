'use client';

import React from 'react';
import Link from 'next/link';
import { usePricing } from '@/components/PricingProvider';

export default function AdminDashboard() {
  const { silverRates, updateCategoryRate, gstPercentage, setGstPercentage, saveSettings } = usePricing();
  
  const categories = [
    'Rings', 'Necklace', 'Bracelet', 'Earings', 'Anklets', 'Chains', 'Toe rings', 'Mens-Rings', 'Mens-Chains', 'Mens-Bracelet', 'Kids-Earings'
  ];
  
  const [selectedCategory, setSelectedCategory] = React.useState(categories[0]);
  const [localSilverRate, setLocalSilverRate] = React.useState(silverRates[selectedCategory] || 85);
  const [localGst, setLocalGst] = React.useState(gstPercentage);
  const [showSuccess, setShowSuccess] = React.useState(false);

  React.useEffect(() => {
    setLocalSilverRate(silverRates[selectedCategory] || 85);
  }, [selectedCategory, silverRates]);

  const handleUpdatePrice = async () => {
    // Optimistic UI update
    updateCategoryRate(selectedCategory, localSilverRate);
    setGstPercentage(localGst);
    
    // Construct new rates object
    const newRates = { ...silverRates, [selectedCategory]: localSilverRate };
    
    // Save to database
    try {
      const res = await saveSettings(newRates, localGst);
      if (res && res.success === false) {
        alert("Failed to save to database. Please check connection.");
      } else {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (e) {
      alert("Error saving settings.");
    }
  };

  const stats = [
    { name: 'Total Revenue', value: '₹1,24,500', change: '+12%', changeType: 'positive' },
    { name: 'Active Orders', value: '14', change: '+2', changeType: 'positive' },
    { name: 'Total Products', value: '128', change: '+5', changeType: 'positive' },
    { name: 'Low Stock Alerts', value: '3', change: '-1', changeType: 'negative' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <div className="flex items-center gap-3">
          <Link 
            href="/admin-auth/products/new"
            className="px-4 py-2 bg-[#0B5E64] text-white text-sm font-medium rounded-lg hover:bg-[#084A4F] transition-colors"
          >
            Add Product
          </Link>
        </div>
      </div>

      {/* Daily Pricing Settings */}
      <div className="bg-gradient-to-r from-[#0B5E64]/10 to-transparent border border-[#0B5E64]/20 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#0B5E64]">Daily Pricing Settings</h2>
          {showSuccess && <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full animate-pulse">Prices Updated Successfully!</span>}
        </div>
        <div className="flex flex-col sm:flex-row items-end gap-6 flex-wrap">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-48 px-4 py-2 border border-[#0B5E64]/30 rounded-lg focus:ring-2 focus:ring-[#0B5E64] focus:outline-none bg-white"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat.replace('-', ' ')}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Silver Rate (₹ per gram)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
              <input 
                type="number" 
                value={localSilverRate === 0 ? '' : localSilverRate}
                onFocus={(e) => e.target.select()}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setLocalSilverRate(isNaN(val) ? 0 : val);
                }}
                min={0}
                placeholder="0"
                className="w-full sm:w-36 pl-8 pr-4 py-2 border border-[#0B5E64]/30 rounded-lg focus:ring-2 focus:ring-[#0B5E64] focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GST Percentage (%)</label>
            <div className="relative">
              <input 
                type="number" 
                value={localGst === 0 ? '' : localGst}
                onFocus={(e) => e.target.select()}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setLocalGst(isNaN(val) ? 0 : val);
                }}
                min={0}
                placeholder="0"
                className="w-full sm:w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B5E64] focus:outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">%</span>
            </div>
          </div>
          <button 
            onClick={handleUpdatePrice}
            className="px-6 py-2 bg-[#0B5E64] text-white text-sm font-medium rounded-lg hover:bg-[#084A4F] transition-colors h-10"
          >
            Update Prices
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Clicking "Update Prices" will instantly recalculate the price for all weight-based products.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">{stat.name}</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-3xl font-semibold text-gray-900">{stat.value}</p>
              <span className={`text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <Link href="/admin-auth/orders" className="text-sm text-[#0B5E64] hover:underline font-medium">View all</Link>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 rounded-l-lg">Order ID</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 rounded-r-lg">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 'ORD-1023', customer: 'Rahul Sharma', date: 'Oct 24, 2026', status: 'Processing', total: '₹4,500' },
                    { id: 'ORD-1022', customer: 'Priya Patel', date: 'Oct 23, 2026', status: 'Delivered', total: '₹12,000' },
                    { id: 'ORD-1021', customer: 'Arun Kumar', date: 'Oct 22, 2026', status: 'Shipped', total: '₹3,200' },
                    { id: 'ORD-1020', customer: 'Sneha Reddy', date: 'Oct 21, 2026', status: 'Delivered', total: '₹8,900' },
                  ].map((order) => (
                    <tr key={order.id} className="border-b border-gray-50 last:border-0">
                      <td className="px-4 py-3 font-medium text-gray-900">{order.id}</td>
                      <td className="px-4 py-3 text-gray-600">{order.customer}</td>
                      <td className="px-4 py-3 text-gray-500">{order.date}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{order.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6 space-y-4">
            <Link href="/admin-auth/products" className="flex items-center p-3 text-sm font-medium text-gray-700 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add New Product
            </Link>
            <Link href="/admin-auth/hero" className="flex items-center p-3 text-sm font-medium text-gray-700 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Update Hero Banner
            </Link>
            <Link href="/admin-auth/reports" className="flex items-center p-3 text-sm font-medium text-gray-700 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Generate Sales Report
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
