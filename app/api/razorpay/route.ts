import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency = 'INR', receipt = 'receipt#1' } = body;

    if (!amount) {
      return NextResponse.json({ success: false, error: 'Amount is required' }, { status: 400 });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('Keys are missing');
      return NextResponse.json({ success: false, error: 'Razorpay keys are missing' }, { status: 500 });
    }

    console.log('Using Key ID:', process.env.RAZORPAY_KEY_ID);
    console.log('Secret Length:', process.env.RAZORPAY_KEY_SECRET.length);

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
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
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}
