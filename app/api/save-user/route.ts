import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { adminDb } from '@/lib/firebaseAdmin';

export async function POST(req: NextRequest) {
  try {
    const auth = getAuth(req);
    const userId = auth.userId;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userData = await req.json();

    const userRef = adminDb.collection('users').doc(userId);
    const docSnap = await userRef.get();

   if (!docSnap.exists) {
      await userRef.set({
        id: userId,
        email: userData.email,
        name: userData.name,
        imageUrl: userData.imageUrl,
        createdAt: new Date().toISOString(),
      });

      return NextResponse.json({ message: 'User saved to Firestore' });
    }

    return NextResponse.json({ message: 'User already exists' });

  } catch (error) {
    console.error('Error saving user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
