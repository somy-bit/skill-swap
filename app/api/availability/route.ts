//handle avalability changes and updates// app/api/availability/route.ts
import { db } from '@/lib/firebase';import { getAuth } from '@clerk/nextjs/server'; // Or use your Firebase auth logic
import { NextRequest, NextResponse } from 'next/server';
import { collection, doc, getDocs, addDoc, query, where } from 'firebase/firestore';
import { adminDb } from '@/lib/firebaseAdmin';

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req); // Clerk or Firebase Auth
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const snapshot = await adminDb
      .collection('availability')
      .doc(userId)
      .collection('slots')
      .get();


     const slots = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));


    return NextResponse.json({ slots },{status:200});
  } catch (error) {
    console.error('GET /api/availability error:', error);
    return NextResponse.json({ error: 'Failed to get availability' }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { date, startTime, endTime } = body;

    if (!date || !startTime || !endTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

       const slotsRef = adminDb
      .collection('availability')
      .doc(userId)
      .collection('slots');

    // Step 1: Fetch all slots for the same date
    const snapshot = await slotsRef.where('date', '==', date).get();

    // Step 2: Check for any overlap
   const newStart = parseTime(startTime);
    const newEnd = parseTime(endTime);


    for (const doc of snapshot.docs) {
      const slot = doc.data();
      const existingStart = parseTime(slot.startTime);
      const existingEnd = parseTime(slot.endTime);

      const isOverlap =
        (newStart >= existingStart && newStart < existingEnd) || // starts inside existing
        (newEnd > existingStart && newEnd <= existingEnd) ||     // ends inside existing
        (newStart <= existingStart && newEnd >= existingEnd);    // completely wraps

      if (isOverlap) {
        return NextResponse.json(
          { error: 'This time slot overlaps with an existing one. Please choose a different time.' },
          { status: 400 }
        );
      }
    }

    // Step 3: Add slot
    const newSlot = {
      date,
      startTime,
      endTime,
      isBooked: false,
      createdAt: new Date(),
    };

    const docRef = await slotsRef.add(newSlot);

    return NextResponse.json({ id: docRef.id, ...newSlot });
  } catch (error) {
    console.error('POST /api/availability error:', error);
    return NextResponse.json({ error: 'Failed to create availability' }, { status: 500 });
  }
}

// Helper: converts "HH:mm" → minutes since midnight
function parseTime(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}


