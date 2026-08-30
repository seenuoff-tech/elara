'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';

export default function CouponsEditor() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  const fetchCoupons = async () => {
    try {
      const res = await fetch('/api/coupons');
      const json = await res.json();
      if (json.success) setCoupons(json.coupons);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !formData.id;
    const url = isNew ? '/api/coupons' : `/api/coupons/${formData.id}`;
    const method = isNew ? 'POST' : 'PUT';
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setIsEditing(false);
        fetchCoupons();
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('Error saving coupon');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await fetch(`/api/coupons/${id}`, { method: 'DELETE' });
      fetchCoupons();
    } catch (e) {
      alert('Error deleting');
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Coupons Management</h1>
        {!isEditing && (
          <button 
            onClick={() => {
              setFormData({ code: '', discountType: 'percentage', discountValue: 0, startDate: new Date().toISOString().split('T')[0], endDate: new Date().toISOString().split('T')[0], status: 'Active' });
              setIsEditing(true);
            }} 
            className="flex items-center px-4 py-2 bg-[#0B5E64] text-white rounded-lg hover:bg-[#094A4F]"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Coupon
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-xl border border-gray-200 max-w-2xl space-y-4">
          <h2 className="text-xl font-bold mb-4">{formData.id ? 'Edit' : 'Create'} Coupon</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Coupon Code</label>
              <input type="text" required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} className="w-full border p-2 rounded focus:outline-[#0B5E64]" placeholder="e.g. SAVE20" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full border p-2 rounded focus:outline-[#0B5E64]">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Discount Type</label>
              <select value={formData.discountType} onChange={e => setFormData({...formData, discountType: e.target.value})} className="w-full border p-2 rounded focus:outline-[#0B5E64]">
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Rate (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Discount Value</label>
              <input type="number" required min="0" step="any" value={formData.discountValue} onChange={e => setFormData({...formData, discountValue: e.target.value})} className="w-full border p-2 rounded focus:outline-[#0B5E64]" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input type="date" required value={formData.startDate.split('T')[0]} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full border p-2 rounded focus:outline-[#0B5E64]" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input type="date" required value={formData.endDate.split('T')[0]} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full border p-2 rounded focus:outline-[#0B5E64]" />
            </div>
          </div>
          
          <div className="flex gap-4 pt-4">
            <button type="submit" className="px-6 py-2 bg-[#0B5E64] text-white rounded-lg hover:bg-[#094A4F]">Save Coupon</button>
            <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {isLoading ? (
            <p className="p-6">Loading coupons...</p>
          ) : coupons.length === 0 ? (
            <p className="p-6 text-gray-500">No coupons found.</p>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 font-medium">
                <tr>
                  <th className="px-6 py-4">Code</th>
                  <th className="px-6 py-4">Discount</th>
                  <th className="px-6 py-4">Validity</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {coupons.map(coupon => (
                  <tr key={coupon.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold text-[#0B5E64]">{coupon.code}</td>
                    <td className="px-6 py-4">{coupon.discountValue}{coupon.discountType === 'percentage' ? '%' : '₹'}</td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {new Date(coupon.startDate).toLocaleDateString()} - {new Date(coupon.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${coupon.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {coupon.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-3">
                      <button onClick={() => { setFormData(coupon); setIsEditing(true); }} className="text-blue-600 hover:text-blue-800"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(coupon.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
