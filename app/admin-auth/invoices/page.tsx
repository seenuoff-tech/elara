'use client';

import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  // Invoice Company & Layout Settings
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [invoiceSettings, setInvoiceSettings] = useState({
    companyName: 'ELARA SILVER',
    branchName: 'ELARA SILVER',
    gstin: '33HTQPS8640C1ZB',
    address: '130/134 A North Car Street, Srivilliputtur - 626125',
    state: 'Tamil Nadu',
    stateCode: '33',
    country: 'India',
    pinCode: '626125',
    phone: '6369825925',
    logoUrl: '/images/footerlogo.PNG',
    terms: [
      "1. The charges to make receive payment specified in here includes tax, hallmark, Procurement, Wastage, Making Charges, Imitation Stones, Precious Stones, Artisan Work, Logistics and other inclusive.",
      "2. Silver, wastage and making charges are calculated on gross weight only.",
      "3. The Net Weight is only indicative and the actual may vary. However, in all cases, the Net Weight shown in the invoice will be considered.",
      "4. If any defect is found in the jewel/material/design, the customer shall report the same to the Branch Manager immediately within three days, from the date of purchase. The company shall rectify the same, at its own cost.",
      "5. All disputed are subject to the jurisdiction of the courts in srivilliputtur."
    ],
    declarationText: "I have read, understood, and accept the terms and conditions mentioned above, the guidelines regarding quality specified at the backside of this invoice, were explained to me in Tamil.\nThe above jewels mentioned in the invoice are according to my specification and I purchased / sold the jewels at my own wish/need, after due verification.\nHereby, indicating the acceptance for above terms & conditions, received the product in good condition, and, doing the payment. I further acknowledge the amount stated is correct and accurate.",
    consentText: "I hereby consent to receive messages via WhatsApp, SMS or other social media platforms and also receive calls in my mobile number provided in this invoice."
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
          const formattedInvoices = ordersData.orders.map((order: any) => {
            const rawAmount = order.totalAmount || 0;
            return {
              id: order.orderNumber ? `${order.orderNumber.split('-')[1] || order.id.toString().substring(0, 6)}/26-27` : `435/26-27`,
              orderId: order.orderNumber,
              customer: order.customerName,
              email: order.email || '',
              phone: order.phone || '6369825925',
              address: `${order.address || ''}, ${order.city || ''}, ${order.state || ''} ${order.pincode || ''}`.trim().replace(/^,|,$/g, ''),
              date: new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }),
              time: new Date(order.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
              rawAmount: rawAmount,
              amount: rawAmount,
              items: order.items || [],
              rawOrder: order
            };
          });
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
        setIsSettingsOpen(false);
        alert('Invoice template settings saved successfully!');
      } else {
        alert('Failed to save invoice settings.');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving settings.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const numberToWords = (num: number) => {
    const a = ['', 'ONE ', 'TWO ', 'THREE ', 'FOUR ', 'FIVE ', 'SIX ', 'SEVEN ', 'EIGHT ', 'NINE ', 'TEN ', 'ELEVEN ', 'TWELVE ', 'THIRTEEN ', 'FOURTEEN ', 'FIFTEEN ', 'SIXTEEN ', 'SEVENTEEN ', 'EIGHTEEN ', 'NINETEEN '];
    const b = ['', '', 'TWENTY ', 'THIRTY ', 'FORTY ', 'FIFTY ', 'SIXTY ', 'SEVENTY ', 'EIGHTY ', 'NINETY '];
    
    if ((num = num.toString() as any).length > 9) return 'OVERFLOW';
    const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return ''; 
    let str = '';
    str += (n[1] != '00') ? (a[Number(n[1])] || b[n[1][0]] + a[n[1][1]]) + 'CRORE ' : '';
    str += (n[2] != '00') ? (a[Number(n[2])] || b[n[2][0]] + a[n[2][1]]) + 'LAKH ' : '';
    str += (n[3] != '00') ? (a[Number(n[3])] || b[n[3][0]] + a[n[3][1]]) + 'THOUSAND ' : '';
    str += (n[4] != '0') ? (a[Number(n[4])] || b[n[4][0]] + a[n[4][1]]) + 'HUNDRED ' : '';
    str += (n[5] != '00') ? ((str != '') ? 'AND ' : '') + (a[Number(n[5])] || b[n[5][0]] + a[n[5][1]]) : '';
    return str.trim() ? `${str.trim()} RUPEES ONLY` : 'ZERO RUPEES ONLY';
  };

  const handleDownloadPdf = (invoice: any) => {
    const doc = new jsPDF();

    // Top Header - Logo
    const logoImg = new Image();
    logoImg.src = invoiceSettings.logoUrl || '/images/footerlogo.PNG';
    try {
      doc.addImage(logoImg, 'PNG', 85, 10, 40, 15);
    } catch (e) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(11, 94, 100);
      doc.text('ELARA SILVER', 105, 20, { align: 'center' });
    }

    // Document Title
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('TAX INVOICE (Sales)', 14, 34);

    // Branch & Customer Info Columns
    doc.setFontSize(9);
    doc.text('Branch', 14, 42);
    doc.text('Customer :', 110, 42);

    doc.setFont('helvetica', 'bold');
    doc.text(invoiceSettings.branchName || 'ELARA SILVER', 14, 48);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);

    // Left Column (Branch Info)
    let curY = 53;
    doc.text('GSTIN', 14, curY); doc.text(`: ${invoiceSettings.gstin}`, 40, curY); curY += 4;
    doc.text('Address', 14, curY); doc.text(`: ${invoiceSettings.address}`, 40, curY); curY += 4;
    doc.text('State', 14, curY); doc.text(`: ${invoiceSettings.state}`, 40, curY); curY += 4;
    doc.text('State Code', 14, curY); doc.text(`: ${invoiceSettings.stateCode}`, 40, curY); curY += 4;
    doc.text('Country', 14, curY); doc.text(`: ${invoiceSettings.country}`, 40, curY); curY += 4;
    doc.text('Pin Code', 14, curY); doc.text(`: ${invoiceSettings.pinCode}`, 40, curY); curY += 4;
    doc.text('Phone', 14, curY); doc.text(`: ${invoiceSettings.phone}`, 40, curY);

    // Right Column (Customer Info)
    curY = 48;
    doc.setFont('helvetica', 'bold');
    doc.text('Billed To', 110, curY); curY += 5;
    doc.setFont('helvetica', 'normal');
    doc.text('GSTIN', 110, curY); doc.text(':', 138, curY); curY += 4;
    doc.text('Name', 110, curY); doc.text(`: ${invoice.customer || ''}`, 138, curY); curY += 4;
    doc.text('State', 110, curY); doc.text(`: ${invoiceSettings.state}`, 138, curY); curY += 4;
    doc.text('State Code', 110, curY); doc.text(`: ${invoiceSettings.stateCode}`, 138, curY); curY += 4;
    doc.text('Country', 110, curY); doc.text(`: ${invoiceSettings.country}`, 138, curY); curY += 4;
    doc.text('Pin Code', 110, curY); doc.text(`: ${invoice.rawOrder?.pincode || invoiceSettings.pinCode}`, 138, curY); curY += 4;
    doc.text('Phone', 110, curY); doc.text(`: ${invoice.phone}`, 138, curY); curY += 4;
    doc.text('Invoice Number', 110, curY); doc.text(`: ${invoice.id}`, 138, curY);

    // Date Line
    doc.setFontSize(8.5);
    doc.text(`Date : ${invoice.date} Time : ${invoice.time}`, 14, 88);

    // Simplified Clean Table Structure
    const tableItems = (invoice.items && invoice.items.length > 0)
      ? invoice.items.map((item: any, idx: number) => {
          const itemTotal = item.price * (item.quantity || 1);
          const cgstVal = (itemTotal * 0.015).toFixed(2);
          const sgstVal = (itemTotal * 0.015).toFixed(2);
          return [
            idx + 1,
            item.name + (item.size ? ` (${item.size})` : ''),
            `₹${cgstVal} (1.5%)`,
            `₹${sgstVal} (1.5%)`,
            `₹${itemTotal.toLocaleString('en-IN')}.00`
          ];
        })
      : [
          [1, 'Jewellery Item', '₹0.00 (1.5%)', '₹0.00 (1.5%)', `₹${invoice.rawAmount.toLocaleString('en-IN')}.00`]
        ];

    autoTable(doc, {
      startY: 92,
      head: [['S.NO', 'Item Name', 'CGST (1.5%)', 'SGST (1.5%)', 'Amount']],
      body: tableItems,
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        fontSize: 8,
        lineColor: [200, 200, 200],
        lineWidth: 0.1
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [0, 0, 0],
      },
      styles: {
        cellPadding: 2,
        valign: 'middle'
      },
      columnStyles: {
        0: { cellWidth: 15, halign: 'center' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 35, halign: 'center' },
        3: { cellWidth: 35, halign: 'center' },
        4: { cellWidth: 40, halign: 'right' }
      }
    });

    const finalY = (doc as any).lastAutoTable.finalY || 140;

    // Payable Amount Section (No Round Off line)
    doc.line(14, finalY + 4, 196, finalY + 4);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('PAYABLE NET AMOUNT :', 140, finalY + 11, { align: 'right' });
    doc.text(`₹${invoice.rawAmount.toLocaleString('en-IN')}.00`, 196, finalY + 11, { align: 'right' });
    doc.line(14, finalY + 14, 196, finalY + 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`RUPEES : ${numberToWords(invoice.rawAmount)}`, 14, finalY + 20);

    // Disclaimer
    doc.setFontSize(7);
    doc.text('(Price includes GST 3%, hallmarking charges, consumable and packing material)', 105, finalY + 28, { align: 'center' });
    doc.text('E. & O. E.', 196, finalY + 28, { align: 'right' });

    // Terms & Conditions Block
    let termY = finalY + 34;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('Terms & Conditions', 14, termY); termY += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    invoiceSettings.terms.forEach((t: string) => {
      const splitT = doc.splitTextToSize(t, 182);
      doc.text(splitT, 14, termY);
      termY += (splitT.length * 3.2);
    });

    // Declaration Block
    termY += 1;
    doc.setFont('helvetica', 'bold');
    doc.text('Declaration', 14, termY); termY += 3.5;
    doc.setFont('helvetica', 'normal');
    const splitDec = doc.splitTextToSize(invoiceSettings.declarationText, 182);
    doc.text(splitDec, 14, termY);
    termY += (splitDec.length * 3.2);

    // Signatures
    termY += 6;
    doc.setFontSize(7);
    doc.text('Customer Signature', 14, termY);
    doc.text(`for ${invoiceSettings.companyName || 'ELARA SILVER'}`, 196, termY, { align: 'right' });
    doc.text('Authorised Signatory', 196, termY + 4, { align: 'right' });

    // Footer Consent
    doc.setFillColor(180, 225, 220);
    doc.rect(0, 285, 210, 12, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(6.5);
    doc.text(invoiceSettings.consentText, 14, 290);
    doc.text('Thanks for preferring to shop at Elara Silver', 196, 290, { align: 'right' });

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
          <p className="text-sm text-gray-500 mt-1">Generate official Tax Invoice (Sales) physical receipt.</p>
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
            Invoice Template Settings
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
                  <th className="px-6 py-4">Invoice Number</th>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Total Amount</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-gray-50 last:border-0 hover:bg-teal-50/20 transition-colors">
                    <td className="px-6 py-4 font-semibold text-[#0B5E64]">{invoice.id}</td>
                    <td className="px-6 py-4 text-gray-700 font-medium">{invoice.orderId}</td>
                    <td className="px-6 py-4 text-gray-600">{invoice.customer}</td>
                    <td className="px-6 py-4 text-gray-500">{invoice.date} {invoice.time}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">₹{invoice.amount?.toLocaleString('en-IN')}</td>
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
                Tax Invoice Branch & Terms Settings
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
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Phone</label>
                  <input 
                    type="text" 
                    value={invoiceSettings.phone}
                    onChange={(e) => setInvoiceSettings({ ...invoiceSettings, phone: e.target.value })}
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
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Logo URL</label>
                  <input 
                    type="text" 
                    value={invoiceSettings.logoUrl}
                    onChange={(e) => setInvoiceSettings({ ...invoiceSettings, logoUrl: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0B5E64] focus:outline-none"
                  />
                </div>
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

      {/* Exact Physical Receipt Preview Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden my-6 border border-gray-200 text-black font-sans text-xs">
            
            {/* Control Bar */}
            <div className="px-6 py-3 border-b border-gray-200 flex justify-between items-center bg-gray-100 print:hidden">
              <span className="font-bold text-gray-800">TAX INVOICE (Sales) - Preview</span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handlePrint}
                  className="px-3 py-1.5 bg-[#0B5E64] text-white text-xs font-semibold rounded hover:bg-[#084A4F] transition-colors flex items-center gap-1"
                >
                  Print Invoice
                </button>
                <button 
                  onClick={() => handleDownloadPdf(selectedInvoice)}
                  className="px-3 py-1.5 bg-gray-800 text-white text-xs font-semibold rounded hover:bg-black transition-colors"
                >
                  Download PDF
                </button>
                <button 
                  onClick={() => setSelectedInvoice(null)}
                  className="p-1 text-gray-500 hover:text-black"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Exact Paper Document Printable Area */}
            <div className="p-8 bg-white" id="invoice-printable-area">
              
              {/* Header Logo */}
              <div className="flex flex-col items-center justify-center mb-4">
                <img 
                  src={invoiceSettings.logoUrl || "/images/footerlogo.PNG"} 
                  alt="Elara Silver Logo" 
                  className="h-14 object-contain mb-1" 
                />
              </div>

              {/* Title */}
              <h2 className="font-bold text-sm text-black mb-3 uppercase">TAX INVOICE (Sales)</h2>

              {/* Branch vs Customer Details Table */}
              <div className="grid grid-cols-2 gap-4 text-[11px] mb-4">
                <div>
                  <p className="font-bold text-black mb-1">Branch</p>
                  <p className="font-bold text-black">{invoiceSettings.branchName || 'ELARA SILVER'}</p>
                  <div className="grid grid-cols-[80px_1fr] gap-x-1 mt-1 text-gray-700">
                    <span>GSTIN</span><span>: {invoiceSettings.gstin}</span>
                    <span>Address</span><span>: {invoiceSettings.address}</span>
                    <span>State</span><span>: {invoiceSettings.state}</span>
                    <span>State Code</span><span>: {invoiceSettings.stateCode}</span>
                    <span>Country</span><span>: {invoiceSettings.country}</span>
                    <span>Pin Code</span><span>: {invoiceSettings.pinCode}</span>
                    <span>Phone</span><span>: {invoiceSettings.phone}</span>
                  </div>
                </div>

                <div>
                  <p className="font-bold text-black mb-1">Customer :</p>
                  <p className="font-bold text-black">Billed To</p>
                  <div className="grid grid-cols-[80px_1fr] gap-x-1 mt-1 text-gray-700">
                    <span>GSTIN</span><span>:</span>
                    <span>Name</span><span>: {selectedInvoice.customer}</span>
                    <span>State</span><span>: {invoiceSettings.state}</span>
                    <span>State Code</span><span>: {invoiceSettings.stateCode}</span>
                    <span>Country</span><span>: {invoiceSettings.country}</span>
                    <span>Pin Code</span><span>: {selectedInvoice.rawOrder?.pincode || invoiceSettings.pinCode}</span>
                    <span>Phone</span><span>: {selectedInvoice.phone}</span>
                    <span>Invoice Number</span><span>: {selectedInvoice.id}</span>
                  </div>
                </div>
              </div>

              {/* Date Line */}
              <div className="text-[11px] font-semibold mb-2">
                Date : {selectedInvoice.date} Time : {selectedInvoice.time}
              </div>

              {/* Clean Streamlined Line Items Table */}
              <table className="w-full border-collapse text-[11px] mb-3 border border-gray-300">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300 text-left font-bold">
                    <th className="p-2 border-r border-gray-300 text-center w-12">S.NO</th>
                    <th className="p-2 border-r border-gray-300">Item Name</th>
                    <th className="p-2 border-r border-gray-300 text-center w-28">CGST (1.5%)</th>
                    <th className="p-2 border-r border-gray-300 text-center w-28">SGST (1.5%)</th>
                    <th className="p-2 text-right w-36">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {selectedInvoice.items && selectedInvoice.items.length > 0 ? (
                    selectedInvoice.items.map((item: any, idx: number) => {
                      const itemTotal = item.price * (item.quantity || 1);
                      const cgstVal = (itemTotal * 0.015).toFixed(2);
                      const sgstVal = (itemTotal * 0.015).toFixed(2);
                      return (
                        <tr key={idx}>
                          <td className="p-2 border-r border-gray-200 text-center">{idx + 1}</td>
                          <td className="p-2 border-r border-gray-200 font-semibold">{item.name} {item.size ? `(${item.size})` : ''}</td>
                          <td className="p-2 border-r border-gray-200 text-center text-gray-600">₹{cgstVal} <span className="text-[9px] text-gray-400">(1.5%)</span></td>
                          <td className="p-2 border-r border-gray-200 text-center text-gray-600">₹{sgstVal} <span className="text-[9px] text-gray-400">(1.5%)</span></td>
                          <td className="p-2 text-right font-bold">₹{itemTotal.toLocaleString('en-IN')}.00</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td className="p-2 border-r border-gray-200 text-center">1</td>
                      <td className="p-2 border-r border-gray-200 font-semibold">Jewellery Item</td>
                      <td className="p-2 border-r border-gray-200 text-center text-gray-600">₹0.00</td>
                      <td className="p-2 border-r border-gray-200 text-center text-gray-600">₹0.00</td>
                      <td className="p-2 text-right font-bold">₹{selectedInvoice.rawAmount.toLocaleString('en-IN')}.00</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Total Calculation Row (Round Off Removed) */}
              <div className="border-t-2 border-b-2 border-gray-600 py-2 flex justify-between font-bold text-xs mb-2">
                <span>RUPEES : {numberToWords(selectedInvoice.rawAmount)}</span>
                <div className="flex gap-4">
                  <span>PAYABLE NET AMOUNT :</span>
                  <span>₹{selectedInvoice.rawAmount.toLocaleString('en-IN')}.00</span>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="flex justify-between text-[9px] text-gray-600 my-2">
                <span>(Price includes GST 3%, hallmarking charges, consumable and packing material)</span>
                <span className="font-bold">E. & O. E.</span>
              </div>

              {/* Exact Terms & Conditions Section */}
              <div className="mt-4 pt-2 border-t border-gray-300 text-[9px] leading-tight space-y-1 text-gray-800">
                <p className="font-bold text-[10px]">Terms & Conditions</p>
                {invoiceSettings.terms.map((term: string, idx: number) => (
                  <p key={idx}>{term}</p>
                ))}
                
                <p className="font-bold text-[10px] pt-1">Declaration</p>
                <p className="whitespace-pre-line">{invoiceSettings.declarationText}</p>
              </div>

              {/* Signatures */}
              <div className="flex justify-between items-end mt-8 text-[10px] font-bold">
                <div>Customer Signature</div>
                <div className="text-right">
                  <p>for {invoiceSettings.companyName || 'ELARA SILVER'}</p>
                  <p className="mt-6 text-gray-600 font-normal text-[9px]">Authorised Signatory</p>
                </div>
              </div>

              {/* Bottom Consent Bar */}
              <div className="mt-6 p-2 bg-[#b4e1dc] text-[#054347] flex justify-between items-center text-[9px] font-medium rounded-sm">
                <span>{invoiceSettings.consentText}</span>
                <span className="font-bold">Thanks for preferring to shop at Elara Silver.</span>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
