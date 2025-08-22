import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';


export default async function GET(req: NextRequest) {
  const { userId } = getAuth(req);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' });
  }

  try {
    const response = await fetch(`https://api.clerk.dev/v1/users/${userId}/firebase_token`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`, // must be set in .env
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Clerk API error: ${errorText}`);
    }

    const { token } = await response.json(); // Clerk returns { token: string }
    console.log('token firebase',token)
    return NextResponse.json(token ,{status:200});
  } catch (err) {
    console.error('Error fetching Firebase token from Clerk:', err);
    return NextResponse.json({ error: 'Failed to get Firebase token' });
  }
}
