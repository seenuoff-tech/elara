'use client';

import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [invoiceSettings, setInvoiceSettings] = useState({
    companyName: 'ELARA SILVER',
    tagline: 'Fine 925 Sterling Silver Jewellery',
    logoUrl: '/images/footerlogo.PNG',
    websiteUrl: 'www.elarasilver.com',
    supportEmail: 'support@elarasilver.com',
    gstin: '',
    pan: '',
    currencySymbol: 'INR',
    showStatusBadge: false,
    showPan: false,
    showGstin: false,
    termsText: '• Goods once sold can be returned within 7 days per return policy.\n• Pure 925 Sterling Silver certified products.',
    signatoryText: 'ELARA SILVER AUTHORIZED SIGNATORY',
    signatorySubtext: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, settingsRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/settings/invoice')
        ]);
        
        const ordersData = await ordersRes.json();
        const settingsData = await settingsRes.json();

        if (settingsData.success && settingsData.data) {
          setInvoiceSettings(prev => ({ ...prev, ...settingsData.data }));
        }

        if (ordersData.success) {
          const symbol = settingsData.data?.currencySymbol || 'INR';
          const formattedInvoices = ordersData.orders.map((order: any) => ({
            id: `INV-${order.orderNumber?.split('-')[1] || order.id.toString().substring(0, 6)}`,
            orderId: order.orderNumber,
            customer: order.customerName,
            email: order.email || 'N/A',
            phone: order.phone || 'N/A',
            address: `${order.address || ''}, ${order.city || ''}, ${order.state || ''} ${order.pincode || ''}`.trim().replace(/^,|,$/g, ''),
            date: new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            rawAmount: order.totalAmount || 0,
            amount: `${symbol} ${(order.totalAmount || 0).toLocaleString('en-IN')}`,
            status: order.paymentStatus === 'Completed' || order.paymentStatus === 'Paid' ? 'Paid' : (order.paymentStatus || 'Pending'),
            items: order.items || [],
            rawOrder: order
          }));
          setInvoices(formattedInvoices);
        }
      } catch (error) {
        console.error('Failed to fetch data for invoices', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      const res = await fetch('/api/settings/invoice', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceSettings)
      });
      const data = await res.json();
      if (data.success) {
        // Update formatted amount for existing list
        setInvoices(prev => prev.map(inv => ({
          ...inv,
          amount: `${invoiceSettings.currencySymbol} ${inv.rawAmount.toLocaleString('en-IN')}`
        })));
        setIsSettingsOpen(false);
        alert('Invoice settings saved successfully!');
      } else {
        alert('Failed to save settings.');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving settings.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleDownloadPdf = (invoice: any) => {
    const doc = new jsPDF();

    // Brand Colors
    const tealColor: [number, number, number] = [11, 94, 100]; // #0B5E64
    const darkGray: [number, number, number] = [50, 50, 50];

    // Header Background Accent Bar
    doc.setFillColor(...tealColor);
    doc.rect(0, 0, 210, 8, 'F');

    // Title / Brand Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(...tealColor);
    doc.text(invoiceSettings.companyName || 'ELARA SILVER', 14, 25);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(invoiceSettings.tagline || 'Fine 925 Sterling Silver Jewellery', 14, 31);
    
    let subline = invoiceSettings.websiteUrl ? `${invoiceSettings.websiteUrl}` : '';
    if (invoiceSettings.showGstin && invoiceSettings.gstin) {
      subline += ` | GSTIN: ${invoiceSettings.gstin}`;
    }
    if (invoiceSettings.showPan && invoiceSettings.pan) {
      subline += ` | PAN: ${invoiceSettings.pan}`;
    }
    if (subline) doc.text(subline, 14, 36);

    // Invoice Meta Right-aligned
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(...darkGray);
    doc.text('TAX INVOICE', 196, 25, { align: 'right' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Invoice No: ${invoice.id}`, 196, 32, { align: 'right' });
    doc.text(`Date: ${invoice.date}`, 196, 37, { align: 'right' });
    doc.text(`Order Ref: ${invoice.orderId}`, 196, 42, { align: 'right' });

    // Divider
    doc.setDrawColor(230, 230, 230);
    doc.line(14, 47, 196, 47);

    // Billed To Info
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...tealColor);
    doc.text('BILLED TO:', 14, 55);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...darkGray);
    doc.text(invoice.customer || 'Valued Customer', 14, 61);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    if (invoice.phone) doc.text(`Phone: ${invoice.phone}`, 14, 67);
    if (invoice.email) doc.text(`Email: ${invoice.email}`, 14, 72);
    if (invoice.address) {
      const splitAddress = doc.splitTextToSize(`Address: ${invoice.address}`, 100);
      doc.text(splitAddress, 14, 77);
    }

    // Payment Info
    const statusY = 55;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...tealColor);
    doc.text('PAYMENT DETAILS:', 196, statusY, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Method: ${invoice.rawOrder?.paymentMethod?.toUpperCase() || 'ONLINE'}`, 196, statusY + 6, { align: 'right' });
    if (invoiceSettings.showStatusBadge) {
      doc.text(`Status: ${invoice.status}`, 196, statusY + 11, { align: 'right' });
    }

    // Items Table
    const currSym = invoiceSettings.currencySymbol || 'INR';
    const tableItems = (invoice.items && invoice.items.length > 0)
      ? invoice.items.map((item: any, idx: number) => [
          idx + 1,
          item.name + (item.size ? ` (Size: ${item.size})` : ''),
          `${currSym} ${item.price?.toLocaleString('en-IN')}`,
          item.quantity || 1,
          `${currSym} ${(item.price * (item.quantity || 1)).toLocaleString('en-IN')}`
        ])
      : [[1, `Jewellery Items (${invoice.orderId})`, invoice.amount, 1, invoice.amount]];

    autoTable(doc, {
      startY: 92,
      head: [['#', 'Item Description', 'Unit Price', 'Qty', 'Total Amount']],
      body: tableItems,
      headStyles: {
        fillColor: tealColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [60, 60, 60],
      },
      alternateRowStyles: {
        fillColor: [248, 250, 250],
      },
      columnStyles: {
        0: { cellWidth: 12, halign: 'center' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 35, halign: 'right' },
        3: { cellWidth: 18, halign: 'center' },
        4: { cellWidth: 40, halign: 'right' },
      },
    });

    const finalY = (doc as any).lastAutoTable.finalY || 140;

    // Totals Section
    const subtotal = invoice.amount;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Subtotal:', 140, finalY + 12);
    doc.text(subtotal, 196, finalY + 12, { align: 'right' });

    doc.text('Tax (GST 3%):', 140, finalY + 18);
    doc.text('Included', 196, finalY + 18, { align: 'right' });

    doc.setDrawColor(200, 200, 200);
    doc.line(135, finalY + 22, 196, finalY + 22);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...tealColor);
    doc.text('Grand Total:', 140, finalY + 29);
    doc.text(subtotal, 196, finalY + 29, { align: 'right' });

    // Footer & Signatory
    const footerY = finalY + 50;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...tealColor);
    doc.text(invoiceSettings.signatoryText || 'ELARA SILVER AUTHORIZED SIGNATORY', 196, footerY, { align: 'right' });
    if (invoiceSettings.signatorySubtext) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(invoiceSettings.signatorySubtext, 196, footerY + 5, { align: 'right' });
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Thank you for shopping with ${invoiceSettings.companyName || 'Elara Silver'} | ${invoiceSettings.websiteUrl || 'www.elarasilver.com'}`, 105, footerY + 18, { align: 'center' });

    doc.save(`${invoice.id}_ElaraSilver.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredInvoices = invoices.filter(inv => 
    inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-sm text-gray-500 mt-1">View, print, customize & download luxury tax invoices.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-xs"
          >
            <svg className="w-4 h-4 text-[#0B5E64]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Invoice Settings
          </button>
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Invoice or Customer..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0B5E64] focus:outline-none bg-white shadow-xs"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500 animate-pulse">Loading invoices...</div>
          ) : filteredInvoices.length === 0 ? (
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
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-gray-50 last:border-0 hover:bg-teal-50/20 transition-colors">
                    <td className="px-6 py-4 font-semibold text-[#0B5E64]">{invoice.id}</td>
                    <td className="px-6 py-4 text-gray-700 font-medium">{invoice.orderId}</td>
                    <td className="px-6 py-4 text-gray-600">{invoice.customer}</td>
                    <td className="px-6 py-4 text-gray-500">{invoice.date}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{invoice.amount}</td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-3">
                      <button 
                        onClick={() => setSelectedInvoice(invoice)} 
                        className="px-3 py-1.5 bg-gray-100 hover:bg-[#0B5E64] hover:text-white text-gray-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Preview
                      </button>
                      <button 
                        onClick={() => handleDownloadPdf(invoice)} 
                        className="px-3 py-1.5 bg-[#0B5E64] hover:bg-[#084A4F] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

      {/* Invoice Customization Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-gray-100 my-8">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0B5E64]" />
                Invoice Layout & Brand Settings
              </h3>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-200"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-4 text-sm max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Company Name</label>
                  <input 
                    type="text" 
                    value={invoiceSettings.companyName}
                    onChange={(e) => setInvoiceSettings({ ...invoiceSettings, companyName: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0B5E64] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Tagline</label>
                  <input 
                    type="text" 
                    value={invoiceSettings.tagline}
                    onChange={(e) => setInvoiceSettings({ ...invoiceSettings, tagline: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0B5E64] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Logo Image URL</label>
                  <input 
                    type="text" 
                    value={invoiceSettings.logoUrl}
                    onChange={(e) => setInvoiceSettings({ ...invoiceSettings, logoUrl: e.target.value })}
                    placeholder="/images/footerlogo.PNG"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0B5E64] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Currency Format / Symbol</label>
                  <select 
                    value={invoiceSettings.currencySymbol}
                    onChange={(e) => setInvoiceSettings({ ...invoiceSettings, currencySymbol: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0B5E64] focus:outline-none bg-white"
                  >
                    <option value="INR">INR (INR 2,499)</option>
                    <option value="₹">Rupee (₹ 2,499)</option>
                    <option value="USD">USD ($ 2,499)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Website URL</label>
                  <input 
                    type="text" 
                    value={invoiceSettings.websiteUrl}
                    onChange={(e) => setInvoiceSettings({ ...invoiceSettings, websiteUrl: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0B5E64] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Support Email</label>
                  <input 
                    type="text" 
                    value={invoiceSettings.supportEmail}
                    onChange={(e) => setInvoiceSettings({ ...invoiceSettings, supportEmail: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0B5E64] focus:outline-none"
                  />
                </div>
              </div>

              {/* Checkbox Toggles */}
              <div className="bg-gray-50 p-4 rounded-xl space-y-2 border border-gray-200">
                <span className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">Display Options</span>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700 font-medium">
                  <input 
                    type="checkbox"
                    checked={invoiceSettings.showStatusBadge}
                    onChange={(e) => setInvoiceSettings({ ...invoiceSettings, showStatusBadge: e.target.checked })}
                    className="w-4 h-4 text-[#0B5E64] rounded border-gray-300 focus:ring-[#0B5E64]"
                  />
                  Show Payment Status Badge (Paid / Pending)
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700 font-medium">
                  <input 
                    type="checkbox"
                    checked={invoiceSettings.showGstin}
                    onChange={(e) => setInvoiceSettings({ ...invoiceSettings, showGstin: e.target.checked })}
                    className="w-4 h-4 text-[#0B5E64] rounded border-gray-300 focus:ring-[#0B5E64]"
                  />
                  Show GSTIN Number on Header
                </label>
                {invoiceSettings.showGstin && (
                  <input 
                    type="text" 
                    value={invoiceSettings.gstin}
                    onChange={(e) => setInvoiceSettings({ ...invoiceSettings, gstin: e.target.value })}
                    placeholder="Enter GSTIN (e.g. 33AAAAA0000A1Z5)"
                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-[#0B5E64] focus:outline-none bg-white mt-1"
                  />
                )}
                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700 font-medium">
                  <input 
                    type="checkbox"
                    checked={invoiceSettings.showPan}
                    onChange={(e) => setInvoiceSettings({ ...invoiceSettings, showPan: e.target.checked })}
                    className="w-4 h-4 text-[#0B5E64] rounded border-gray-300 focus:ring-[#0B5E64]"
                  />
                  Show PAN Number on Header
                </label>
                {invoiceSettings.showPan && (
                  <input 
                    type="text" 
                    value={invoiceSettings.pan}
                    onChange={(e) => setInvoiceSettings({ ...invoiceSettings, pan: e.target.value })}
                    placeholder="Enter PAN Number"
                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-[#0B5E64] focus:outline-none bg-white mt-1"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Signatory Footer Text</label>
                <input 
                  type="text" 
                  value={invoiceSettings.signatoryText}
                  onChange={(e) => setInvoiceSettings({ ...invoiceSettings, signatoryText: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0B5E64] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Terms & Conditions Text</label>
                <textarea 
                  rows={3}
                  value={invoiceSettings.termsText}
                  onChange={(e) => setInvoiceSettings({ ...invoiceSettings, termsText: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 text-xs focus:ring-2 focus:ring-[#0B5E64] focus:outline-none"
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveSettings}
                disabled={isSavingSettings}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#0B5E64] rounded-lg hover:bg-[#084A4F] transition-colors disabled:opacity-50"
              >
                {isSavingSettings ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Luxury Invoice Preview Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden my-8 border border-gray-100">
            {/* Modal Control Bar */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0B5E64]" />
                Tax Invoice Preview ({selectedInvoice.id})
              </h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handlePrint}
                  className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print
                </button>
                <button 
                  onClick={() => handleDownloadPdf(selectedInvoice)}
                  className="px-3 py-1.5 bg-[#0B5E64] text-white text-xs font-semibold rounded-lg hover:bg-[#084A4F] transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download PDF
                </button>
                <button 
                  onClick={() => setSelectedInvoice(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-200"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Printable Invoice Container */}
            <div className="p-8 text-sm bg-white" id="invoice-printable-area">
              {/* Brand Top Banner */}
              <div className="flex justify-between items-start border-b border-gray-200 pb-6 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <img 
                      src={invoiceSettings.logoUrl || '/images/footerlogo.PNG'} 
                      alt={invoiceSettings.companyName} 
                      className="h-12 object-contain" 
                    />
                  </div>
                  <p className="text-gray-500 text-xs font-medium">{invoiceSettings.tagline}</p>
                  <p className="text-gray-400 text-[11px] mt-0.5">
                    {invoiceSettings.websiteUrl}
                    {invoiceSettings.showGstin && invoiceSettings.gstin ? ` | GSTIN: ${invoiceSettings.gstin}` : ''}
                    {invoiceSettings.showPan && invoiceSettings.pan ? ` | PAN: ${invoiceSettings.pan}` : ''}
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-[#0B5E64]/10 text-[#0B5E64] font-extrabold text-xs tracking-widest uppercase rounded-md inline-block mb-2">
                    TAX INVOICE
                  </span>
                  <p className="font-bold text-gray-900 text-base">{selectedInvoice.id}</p>
                  <p className="text-gray-500 text-xs mt-0.5">Date: {selectedInvoice.date}</p>
                  <p className="text-gray-500 text-xs">Order Ref: <span className="font-semibold text-gray-800">{selectedInvoice.orderId}</span></p>
                </div>
              </div>
              
              {/* Billing & Payment Details Grid */}
              <div className="grid grid-cols-2 gap-6 p-4 rounded-xl bg-gray-50/70 border border-gray-100 mb-6">
                <div>
                  <p className="text-[10px] text-[#0B5E64] font-extrabold uppercase tracking-wider mb-1.5">BILLED TO</p>
                  <p className="font-bold text-gray-900 text-sm">{selectedInvoice.customer || 'Valued Customer'}</p>
                  {selectedInvoice.phone && <p className="text-gray-600 text-xs mt-0.5">📱 {selectedInvoice.phone}</p>}
                  {selectedInvoice.email && <p className="text-gray-600 text-xs">✉️ {selectedInvoice.email}</p>}
                  {selectedInvoice.address && <p className="text-gray-500 text-xs mt-1 leading-relaxed">{selectedInvoice.address}</p>}
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-[#0B5E64] font-extrabold uppercase tracking-wider mb-1.5">PAYMENT DETAILS</p>
                  <p className="text-xs text-gray-700 font-medium">
                    Payment Method: <span className="font-bold text-gray-900">{selectedInvoice.rawOrder?.paymentMethod?.toUpperCase() || 'ONLINE'}</span>
                  </p>
                  {invoiceSettings.showStatusBadge && (
                    <p className="text-xs text-gray-700 font-medium mt-1">
                      Status: <span className={`font-bold ${selectedInvoice.status === 'Paid' ? 'text-emerald-700' : 'text-amber-700'}`}>{selectedInvoice.status}</span>
                    </p>
                  )}
                </div>
              </div>
              
              {/* Product Items Table */}
              <table className="w-full text-left mb-6 border-collapse">
                <thead>
                  <tr className="bg-[#0B5E64] text-white text-xs uppercase font-bold">
                    <th className="py-2.5 px-3 rounded-l-lg">Item Description</th>
                    <th className="py-2.5 px-3 text-center">Unit Price</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right rounded-r-lg">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {selectedInvoice.items && selectedInvoice.items.length > 0 ? (
                    selectedInvoice.items.map((item: any, idx: number) => (
                      <tr key={idx} className="hover:bg-gray-50/50">
                        <td className="py-3 px-3 font-semibold text-gray-800">
                          {item.name} {item.size && <span className="text-gray-500 font-normal">({item.size})</span>}
                        </td>
                        <td className="py-3 px-3 text-center text-gray-600">{invoiceSettings.currencySymbol} {item.price?.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-3 text-center font-medium text-gray-900">{item.quantity || 1}</td>
                        <td className="py-3 px-3 text-right font-bold text-gray-900">{invoiceSettings.currencySymbol} {(item.price * (item.quantity || 1)).toLocaleString('en-IN')}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="py-4 px-3 font-semibold text-gray-800">Jewellery Items (Order {selectedInvoice.orderId})</td>
                      <td className="py-4 px-3 text-center text-gray-600">{selectedInvoice.amount}</td>
                      <td className="py-4 px-3 text-center font-medium text-gray-900">1</td>
                      <td className="py-4 px-3 text-right font-bold text-gray-900">{selectedInvoice.amount}</td>
                    </tr>
                  )}
                </tbody>
              </table>
              
              {/* Summary Calculations */}
              <div className="flex justify-end mb-8">
                <div className="w-64 space-y-2 bg-teal-50/30 p-4 rounded-xl border border-teal-100/60 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-800">{selectedInvoice.amount}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (GST 3%)</span>
                    <span className="text-emerald-700 font-medium">Included</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-[#0B5E64] pt-2 border-t border-teal-200">
                    <span>Total Amount</span>
                    <span>{selectedInvoice.amount}</span>
                  </div>
                </div>
              </div>
              
              {/* Footer Terms & Signatory */}
              <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-end gap-4 text-xs">
                <div className="text-gray-400 text-[11px] max-w-xs space-y-0.5">
                  <p className="font-semibold text-gray-600">Terms & Conditions:</p>
                  <p className="whitespace-pre-line">{invoiceSettings.termsText}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-[#0B5E64] uppercase tracking-wider">{invoiceSettings.signatoryText}</p>
                  {invoiceSettings.signatorySubtext && (
                    <p className="text-gray-400 text-[10px] mt-0.5">{invoiceSettings.signatorySubtext}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
