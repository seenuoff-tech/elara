import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Elara Silver',
  description: "Read the Terms and Conditions governing the use of Elara Silver's website, products, and services.",
};

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing or using the Elara Silver website (elarasilver.com) and purchasing our products, you agree to be bound by these Terms and Conditions. If you do not agree to all the terms and conditions stated here, please do not access our website or use our services. Elara Silver reserves the right to revise these terms at any time without prior notice. Continued use of the website following any such changes constitutes your acceptance of the new terms.`,
  },
  {
    title: '2. Products & Descriptions',
    content: `All jewellery sold by Elara Silver is crafted in BIS 925 Hallmark certified sterling silver unless stated otherwise. We endeavour to ensure that all product descriptions, images, and specifications are as accurate as possible. However, we cannot guarantee that your device display will accurately reflect the actual colour and lustre of our silver pieces. Elara Silver reserves the right to limit quantities, modify product offerings, or discontinue any product at any time without prior notice.`,
  },
  {
    title: '3. Pricing & Payment',
    content: `All prices displayed on our website are in Indian Rupees (INR) and include applicable GST unless stated otherwise. Elara Silver reserves the right to modify prices without prior notice. Payment must be made in full at the time of placing the order. We accept major credit/debit cards, UPI, net banking, and select digital wallets. In the event of a pricing error on our website, we reserve the right to cancel the order and issue a full refund.`,
  },
  {
    title: '4. Order Placement & Confirmation',
    content: `Placing an order on our website constitutes an offer to purchase the selected items. An order is considered accepted only upon receipt of a confirmation email from Elara Silver. We reserve the right to refuse or cancel any order at our discretion, including orders where stock is unavailable, payment cannot be verified, or fraudulent activity is suspected. You will be notified and any amounts charged will be promptly refunded.`,
  },
  {
    title: '5. Shipping & Delivery',
    content: `Elara Silver offers complimentary standard shipping on all domestic orders. Estimated delivery timelines are 3–7 business days for standard and 1–2 business days for express shipping. Delivery timelines are indicative and not guaranteed. Elara Silver is not liable for delays caused by courier partners, customs, natural events, or any other factors beyond our control. Risk of loss and title for items pass to you upon delivery.`,
  },
  {
    title: '6. Intellectual Property',
    content: `All content on the Elara Silver website — including but not limited to text, graphics, logos, icons, images, product photography, design layouts, and software — is the exclusive intellectual property of Elara Silver and is protected under applicable Indian and international copyright laws. You may not reproduce, distribute, modify, or use any content from this site for commercial purposes without our prior written consent.`,
  },
  {
    title: '7. User Conduct',
    content: `By using our website, you agree not to engage in any activity that could harm, disrupt, or compromise the website's integrity, security, or other users' experience. Prohibited activities include but are not limited to: transmitting spam, viruses, or malicious code; attempting to gain unauthorised access to our systems; using the website for any unlawful purpose; or misrepresenting your identity.`,
  },
  {
    title: '8. Limitation of Liability',
    content: `To the maximum extent permitted by applicable law, Elara Silver shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of our website or products. Our total liability in any matter arising from or related to these Terms shall not exceed the amount paid by you for the specific product or service giving rise to the claim.`,
  },
  {
    title: '9. Governing Law',
    content: `These Terms and Conditions are governed by and construed in accordance with the laws of India. Any disputes arising under or in connection with these terms shall be subject to the exclusive jurisdiction of the courts located in Tamil Nadu. Both parties consent to personal jurisdiction in such courts and waive any objection to such jurisdiction or venue.`,
  },
  {
    title: '10. Contact Information',
    content: `If you have any questions regarding these Terms and Conditions, please reach out to us at info@elarasilver.com or call us at +91 6369825925, or write to us at ELARA SILVER, 130/134 A North car street, srivilliputtur 626125 tamilnadu. Our client services team is available Monday through Saturday, 10:00–19:00 IST.`,
  },
  {
    title: '11. Jewellery Care',
    content: (
      <div className="space-y-4">
        <p>Silver jewels have a soft luster, and so they can get tarnished easily if not taken care of. Follow these simple steps to care your jewellery just like how you care for yourself :)</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Do not wear when sweating.</li>
          <li>Avoid perfume, lotion or sunscreen after wearing the jewel.</li>
          <li>Do not wear when washing.</li>
          <li>Avoid collide, grind or fire.</li>
          <li>Do not wear when sleeping.</li>
          <li>Put inside a plastic box when not in use. Avoid velvet box.</li>
          <li>Do not clean with chemicals.</li>
          <li>Use soft cloth to clean.</li>
        </ul>
      </div>
    ),
  },
];

export default function TermsAndConditionsPage() {
  return (
    <div className="bg-white text-black min-h-screen pt-[220px] md:pt-[280px] pb-24">
      {/* Header */}
      <section className="relative px-6 md:px-12 max-w-4xl mx-auto text-center space-y-5 pb-16">
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="h-[1px] w-10 bg-black/20" />
          <span className="text-[10px] font-semibold tracking-[0.45em] text-[#0B5E64] uppercase">Legal</span>
          <div className="h-[1px] w-10 bg-black/20" />
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase leading-tight">
          Terms &amp;<br />Conditions
        </h1>
        <p className="text-black/45 font-light text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          Please read these terms carefully before using our website or purchasing any of our curated silver creations.
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
