// /app/api/profiles/route.ts
import { adminDb } from '@/lib/firebaseAdmin';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const snapshot = await adminDb.collection('profiles').get();

    const profiles = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ profiles });
  } catch (error) {
    console.error('Failed to fetch profiles', error);
    return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 });
  }
}
