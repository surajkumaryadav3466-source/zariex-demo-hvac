import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    const VAPI_API_KEY = process.env.VAPI_API_KEY;
    const VAPI_ASSISTANT_ID = process.env.VAPI_ASSISTANT_ID;
    const VAPI_PHONE_NUMBER_ID = process.env.VAPI_PHONE_NUMBER_ID;

    if (!VAPI_API_KEY || !VAPI_ASSISTANT_ID || !VAPI_PHONE_NUMBER_ID) {
      return NextResponse.json(
        { error: 'Vapi credentials not configured' },
        { status: 500 }
      );
    }

    // Sanitize to strict E.164 format
    let cleanNumber = phoneNumber.trim();
    if (!cleanNumber.startsWith('+')) {
      cleanNumber = '+' + cleanNumber;
    }
    cleanNumber = '+' + cleanNumber.slice(1).replace(/\D/g, '');

    const response = await fetch('https://api.vapi.ai/call', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VAPI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assistantId: VAPI_ASSISTANT_ID,
        phoneNumberId: VAPI_PHONE_NUMBER_ID,
        customer: {
          number: cleanNumber,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to initiate call' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      callId: data.id,
      status: data.status,
    });

  } catch (error) {
    console.error('Vapi call error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
