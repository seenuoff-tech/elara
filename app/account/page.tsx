'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Package, User as UserIcon, LogOut, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function AccountPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen pt-48 px-6 flex justify-center">
        <p className="text-gray-500">Loading your account...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-48 px-6 md:px-12 max-w-7xl mx-auto pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-gray-200 pb-6 gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-light text-black tracking-wide mb-2 uppercase">My Account</h1>
          <p className="text-gray-500 text-lg">Welcome back, {user.firstName} {user.lastName}</p>
        </div>
        <button 
          onClick={logout}
          className="px-6 py-2 border border-black text-black text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-4">
            <Package className="w-6 h-6 text-[#0B5E64]" />
            <h2 className="text-2xl font-light text-black uppercase tracking-wider">Order History</h2>
          </div>
          
          {user.orders && user.orders.length > 0 ? (
            <div className="flex flex-col gap-6">
              {user.orders.map((order: any) => (
                <div key={order.id} className="border border-gray-100 p-6 bg-gray-50 rounded-xl shadow-sm transition-all hover:shadow-md">
                  <div className="flex flex-wrap justify-between items-center mb-5 border-b border-gray-200 pb-5 gap-4">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Order Number</p>
                      <p className="font-bold text-[#0B5E64]">{order.id}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Date</p>
                      <p className="font-semibold text-black">{order.date}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Status</p>
                      <span className="px-3 py-1 bg-[#0B5E64] text-white text-[10px] font-bold uppercase tracking-wider rounded-full">{order.status}</span>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Total</p>
                      <p className="font-semibold text-black">₹{order.total.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">Items</p>
                    <div className="flex flex-col gap-3">
                      {order.items.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between items-center text-sm bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                          <span className="text-gray-800 font-medium flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-[#0B5E64]/60"></div>
                            {item.name} <span className="text-gray-400 text-xs px-2 py-0.5 bg-gray-50 rounded-full">Qty: {item.quantity}</span>
                          </span>
                          <span className="font-bold text-[#0B5E64]">₹{item.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-12 rounded-xl border border-gray-100 text-center shadow-inner">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4 text-lg">You haven't placed any orders yet.</p>
              <Link href="/shop" className="inline-block px-8 py-3 bg-[#0B5E64] text-white text-sm font-bold uppercase tracking-widest hover:bg-[#094A4F] transition-colors rounded-full">
                Start Shopping
              </Link>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-4">
            <UserIcon className="w-6 h-6 text-[#0B5E64]" />
            <h2 className="text-2xl font-light text-black uppercase tracking-wider">Account Details</h2>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-100">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-semibold">Loyalty Points</p>
              <div className="flex items-center justify-between">
                <p className="text-4xl font-bold text-[#0B5E64] flex items-center gap-3 drop-shadow-sm">
                  💎 {user.points || 0}
                </p>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Conversion</p>
                  <p className="text-xs font-semibold text-green-700">1000 Pts = ₹1000</p>
                </div>
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-semibold">Full Name</p>
                <p className="text-lg text-gray-900 font-medium">{user.firstName} {user.lastName}</p>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-semibold">Email Address</p>
                <p className="text-base text-gray-900">{user.email}</p>
              </div>
              
              <div className="pt-8">
                <button 
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-red-200 text-red-600 bg-red-50 text-xs font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all rounded-lg"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
