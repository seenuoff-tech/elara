export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency = 'INR', receipt = 'receipt#1' } = body;

    if (!amount) {
      return NextResponse.json({ success: false, error: 'Amount is required' }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_live_TVTmsBuqCm25Fw';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'Y0aE1zjoYdz8A27HpzQiCqJ1';

    const instance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: amount * 100, // amount in the smallest currency unit (paise)
      currency,
      receipt,
    };

    const order = await instance.orders.create(options);

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    
    // Razorpay often nests the error message in error.error.description
    const errorMsg = error?.error?.description || error?.message || 'Server error - check Vercel logs';
    
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
