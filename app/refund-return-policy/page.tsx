import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund & Return Policy | Elara Silver',
  description: 'Learn about our hassle-free refund and return policy for all sterling silver jewellery orders.',
};

const highlights = [
  { icon: '8', label: 'Hours to Report', desc: 'Notify us within 8 hours of delivery' },
  { icon: '📹', label: 'Unboxing Video', desc: 'Mandatory proof required for returns' },
  { icon: '7', label: 'Day Return Process', desc: 'Complete return and exchange window' },
  { icon: '₹150', label: 'Shipping Charges', desc: 'Flat rate applicable on all orders' },
];

const sections = [
  {
    title: '1. Eligible Returns',
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>An uninterrupted unboxing video is mandatory as proof, starting before opening the package.</li>
        <li>The product received is incorrect or different from the order placed.</li>
        <li>Return requests must be reported within 8 hours of delivery.</li>
        <li>Requests without valid video proof will not be considered.</li>
        <li>Products must be unused, unworn, and returned in original packaging with all tags, invoices, and accessories intact.</li>
        <li>Damage caused after delivery, improper handling, or normal wear and tear are not eligible for return.</li>
        <li>ELARA SILVER reserves the right to reject any return request that does not meet the above conditions.</li>
        <li>Exchange & return are not available for offer products.</li>
      </ul>
    ),
  },
  {
    title: '2. Defective or Damaged Products',
    content: (
      <div className="space-y-2">
        <p>If your order arrives damaged, or incomplete, or you receive an empty parcel, here’s what to do:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Notify us within 8 hours of delivery.</li>
          <li>Video proof of the unboxing is required.</li>
          <li>Requests without unboxing videos or made after 8 hours won’t be eligible for refunds or replacements.</li>
          <li>Our team will carefully evaluate the provided details and quickly decide whether a return or exchange is possible.</li>
        </ul>
      </div>
    ),
  },
  {
    title: '3. How Our 7-Day Return Process Works',
    content: (
      <div className="space-y-2">
        <p>If your return request meets our eligibility criteria, our team will review and approve the request after verifying the provided proof.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Once approved, a return pickup will be arranged by our team.</li>
          <li>The product must be packed securely and returned in its original condition with all original packaging, tags, invoice, certificates, and accessories intact.</li>
          <li>After the returned product is received and successfully inspected by our quality team, the refund process will be initiated.</li>
          <li>Refunds will only be processed if the product is found unused, undamaged, and in original condition.</li>
          <li>Customers may also choose to exchange the product for another item of the same value instead of a refund.</li>
          <li>ELARA SILVER reserves the right to reject refunds or exchanges if the returned item fails quality inspection or does not meet the return conditions.</li>
        </ul>
      </div>
    ),
  },
  {
    title: '4. Shipping Details',
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Shipping Charges:</strong> Flat ₹150 applicable on all orders.</li>
        <li><strong>Delivery Time:</strong> Standard delivery within 1 to 7 business days. Rare delays may occur due to unforeseen issues with our delivery partners.</li>
      </ul>
    ),
  },
  {
    title: '5. Price Variation',
    content: (
      <p>Product prices may vary without prior notice based on changes in the prevailing silver rates.</p>
    )
  },
  {
    title: '6. Cancellation Policy',
    content: (
      <p>Please note that orders cannot be canceled once they enter the shipping process.</p>
    )
  },
  {
    title: '7. Contact Us',
    content: (
      <div className="space-y-2">
        <p>We’re here to help with any questions or concerns:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>WhatsApp Support:</strong> Reach us at +91 6369825925</li>
          <li><strong>Customer Care Email:</strong> Drop us a message at <a href="mailto:info@elarasilver.com" className="text-[#0B5E64] underline">info@elarasilver.com</a>.</li>
        </ul>
      </div>
    ),
  },
];

export default function RefundReturnPolicyPage() {
  return (
    <div className="bg-white text-black min-h-screen pt-[220px] md:pt-[280px] pb-24">
      {/* Header */}
      <section className="relative px-6 md:px-12 max-w-4xl mx-auto text-center space-y-5 pb-16">

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase leading-tight">
          Refund &amp;<br />Return Policy
        </h1>
        <p className="text-black/45 font-light text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          At ELARA SILVER, your satisfaction is our priority. We’ve made returns and exchanges simple and hassle-free.
        </p>
        <p className="text-[11px] text-black/30 font-light tracking-widest uppercase">
          Last Updated: July 2026
        </p>
      </section>



      {/* Divider */}
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-black/10 to-transparent mb-16" />
      </div>

      {/* Sections */}
      <section className="max-w-4xl mx-auto px-6 md:px-12 space-y-12">
        {sections.map((section, i) => (
          <div
            key={i}
            className="group border-l-2 border-transparent hover:border-[#0B5E64] pl-6 transition-all duration-500"
          >
            <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-black mb-3 group-hover:text-[#0B5E64] transition-colors duration-300">
              {section.title}
            </h2>
            <div className="text-black/60 font-light leading-relaxed text-sm md:text-base">
              {section.content}
            </div>
          </div>
        ))}
      </section>


    </div>
  );
}
