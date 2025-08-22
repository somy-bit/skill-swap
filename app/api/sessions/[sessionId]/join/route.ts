
import { adminDb } from "@/lib/firebaseAdmin"; // your admin firestore instance
import { Session } from "@/types/type";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { sessionId: string } }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sessionId =  params.sessionId;
  const sessionRef = adminDb.collection("sessions").doc(sessionId);
  const sessionSnap = await sessionRef.get();

  if (!sessionSnap.exists) return NextResponse.json({ error: "Session not found" }, { status: 404 });

  const sessionData = sessionSnap.data() as Session;

  // Only mentor can mark hasJoined
  if (sessionData.mentorId !== userId)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await sessionRef.update({
    hasJoined: true,
    
  });

  return NextResponse.json({ message: "Marked as joined" }, { status: 200 });
}
