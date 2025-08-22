
import { adminDb } from "@/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";
import { auth } from '@clerk/nextjs/server';
type SessionDoc = {
  mentorId: string,       // profile owner
  menteeId: string,       // the one booking
  date: string,
  startTime: string,
  endTime: string,
  duration?: number,       // in minutes
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed',
  createdAt?: string, //turn into date if got error
  skill: string;
  message: string;
  id: string
}

export async function GET() {
  try {
    const { userId } = await auth(); // Auth helper from Clerk
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Fetch sessions where the user is either a mentor or mentee
    const mentorQuery = adminDb.collection('sessions').where('mentorId', '==', userId);
    const menteeQuery = adminDb.collection('sessions').where('menteeId', '==', userId);

    const [mentorSnap, menteeSnap] = await Promise.all([mentorQuery.get(), menteeQuery.get()]);

    const rawSessions :SessionDoc[]= [
      ...mentorSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      ...menteeSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
    ]as SessionDoc [];

     const userIds = Array.from(
    new Set(rawSessions.flatMap(s => [s.mentorId, s.menteeId]))
  );

  const profileDocs = await Promise.all(
    userIds.map(uid => adminDb.collection('profiles').doc(uid).get())
  );

  const profileMap: Record<string, any> = {};
  profileDocs.forEach(doc => {
    if (doc.exists) {
      profileMap[doc.id] = doc.data();
    }
  });


  // Step 3: Attach mentor/mentee profile to each session
  const sessionsWithProfiles = rawSessions.map(session => ({
    ...session,
    mentorProfile: profileMap[session.mentorId] || null,
    menteeProfile: profileMap[session.menteeId] || null,
  }));
  console.log("session with profile",sessionsWithProfiles)

  return NextResponse.json({
    sessions: JSON.parse(JSON.stringify(sessionsWithProfiles)),
  });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}