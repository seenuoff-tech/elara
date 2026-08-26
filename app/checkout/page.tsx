'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import LuxuryButton from '../../components/luxury/LuxuryButton';
import Image from 'next/image';
import Script from 'next/script';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, clearCart, isGiftWrap } = useCart();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'razorpay'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [orderedItems, setOrderedItems] = useState<any[]>([]);

  // Form states
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Tamil Nadu',
    pincode: '',
    gstNumber: '',
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  // Calculate Totals
  const subtotal = cartItems.reduce((acc, item) => {
    const numericPrice = parseFloat(String(item.price).replace(/[^\d]/g, ''));
    return acc + numericPrice * item.quantity;
  }, 0);
  
  // Shipping calculation: Free within Tamil Nadu, ₹150 for other states
  const isOutsideTN = formData.state !== 'Tamil Nadu';
  const shippingFee = (subtotal > 0 && isOutsideTN) ? 150 : 0;
  const giftWrapFee = isGiftWrap ? 50 : 0;
  
  const grandTotal = subtotal > 0 ? (subtotal + shippingFee + giftWrapFee) : 0;
  const formattedGrandTotal = `₹${grandTotal.toLocaleString('en-IN')}`;

  useEffect(() => {
    // If cart is empty and not on success step, redirect home
    if (cartItems.length === 0 && step !== 3) {
      router.push('/');
    }
  }, [cartItems.length, router, step]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    if (paymentMethod === 'cod') {
      setTimeout(async () => {
        const generatedOrderId = `ELARA-${Math.floor(Math.random() * 900000) + 100000}`;
        setOrderId(generatedOrderId);

        try {
          await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: generatedOrderId,
              customerData: formData,
              items: cartItems.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
              })),
              total: formattedGrandTotal,
              date: new Date().toLocaleDateString()
            })
          });
        } catch (err) {
          console.error("Failed to trigger emails", err);
        }

        setIsProcessing(false);
        setOrderedItems([...cartItems]);
        clearCart();
        setStep(3);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 800);
    } else {
      try {
        const res = await fetch('/api/razorpay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: grandTotal })
        });
        const data = await res.json();
        
        if (!data.success) throw new Error(data.error);

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_s4Mh9Z2A7fDbz6",
          amount: data.order.amount,
          currency: "INR",
          name: "Elara Silver",
          description: "Purchase from Elara Silver",
          image: "/images/org.png",
          order_id: data.order.id,
          handler: async (response: any) => {
            const generatedOrderId = `ELARA-${Math.floor(Math.random() * 900000) + 100000}`;
            setOrderId(generatedOrderId);
            
            // Trigger Email API here too
            try {
              await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  orderId: generatedOrderId,
                  customerData: formData,
                  items: cartItems.map(item => ({ id: item.id, name: item.name, quantity: item.quantity, price: item.price })),
                  total: formattedGrandTotal,
                  date: new Date().toLocaleDateString()
                })
              });
            } catch (err) {}

            setIsProcessing(false);
            setOrderedItems([...cartItems]);
            clearCart();
            setStep(3);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          },
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.phone
          },
          theme: { color: "#0B5E64" }
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.on('payment.failed', (response: any) => {
          alert("Payment failed: " + response.error.description);
          setIsProcessing(false);
        });
        paymentObject.open();
      } catch (err: any) {
        alert("Failed to initialize payment: " + err.message);
        setIsProcessing(false);
      }
    }
  };

    const downloadInvoice = async () => {
    const { jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");
    const doc = new jsPDF();
    
    // Header text on top left
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("TAX INVOICE (Sales)", 14, 20);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Branch", 14, 30);
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("ELARA SILVER", 14, 40);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    const startX = 14;
    const colonX = 45;
    let currY = 48;
    
    doc.text("GSTIN", startX, currY);
    doc.text(`: 33HTQPS8640C1Z8`, colonX, currY);
    
    currY += 5;
    doc.text("Address", startX, currY);
    doc.text(`: 130/134 A North Car Street,`, colonX, currY);
    currY += 5;
    doc.text(`  Srivilliputtur - 626125`, colonX, currY);
    
    currY += 5;
    doc.text("State", startX, currY);
    doc.text(`: Tamil Nadu`, colonX, currY);
    
    currY += 5;
    doc.text("State Code", startX, currY);
    doc.text(`: 33`, colonX, currY);
    
    currY += 5;
    doc.text("Country", startX, currY);
    doc.text(`: India`, colonX, currY);
    
    currY += 5;
    doc.text("Pin Code", startX, currY);
    doc.text(`: 626125`, colonX, currY);
    
    currY += 5;
    doc.text("Phone", startX, currY);
    doc.text(`: 6369825925`, colonX, currY);
    
    currY += 10;
    const now = new Date();
    const dateOpts: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: '2-digit' };
    const dateParts = now.toLocaleDateString('en-GB', dateOpts).split(' ');
    const dateStr = `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`;
    const timeStr = now.toLocaleTimeString('en-GB', { hour12: false });
    
    doc.text(`Date : ${dateStr} Time : ${timeStr}`, startX, currY);
    doc.text(`Order ID : ${orderId}`, startX + 90, currY);
    
    // Billed To
    currY += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Billed To:", 14, currY);
    doc.setFont("helvetica", "normal");
    
    currY += 7;
    doc.text(formData.fullName, 14, currY);
    
    const addressLines = doc.splitTextToSize(formData.address, 100);
    currY += 5;
    doc.text(addressLines, 14, currY);
    
    let currentY = currY + (addressLines.length * 5);
    
    doc.text(`${formData.city}, ${formData.state} - ${formData.pincode}`, 14, currentY);
    currentY += 5;
    doc.text(`Phone: ${formData.phone}`, 14, currentY);
    currentY += 5;
    doc.text(`Email: ${formData.email}`, 14, currentY);
    
    if (formData.gstNumber && formData.gstNumber.trim() !== '') {
      currentY += 5;
      doc.text(`Customer GST: ${formData.gstNumber.toUpperCase()}`, 14, currentY);
    }
    
    // Table
    const tableColumn = ["Item", "Size", "Qty", "Price", "Total"];
    const tableRows: any[] = [];
    
    orderedItems.forEach(item => {
      const price = parseFloat(String(item.price).replace(/[^\d]/g, ''));
      const total = price * item.quantity;
      tableRows.push([
        item.name,
        item.size,
        item.quantity.toString(),
        `Rs. ${price.toLocaleString('en-IN')}`,
        `Rs. ${total.toLocaleString('en-IN')}`
      ]);
    });
    
    autoTable(doc, {
      startY: currentY + 10,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [11, 94, 100] }
    });
    
    let afterTableY = (doc as any).lastAutoTable.finalY || 105;
    
    const currentSubtotal = orderedItems.reduce((acc, item) => {
      const numericPrice = parseFloat(String(item.price).replace(/[^\d]/g, ''));
      return acc + numericPrice * item.quantity;
    }, 0);
    
    const taxableAmount = currentSubtotal / 1.05;
    const cgst = taxableAmount * 0.025;
    const sgst = taxableAmount * 0.025;
    const currentGrandTotal = currentSubtotal > 0 ? currentSubtotal + 70 : 0;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Subtotal: Rs. ${currentSubtotal.toLocaleString('en-IN')}`, 140, afterTableY + 10);
    doc.text(`CGST (2.5%): Rs. ${cgst.toFixed(2)}`, 140, afterTableY + 15);
    doc.text(`SGST (2.5%): Rs. ${sgst.toFixed(2)}`, 140, afterTableY + 20);
    doc.text(`Shipping: Rs. 70`, 140, afterTableY + 25);
    
    doc.setFont("helvetica", "bold");
    doc.text(`Grand Total: Rs. ${currentGrandTotal.toLocaleString('en-IN')}`, 140, afterTableY + 31);
    
    afterTableY += 15;
    
    // Check if we need a new page for T&C
    if (afterTableY + 130 > doc.internal.pageSize.getHeight()) {
       doc.addPage();
       afterTableY = 20;
    } else {
       afterTableY += 25; // Space after totals
    }
    
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    
    // Line separator
    doc.line(14, afterTableY, 196, afterTableY);
    afterTableY += 5;
    
    doc.text("(Price includes hallmarking charges, consumable and packing material)", 105, afterTableY, { align: "center" });
    doc.text("E.&O.E.", 196, afterTableY, { align: "right" });
    
    afterTableY += 6;
    doc.setFont("helvetica", "bold");
    doc.text("Terms & Conditions.", 14, afterTableY);
    doc.setFont("helvetica", "normal");
    
    afterTableY += 5;
    const tnc = [
      "1. The charges to make receive payment specified in here includes tax, hallmark, Procurement, Wastage, Making Charges, Imitation Stones, Precious Stones, Artisan Work, Logistics and other inclusive,",
      "2. Silver, wastage and making charges are calculated on gross weight only.",
      "3. The Net Weight is only indicative and the actual may vary. However, in all cases, the Net Weight shown in the invoice will be considered.",
      "4. If any defect is found in the jewel/material/design, the customer shall report the same to the Branch Manager immediately within three days, from the date ofpurchase. The company shall rectify the same, at its own cost.",
      "5. All disputed are subject to the jurisdiction of the courts in srivilliputtur."
    ];
    
    tnc.forEach(term => {
      const lines = doc.splitTextToSize(term, 182);
      doc.text(lines, 14, afterTableY);
      afterTableY += lines.length * 3.5;
    });
    
    afterTableY += 2;
    doc.setFont("helvetica", "bold");
    doc.text("Declaration", 14, afterTableY);
    doc.setFont("helvetica", "normal");
    afterTableY += 4;
    
    const declaration = "I have read, understood, and accept the terms and conditions mentioned above, the guidelines regarding quality specified at the backside of this invoice were explained to me in Tamil.\nThe above jewels mentioned in the invoice are according to my specification and I purchased / sold the jewels at my own wish/need, after due verification. Hereby, indicating the acceptance for above terms & conditions, received the product in good condition, and, doing the payment. I further acknowledge the amount stated is correct and accurate.";
    
    const decLines = doc.splitTextToSize(declaration, 182);
    doc.text(decLines, 14, afterTableY);
    afterTableY += decLines.length * 3.5;
    
    afterTableY += 12;
    doc.setFont("helvetica", "bold");
    doc.text("Customer Signature", 14, afterTableY);
    doc.text("for ELARA SILVER", 196, afterTableY, { align: "right" });
    
    afterTableY += 5;
    doc.setFont("helvetica", "normal");
    doc.text("Authorised Signatory", 196, afterTableY, { align: "right" });
    
    afterTableY += 5;
    doc.setFontSize(6);
    doc.text("[x] I hereby consent to receive messages via WhatsApp, SMS or other social media platforms and also receive calls in my mobile number provided in this invoice.", 14, afterTableY);
    
    afterTableY += 6;
    doc.setFillColor(11, 94, 100); 
    doc.rect(14, afterTableY, 182, 6, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("Thanks for preferring to shop at Elara Silver.", 105, afterTableY + 4, { align: "center" });
    
    doc.save(`Invoice_${orderId}.pdf`);
  };

  if (cartItems.length === 0 && step !== 3) {
    return <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">Redirecting...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-black pt-28 pb-20 selection:bg-[#0B5E64] selection:text-white">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Main Content Area */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Progress Indicator */}
          {step !== 3 && (
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 1 ? 'bg-[#0B5E64] text-white' : 'bg-black/10 text-black/40'}`}>
                  1
                </div>
                <span className={`text-xs tracking-widest uppercase font-semibold ${step >= 1 ? 'text-black' : 'text-black/40'}`}>Details</span>
              </div>
              <div className="w-12 h-[1px] bg-black/10" />
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 2 ? 'bg-[#0B5E64] text-white' : 'bg-black/10 text-black/40'}`}>
                  2
                </div>
                <span className={`text-xs tracking-widest uppercase font-semibold ${step >= 2 ? 'text-black' : 'text-black/40'}`}>Payment</span>
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* STEP 1: Details */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-white p-8 md:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-black/5"
              >
                <h2 className="text-xl md:text-2xl font-semibold tracking-wide text-black mb-8">Shipping Information</h2>
                <form onSubmit={handleProceedToPayment} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] tracking-widest uppercase text-black/60 font-semibold">Full Name *</label>
                      <input required type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full bg-[#F5F5F7] border border-transparent focus:border-[#0B5E64] p-4 text-sm outline-none transition-colors" placeholder="Enter your full name" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] tracking-widest uppercase text-black/60 font-semibold">Phone Number *</label>
                      <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-[#F5F5F7] border border-transparent focus:border-[#0B5E64] p-4 text-sm outline-none transition-colors" placeholder="+91 XXXXX XXXXX" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] tracking-widest uppercase text-black/60 font-semibold">Email Address *</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-[#F5F5F7] border border-transparent focus:border-[#0B5E64] p-4 text-sm outline-none transition-colors" placeholder="Order updates will be sent here" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] tracking-widest uppercase text-black/60 font-semibold">Shipping Address *</label>
                    <textarea required name="address" value={formData.address} onChange={handleInputChange} rows={3} className="w-full bg-[#F5F5F7] border border-transparent focus:border-[#0B5E64] p-4 text-sm outline-none transition-colors resize-none" placeholder="House/Flat No., Building Name, Street" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] tracking-widest uppercase text-black/60 font-semibold">City *</label>
                      <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-[#F5F5F7] border border-transparent focus:border-[#0B5E64] p-4 text-sm outline-none transition-colors" placeholder="e.g. Chennai" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] tracking-widest uppercase text-black/60 font-semibold">State *</label>
                      <select 
                        required 
                        name="state" 
                        value={formData.state} 
                        onChange={(e: any) => handleInputChange(e)} 
                        className="w-full bg-[#F5F5F7] border border-transparent focus:border-[#0B5E64] p-4 text-sm outline-none transition-colors"
                      >
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="West Bengal">West Bengal</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Bihar">Bihar</option>
                        <option value="Odisha">Odisha</option>
                        <option value="Assam">Assam</option>
                        <option value="Goa">Goa</option>
                        <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                        <option value="Other State">Other State</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] tracking-widest uppercase text-black/60 font-semibold">Pincode *</label>
                      <input required type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} className="w-full bg-[#F5F5F7] border border-transparent focus:border-[#0B5E64] p-4 text-sm outline-none transition-colors" placeholder="e.g. 600001" />
                    </div>
                  </div>

                  {formData.state !== 'Tamil Nadu' && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center gap-2">
                      <span>🚚</span>
                      <span>Delivery outside Tamil Nadu incurs a nominal shipping charge of <strong>₹150</strong>.</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[10px] tracking-widest uppercase text-black/60 font-semibold">GST Number (Optional) - For B2B Invoice</label>
                    <input type="text" name="gstNumber" value={formData.gstNumber || ''} onChange={handleInputChange} className="w-full bg-[#F5F5F7] border border-transparent focus:border-[#0B5E64] p-4 text-sm outline-none transition-colors uppercase" placeholder="e.g. 29GGGGG1314R9Z6" maxLength={15} />
                  </div>

                  <div className="pt-6">
                    <LuxuryButton isCTA={true} className="w-full md:w-auto">
                      <button type="submit" className="w-full md:w-auto px-10 py-4 bg-[#0B5E64] text-white text-xs font-bold tracking-[0.2em] uppercase transition-opacity duration-500 hover:opacity-90 shadow-xl shadow-black/10">
                        Continue to Payment
                      </button>
                    </LuxuryButton>
                  </div>
                </form>
              </motion.div>
            )}

            {/* STEP 2: Payment */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-white p-8 md:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-black/5"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl md:text-2xl font-semibold tracking-wide text-black">Secure Payment</h2>
                  <div className="flex items-center gap-2 text-green-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                    <span className="text-[9px] font-bold tracking-widest uppercase">SSL Secured</span>
                  </div>
                </div>

                <div className="mb-8 p-4 bg-[#F5F5F7] border border-black/5 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] tracking-widest uppercase text-black/50 mb-1">Amount to Pay</p>
                    <p className="text-xl font-bold text-[#0B5E64]">{formattedGrandTotal}</p>
                  </div>
                  <button onClick={() => setStep(1)} className="text-xs font-semibold underline text-black/50 hover:text-black">Edit Details</button>
                </div>

                <form onSubmit={handleProcessPayment} className="space-y-6 relative">
                  {isProcessing && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-4">
                      <div className="w-10 h-10 border-4 border-[#0B5E64]/20 border-t-[#0B5E64] rounded-full animate-spin" />
                      <p className="text-[10px] tracking-widest uppercase font-bold text-[#0B5E64]">Processing Secure Payment...</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <label className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all border-[#0B5E64] bg-[#0B5E64]/5 shadow-sm`}>
                      <input 
                        type="radio" 
                        name="payment_method" 
                        value="razorpay" 
                        checked={paymentMethod === 'razorpay'} 
                        readOnly
                        className="mt-1 w-4 h-4 accent-[#0B5E64]" 
                      />
                      <div>
                        <span className="block text-sm font-semibold tracking-wide text-gray-900">Pay Online (Razorpay)</span>
                        <p className="text-xs text-gray-500 mt-1">Securely pay via UPI, Credit/Debit Cards, or NetBanking.</p>
                      </div>
                    </label>
                  </div>

                  {/* Terms and Refund Policy Agreement Checkbox */}
                  <div className="pt-2">
                    <label className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100/70 transition-colors">
                      <input 
                        type="checkbox"
                        required
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="mt-1 w-4 h-4 text-[#0B5E64] rounded border-gray-300 focus:ring-[#0B5E64]"
                      />
                      <span className="text-xs text-gray-700 leading-relaxed select-none">
                        I have read and agree to the{' '}
                        <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="text-[#0B5E64] font-semibold underline hover:text-[#084A4F]">
                          Terms & Conditions
                        </a>{' '}
                        and{' '}
                        <a href="/refund-return-policy" target="_blank" rel="noopener noreferrer" className="text-[#0B5E64] font-semibold underline hover:text-[#084A4F]">
                          Refund & Return Policy
                        </a>.
                      </span>
                    </label>
                  </div>

                  <div className="pt-4">
                    <LuxuryButton isCTA={true} className="w-full">
                      <button 
                        type="submit" 
                        disabled={isProcessing || !agreedToTerms} 
                        className="w-full px-10 py-5 bg-[#0B5E64] text-white text-xs font-bold tracking-[0.2em] uppercase transition-opacity duration-500 hover:opacity-90 shadow-xl shadow-black/10 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? 'Placing Order...' : (paymentMethod === 'razorpay' ? 'Pay Securely Online' : 'Place Order')}
                      </button>
                    </LuxuryButton>
                  </div>
                </form>
              </motion.div>
            )}

            {/* STEP 3: Success */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                className="bg-white p-12 md:p-16 shadow-2xl shadow-[#0B5E64]/10 border border-black/5 flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 bg-[#0B5E64] rounded-full flex items-center justify-center mb-8">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <h1 className="text-2xl md:text-3xl font-medium tracking-wide text-black mb-4">Order Confirmed</h1>
                <p className="text-black/60 text-sm max-w-md mx-auto mb-8">
                  Thank you for shopping with ELARA. Your luxury handcrafted pieces are being meticulously packaged and will be shipped shortly.
                </p>

                <div className="bg-[#F5F5F7] py-4 px-8 w-full max-w-sm border border-black/5 mb-10">
                  <p className="text-[10px] tracking-widest uppercase text-black/50 mb-1">Order Reference ID</p>
                  <p className="text-lg font-mono font-bold tracking-widest text-[#0B5E64]">{orderId}</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <LuxuryButton isCTA={false}>
                    <button onClick={downloadInvoice} className="px-10 py-4 bg-[#0B5E64] text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-black transition-colors duration-500 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download Invoice
                    </button>
                  </LuxuryButton>
                  
                  <LuxuryButton isCTA={false}>
                    <button onClick={() => router.push('/')} className="px-10 py-4 bg-transparent border border-black text-black text-xs font-bold tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-colors duration-500">
                      Return to Collection
                    </button>
                  </LuxuryButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order Summary Sidebar */}
        {step !== 3 && (
          <div className="lg:col-span-5 h-fit bg-white border border-black/5 shadow-[0_10px_40px_rgba(0,0,0,0.02)] p-8">
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-black mb-8 pb-4 border-b border-black/10">Order Summary</h3>
            
            <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto scrollbar-none">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4">
                  <div className="w-20 h-20 bg-[#F5F5F7] border border-black/5 p-2 shrink-0">
                    <img 
                      src={item.image || `/images/${item.id}.png`} 
                      alt={item.name} 
                      className="w-full h-full object-contain" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/hero1.png';
                      }}
                    />
                  </div>
                  <div className="flex flex-col justify-center flex-grow space-y-1">
                    <h4 className="text-xs font-semibold tracking-wide uppercase text-black truncate max-w-[180px]">{item.name}</h4>
                    <p className="text-[10px] tracking-widest text-black/50 font-mono">Size: {item.size}</p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-[10px] text-black/50">Qty: {item.quantity}</p>
                      <p className="text-xs font-bold tracking-wider">{`₹${(parseFloat(String(item.price).replace(/[^\d]/g, '')) * item.quantity).toLocaleString('en-IN')}`}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-black/10 text-xs tracking-widest uppercase text-black/60">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-black font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {isGiftWrap && (
                <div className="flex justify-between">
                  <span>Luxury Packaging</span>
                  <span className="text-black font-semibold">₹50</span>
                </div>
              )}
              <div className="flex justify-between pb-4 border-b border-black/10">
                <span>Shipping ({formData.state === 'Tamil Nadu' ? 'Tamil Nadu' : 'Out of State'})</span>
                <span className={shippingFee > 0 ? "text-black font-semibold" : "text-[#0B5E64] font-bold"}>
                  {shippingFee > 0 ? `+₹${shippingFee}` : 'FREE'}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-black pt-2">
                <span>Grand Total</span>
                <span className="text-[#0B5E64]">{formattedGrandTotal}</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-black/10">
              <div className="flex items-center gap-3 text-black/50 justify-center">
                <svg className="w-5 h-5 text-silver-chrome" viewBox="0 0 100 100" fill="none">
                  <path d="M50 5L63 38L96 50L63 62L50 95L37 62L4 50L37 38L50 5Z" stroke="currentColor" strokeWidth="2.5"/>
                </svg>
                <span className="text-[8px] font-bold tracking-[0.3em] uppercase">ELARA Authenticity Guarantee</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
