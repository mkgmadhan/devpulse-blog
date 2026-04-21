import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email required.' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const audienceId = process.env.RESEND_AUDIENCE_ID;

    if (!apiKey) {
      // Dev mode — simulate success
      return NextResponse.json({ message: 'Subscribed! (dev mode)' });
    }

    const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, unsubscribed: false }),
    });

    if (!res.ok) {
      const err = await res.json();
      if (err.name === 'already_exists') {
        return NextResponse.json({ message: "You're already subscribed!" });
      }
      return NextResponse.json({ error: 'Failed to subscribe. Try again.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Subscribed! Welcome to DevPulse.' });
  } catch {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
