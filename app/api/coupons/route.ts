import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, coupons });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch coupons' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, discountType, discountValue, startDate, endDate, status, maxUses } = body;
    
    if (!code || !discountType || discountValue === undefined || !startDate || !endDate) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }
    
    // Check if code exists
    const existing = await prisma.coupon.findUnique({
      where: { code }
    });
    
    if (existing) {
      return NextResponse.json({ success: false, error: 'Coupon code already exists' }, { status: 400 });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        discountType,
        discountValue: parseFloat(discountValue),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: status || 'Active',
        maxUses: maxUses ? parseInt(maxUses) : null,
      }
    });
    
    // --- Send Email Notification to Subscribers ---
    if (coupon.status === 'Active') {
      try {
        const subscribers = await prisma.newsletterSubscriber.findMany({
          select: { email: true }
        });

        if (subscribers.length > 0) {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            }
          });

          // Extract just the emails
          const emails = subscribers.map((sub: any) => sub.email);

          const discountText = discountType === 'percentage' 
            ? `${coupon.discountValue}% OFF` 
            : `₹${coupon.discountValue} OFF`;

          const mailOptions = {
            from: `"Elara Silver Offers" <${process.env.EMAIL_USER}>`,
            bcc: emails, // Use BCC so subscribers can't see each other's emails
            subject: `🎉 Exclusive Offer: ${discountText} Your Next Order!`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: center; color: #333;">
                <h1 style="color: #0B5E64;">Special Offer Just For You!</h1>
                <p style="font-size: 16px;">As a valued subscriber of Elara Silver, we are excited to share a brand new offer with you!</p>
                <div style="background-color: #F5F5F7; padding: 20px; border-radius: 8px; margin: 30px 0;">
                  <h2 style="margin-top: 0;">Get ${discountText}</h2>
                  <p>Use Coupon Code at checkout:</p>
                  <h1 style="background: #0B5E64; color: #fff; padding: 10px; border-radius: 5px; display: inline-block; letter-spacing: 2px;">
                    ${coupon.code}
                  </h1>
                </div>
                <p>Hurry, this offer is valid from ${coupon.startDate.toLocaleDateString()} to ${coupon.endDate.toLocaleDateString()}!</p>
                <a href="https://elarasilver.com/shop" style="display: inline-block; background-color: #0B5E64; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold; margin-top: 15px;">Shop Now</a>
                <p style="margin-top: 40px; font-size: 12px; color: #777;">You are receiving this email because you subscribed to the Elara Silver newsletter.</p>
              </div>
            `
          };

          // We don't await this so it doesn't block the API response if there are many subscribers
          transporter.sendMail(mailOptions).catch(console.error);
        }
      } catch (mailError) {
        console.error('Failed to notify subscribers:', mailError);
      }
    }
    // ----------------------------------------------
    
    return NextResponse.json({ success: true, coupon });
  } catch (error) {
    console.error('Error creating coupon:', error);
    return NextResponse.json({ success: false, error: 'Failed to create coupon' }, { status: 500 });
  }
}
