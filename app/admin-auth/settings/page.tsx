'use client';

import React, { useState, useEffect } from 'react';

export default function AdminSettingsPage() {
  const [silverRates, setSilverRates] = useState<Record<string, number>>({});
  const [gstPercentage, setGstPercentage] = useState<number>(3);
  const [invoiceSettings, setInvoiceSettings] = useState({
    branchName: 'ELARA SILVER',
    gstin: '33HTQPS8640C1ZB',
    address: '130/134 A North Car Street, Srivilliputtur - 626125',
    state: 'Tamil Nadu',
    stateCode: '33',
    country: 'India',
    pinCode: '626125',
    phone: '6369825925',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pricingRes, invoiceRes] = await Promise.all([
          fetch('/api/settings/pricing'),
          fetch('/api/settings/invoice')
        ]);
        const pricingData = await pricingRes.json();
        const invoiceData = await invoiceRes.json();

        if (pricingData.success && pricingData.data) {
          setSilverRates(pricingData.data.silverRates || {});
          setGstPercentage(pricingData.data.gstPercentage ?? 3);
        }

        if (invoiceData.success && invoiceData.data) {
          setInvoiceSettings(prev => ({ ...prev, ...invoiceData.data }));
        }
      } catch (err) {
        console.error('Failed to load settings', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const [pricingRes, invoiceRes] = await Promise.all([
        fetch('/api/settings/pricing', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ silverRates, gstPercentage })
        }),
        fetch('/api/settings/invoice', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(invoiceSettings)
        })
      ]);

      const pricingJson = await pricingRes.json();
      const invoiceJson = await invoiceRes.json();

      if (pricingJson.success && invoiceJson.success) {
        setMessage('Settings saved successfully!');
      } else {
        setMessage('Failed to save some settings.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error saving settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading Admin Settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage Store Pricing Rules, GST & Tax Invoice Information.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg text-sm font-medium ${message.includes('success') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Silver Rate Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0B5E64]" />
            Category Silver Rates (Per Gram)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(silverRates).length > 0 ? (
              Object.entries(silverRates).map(([category, rate]) => (
                <div key={category}>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">{category} Rate (₹/g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={rate}
                    onChange={(e) => setSilverRates({ ...silverRates, [category]: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0B5E64] focus:outline-none bg-white"
                  />
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No category rates found.</p>
            )}
          </div>
          <div className="pt-2">
            <label className="block text-xs font-semibold text-gray-700 mb-1">GST Percentage (%)</label>
            <input
              type="number"
              step="0.1"
              value={gstPercentage}
              onChange={(e) => setGstPercentage(parseFloat(e.target.value) || 0)}
              className="w-full md:w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0B5E64] focus:outline-none bg-white"
            />
          </div>
        </div>

        {/* Invoice Branch & Store Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0B5E64]" />
            Tax Invoice (Sales) Store & Branch Info
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Branch Name</label>
              <input
                type="text"
                value={invoiceSettings.branchName}
                onChange={(e) => setInvoiceSettings({ ...invoiceSettings, branchName: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0B5E64] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">GSTIN</label>
              <input
                type="text"
                value={invoiceSettings.gstin}
                onChange={(e) => setInvoiceSettings({ ...invoiceSettings, gstin: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0B5E64] focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Address</label>
              <input
                type="text"
                value={invoiceSettings.address}
                onChange={(e) => setInvoiceSettings({ ...invoiceSettings, address: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0B5E64] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">State</label>
              <input
                type="text"
                value={invoiceSettings.state}
                onChange={(e) => setInvoiceSettings({ ...invoiceSettings, state: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0B5E64] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">State Code</label>
              <input
                type="text"
                value={invoiceSettings.stateCode}
                onChange={(e) => setInvoiceSettings({ ...invoiceSettings, stateCode: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0B5E64] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Pin Code</label>
              <input
                type="text"
                value={invoiceSettings.pinCode}
                onChange={(e) => setInvoiceSettings({ ...invoiceSettings, pinCode: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0B5E64] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                value={invoiceSettings.phone}
                onChange={(e) => setInvoiceSettings({ ...invoiceSettings, phone: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0B5E64] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-[#0B5E64] text-white text-sm font-semibold rounded-lg hover:bg-[#084A4F] transition-colors shadow-sm disabled:opacity-50"
          >
            {saving ? 'Saving Settings...' : 'Save All Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
