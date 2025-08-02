//trigger and get notifications// /app/api/notifications/route.ts
import { adminDb } from '../../../lib/firebaseAdmin';
import { getAuth } from '@clerk/nextjs/server';
import { DocumentData, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const snapshot = await adminDb
      .collection('notifications')
      .doc(userId)
      .collection('items')
      .orderBy('timestamp', 'desc')
      .get();

    const notifications  = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ notifications });
  } catch (err) {
    console.error('Failed to fetch notifications:', err);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}
