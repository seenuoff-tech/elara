import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, orderId, customerData, total, invoiceBase64, discountAmount, couponCode } = body;

    // Update stock for each item
    for (const item of items) {
      if (item.id) {
        // Decrease stock
        await prisma.product.update({
          where: { id: item.id },
          data: {
            stock: {
              decrement: item.quantity
            },
            reviews: {
              increment: 1
            }
          }
        });
      }
    }

    // Save order in database
    const newOrder = await prisma.order.create({
      data: {
        orderNumber: orderId,
        customerName: customerData.fullName || 'Guest',
        email: customerData.email,
        phone: customerData.phone || '',
        address: customerData.address || '',
        city: customerData.city || '',
        state: customerData.state || '',
        pincode: customerData.pincode || '',
        totalAmount: typeof total === 'string' ? parseFloat(total.replace(/[^0-9.]/g, '')) : total,
        discountAmount: discountAmount || 0,
        couponCode: couponCode || null,
        paymentMethod: body.paymentMethod || 'cod',
        paymentStatus: body.paymentMethod === 'cod' ? 'Pending' : 'Paid',
        orderStatus: 'Processing',
        items: {
          create: items.map((item: any) => ({
            productId: item.id ? item.id.toString() : 'unknown',
            name: item.name || 'Unknown Item',
            price: item.price ? parseFloat(item.price.toString().replace(/[^0-9.]/g, '')) : 0,
            quantity: item.quantity || 1,
            size: item.size || item.selectedSize || '',
          }))
        }
      }
    });

    // Update coupon uses if a coupon was used
    if (couponCode) {
      try {
        await prisma.coupon.update({
          where: { code: couponCode },
          data: { currentUses: { increment: 1 } }
        });
      } catch (err) {
        console.error('Failed to increment coupon uses:', err);
      }
    }

    // Send Email via Nodemailer
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER || 'your-email@gmail.com', // Replace with valid Gmail or use ENV
          pass: process.env.EMAIL_PASS || 'your-app-password',     // Replace with Gmail App Password or use ENV
        }
      });

      const mailOptions = {
        from: `"Elara Silver" <${process.env.EMAIL_USER || 'noreply@elarasilver.com'}>`,
        to: customerData.email,
        subject: `Order Confirmed: ${orderId} - Elara Silver`,
        text: `Dear ${customerData.fullName || 'Customer'},\n\nThank you for your order with Elara Silver!\nYour order ${orderId} has been successfully confirmed.\n\nTrack your order through this link: http://localhost:3000/track-order\n\nPlease use your registered email (${customerData.email}) and order ID (${orderId}) to check the status.\n\nWarm regards,\nElara Silver Team\n130/134 A North Car Street,\nSrivilliputtur, Tamil Nadu - 626125`,
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; line-height: 1.6;">
            <div style="text-align: center; padding: 20px 0;">
              <h1 style="color: #0B5E64; margin: 0; font-size: 24px; letter-spacing: 2px;">ELARA SILVER</h1>
            </div>
            
            <p style="font-size: 16px;">Dear <strong>${customerData.fullName || 'Customer'}</strong>,</p>
            
            <p style="font-size: 16px;">Thank you for your order with Elara Silver! We are thrilled to confirm that your order <strong>${orderId}</strong> has been successfully placed and is now being processed.</p>
            
            <div style="background-color: #F5F5F7; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <p style="margin-top: 0; font-size: 15px;"><strong>Track Your Order:</strong></p>
              <a href="http://localhost:3000/track-order" style="display: inline-block; background-color: #0B5E64; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold; margin-bottom: 15px;">Track Order Here</a>
              <p style="margin-bottom: 0; font-size: 14px; color: #666;">
                Please use your registered email (<strong>${customerData.email}</strong>) and order ID (<strong>${orderId}</strong>) to check your live status.
              </p>
            </div>
            
            <p style="font-size: 15px; color: #555;">If you have any questions about your order, please do not hesitate to contact us.</p>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #777; font-size: 13px;">
              <p style="margin: 0 0 5px 0;"><strong>Warm regards,</strong></p>
              <p style="margin: 0 0 15px 0; color: #0B5E64; font-weight: bold;">Elara Silver Team</p>
              <p style="margin: 0;">130/134 A North Car Street,</p>
              <p style="margin: 0;">Srivilliputtur, Tamil Nadu</p>
              <p style="margin: 0;">Pincode: 626125</p>
            </div>
          </div>
        `
      };

      if (invoiceBase64) {
        // invoiceBase64 format: data:application/pdf;filename=generated.pdf;base64,JVBERi...
        const base64Data = invoiceBase64.split('base64,')[1];
        if (base64Data) {
          (mailOptions as any).attachments = [
            {
              filename: `Invoice_${orderId}.pdf`,
              content: base64Data,
              encoding: 'base64'
            }
          ];
        }
      }

      await transporter.sendMail(mailOptions);
      console.log('Order confirmation email sent to', customerData.email);
    } catch (mailError) {
      console.error('Error sending confirmation email:', mailError);
      // We don't fail the checkout if email fails, just log it.
    }

    return NextResponse.json({ success: true, message: 'Order placed successfully', orderId: newOrder.orderNumber });
  } catch (error: any) {
    console.error('Error during checkout:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
