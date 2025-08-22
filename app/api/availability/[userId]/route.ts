import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';



export async function GET(req: NextRequest, context: { params: { userId: string } }) {

  const today = new Date().toISOString().split('T')[0];

  try {
    const { userId } = context.params;
    console.log('userid from slot api', userId)
    const snapshot = await adminDb
      .collection('availability')
      .doc(userId)
      .collection('slots')
      .orderBy('date', 'asc')
      .where('date', '>=', today)
      .get();

      console.log('slots dates:',today)

    const slots: { [date: string]: [string, string][] } = {};


    snapshot.forEach((doc) => {
      const { date, startTime, endTime, isBooked } = doc.data();
      if (!isBooked) {
        if (!slots[date]) slots[date] = [];
        slots[date].push([startTime, endTime]);
      }
    });

    console.log('slots from db for booking page', slots)
    return NextResponse.json({ slots })

  } catch (error) {
    console.log('error occured fetching slots')
    return NextResponse.json({ error: "couldnt fetch data from firebase" }, { status: 500 })
  }



}


