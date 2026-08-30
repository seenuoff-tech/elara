'use client';

import React, { useState, useEffect } from 'react';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        if (data.success) {
          const formattedInvoices = data.orders.map((order: any) => ({
            id: `INV-${order.orderNumber?.split('-')[1] || order.id.toString().substring(0,6)}`,
            orderId: order.orderNumber,
            customer: order.customerName,
            date: new Date(order.createdAt).toLocaleDateString(),
            amount: `₹${order.totalAmount}`,
            status: order.paymentStatus === 'Completed' || order.paymentStatus === 'Paid' ? 'Paid' : (order.paymentStatus || 'Pending'),
            rawOrder: order
          }));
          setInvoices(formattedInvoices);
        }
      } catch (error) {
        console.error('Failed to fetch orders for invoices', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const handleDownloadPdf = (invoice: any) => {
    // In a real app, this would generate and trigger a PDF download.
    // Here we'll simulate the download flow.
    const element = document.createElement('a');
    const file = new Blob([`Invoice ${invoice.id}\nCustomer: ${invoice.customer}\nAmount: ${invoice.amount}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${invoice.id}.txt`; // using txt as a mock for PDF
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-sm text-gray-500 mt-1">View, download, and manage customer invoices.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Search by Invoice or Order ID..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0B5E64] focus:outline-none"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading invoices...</div>
          ) : invoices.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No invoices found.</div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Invoice ID</th>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{invoice.id}</td>
                    <td className="px-6 py-4 text-[#0B5E64] hover:underline cursor-pointer">{invoice.orderId}</td>
                    <td className="px-6 py-4 text-gray-600">{invoice.customer}</td>
                    <td className="px-6 py-4 text-gray-500">{invoice.date}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{invoice.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        invoice.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-3">
                      <button 
                        onClick={() => setSelectedInvoice(invoice)} 
                        className="text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Preview
                      </button>
                      <button 
                        onClick={() => handleDownloadPdf(invoice)} 
                        className="text-[#0B5E64] hover:text-[#084A4F] flex items-center gap-1 transition-colors font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Invoice Preview Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">Invoice Preview</h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleDownloadPdf(selectedInvoice)}
                  className="px-3 py-1.5 bg-[#0B5E64] text-white text-xs font-medium rounded hover:bg-[#084A4F] transition-colors flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download PDF
                </button>
                <button 
                  onClick={() => setSelectedInvoice(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-200"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-8 text-sm max-h-[70vh] overflow-y-auto" id="invoice-printable-area">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-2xl font-bold tracking-widest uppercase text-[#0B5E64] mb-1">ELARA</h1>
                  <p className="text-gray-500 text-xs">Fine Silver Jewellery</p>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-medium text-gray-800 mb-1">INVOICE</h2>
                  <p className="text-gray-500">{selectedInvoice.id}</p>
                </div>
              </div>
              
              <div className="flex justify-between mb-8 border-b border-gray-100 pb-8">
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Billed To</p>
                  <p className="font-medium text-gray-900">{selectedInvoice.customer}</p>
                  <p className="text-gray-500 mt-1">Order: {selectedInvoice.orderId}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Invoice Date</p>
                  <p className="font-medium text-gray-900">{selectedInvoice.date}</p>
                  <p className="mt-4 text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Status</p>
                  <p className={`font-medium ${selectedInvoice.status === 'Paid' ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedInvoice.status}
                  </p>
                </div>
              </div>
              
              <table className="w-full text-left mb-8">
                <thead className="text-xs text-gray-500 uppercase border-b border-gray-200">
                  <tr>
                    <th className="py-2 font-medium">Description</th>
                    <th className="py-2 font-medium text-center">Qty</th>
                    <th className="py-2 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="border-b border-gray-100">
                  <tr>
                    <td className="py-4 text-gray-800">Jewellery Items (Order {selectedInvoice.orderId})</td>
                    <td className="py-4 text-gray-600 text-center">1</td>
                    <td className="py-4 text-gray-800 text-right font-medium">{selectedInvoice.amount}</td>
                  </tr>
                </tbody>
              </table>
              
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span>{selectedInvoice.amount}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Tax (GST)</span>
                    <span>Included</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[#0B5E64] pt-2 border-t border-gray-200 mt-2">
                    <span>Total</span>
                    <span>{selectedInvoice.amount}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 pt-8 border-t border-gray-100 text-center text-gray-400 text-xs">
                <p>Thank you for choosing Elara Silver.</p>
                <p className="mt-1">If you have any questions about this invoice, please contact support@elarasilver.com</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
