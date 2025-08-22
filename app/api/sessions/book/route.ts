
import { adminDb } from "@/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {

    try {
        const session = await req.json();


        const required = ['mentorId', 'menteeId', 'date', 'startTime', 'endTime'];
        for (const key of required) {
            if (!session[key]) {
                return NextResponse.json({ error: `Missing ${key}` }, { status: 400 });
            }
        }

        const { mentorId } = session;
        const sessionRef = await adminDb.collection("sessions").add({
            ...session,
            createdAt: new Date().toISOString(),
        });

//add notification for mentor
     await adminDb
      .collection("notifications")
      .doc(mentorId)
      .collection("items")
      .add({
        message: `New session booked with you by a mentee.`,
        type: "booking",
        sessionId: sessionRef.id,
        timestamp: new Date(),
        seen: false,
      });



        return NextResponse.json({ success: true })

    } catch (error) {
        console.log('error booking session', error);
        return NextResponse.json({ error: "booking session failed" }, { status: 500 })
    }

}