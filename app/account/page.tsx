'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

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
          <h2 className="text-2xl font-light text-black mb-6 uppercase tracking-wider">Order History</h2>
          
          {user.orders && user.orders.length > 0 ? (
            <div className="flex flex-col gap-6">
              {user.orders.map((order: any) => (
                <div key={order.id} className="border border-gray-100 p-6 bg-gray-50 shadow-sm">
                  <div className="flex flex-wrap justify-between items-center mb-4 border-b border-gray-200 pb-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Order Number</p>
                      <p className="font-semibold text-black">{order.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Date</p>
                      <p className="font-semibold text-black">{order.date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Status</p>
                      <span className="px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-wider">{order.status}</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Total</p>
                      <p className="font-semibold text-black">${order.total.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Items</p>
                    <div className="flex flex-col gap-2">
                      {order.items.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-black">{item.name} x{item.quantity}</span>
                          <span className="font-semibold">${item.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-8 border border-gray-100 text-center">
              <p className="text-gray-500 mb-0">You haven't placed any orders yet.</p>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-light text-black mb-6 uppercase tracking-wider">Account Details</h2>
          <div className="bg-gray-50 p-8 border border-gray-100">
            <div className="mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Name</p>
              <p className="text-lg text-black">{user.firstName} {user.lastName}</p>
            </div>
            <div className="mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Email</p>
              <p className="text-lg text-black">{user.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
