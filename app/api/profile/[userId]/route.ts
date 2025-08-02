// /app/api/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

import { adminDb } from '@/lib/firebaseAdmin';



//get profile if ec=xists
export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const ref = adminDb.collection('profiles').doc(userId);
     const snap = await ref.get();

    return NextResponse.json(snap.exists ? snap.data() : null);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}


//post method set profile
export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const data = await req.json();

    const ref = adminDb.collection('profiles').doc(userId);
    const checkProf = await ref.get();

     await ref.set({ ...data, userId }, { merge: true });
    

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }
}
