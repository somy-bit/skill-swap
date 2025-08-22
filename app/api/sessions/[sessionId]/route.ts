import { adminDb } from "@/lib/firebaseAdmin";
import { generateZoomAuthUrl, refreshZoomTokens } from "@/lib/utils";
import { deleteZoomMeeting } from "@/lib/zoom";
import { Session } from "@/types/type";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


// export async function GET(req: NextRequest, { params }: { params: { sessionId: string } }) {

//     const { userId } = await auth();
//     if (!userId)
//         return NextResponse.json({ error: 'UnAuthorized' }, { status: 401 })


//     try {
//         const sessionId = params.sessionId;
//         const action = req.nextUrl.searchParams.get('action');

//         if (!action || !['confirm', 'cancel'].includes(action)) {
//             return NextResponse.json({ error: 'Valid action is required (confirm or cancel)' }, { status: 400 });
//         }


//         const sessionref = adminDb.collection('sessions').doc(sessionId);
//         const updateData = { status: 'canceled' };

//         await sessionref.update(updateData)

//         return NextResponse.json({ message: `Session ${action}ed successfully` });

//     } catch (error) {
//         console.log('error happend confirming the session');
//         return NextResponse.json({ error: 'couldnt confirm the session' }, { status: 500 })
//     }


// }

export async function POST(req: NextRequest, { params }: { params: { sessionId: string } }) {

    const { userId } = await auth();
    const sessionId = params.sessionId;
    const body = await req.json();
    const { menteeId } = body;
    if (!userId)
        return NextResponse.json({ error: 'UnAuthorized' }, { status: 401 })
    try {
        const userDoc = await adminDb.collection('users').doc(userId).get();
        const userData = userDoc.data();

        if (!userData?.zoomAccessToken || !userData?.zoomRefreshToken) {
            // No tokens — ask client to redirect to Zoom OAuth
            console.log('zoom auth required111')
            const zoomAuthUrl = generateZoomAuthUrl(); // Your function to build OAuth URL
            return NextResponse.json({ error: 'zoom_auth_required', zoomAuthUrl }, { status: 401 });

        }

        const now = Date.now();
        let accessToken = userData.zoomAccessToken;

        // Check if access token expired, refresh if needed
        if (userData.zoomTokenExpiry < now) {
            const refreshedTokens = await refreshZoomTokens(userData.zoomRefreshToken);
            if (!refreshedTokens) {
                const zoomAuthUrl = generateZoomAuthUrl();
                console.log('zoom auth required')
                return NextResponse.json({ error: 'zoom_auth_required', zoomAuthUrl }, { status: 401 });

            }

            accessToken = refreshedTokens.access_token;
            await adminDb.collection('users').doc(userId).set({
                zoomAccessToken: refreshedTokens.access_token,
                zoomRefreshToken: refreshedTokens.refresh_token,
                zoomTokenExpiry: Date.now() + refreshedTokens.expires_in * 1000,
            }, { merge: true });
        }
        //

        const sessionRef = adminDb.collection('sessions').doc(sessionId);
        const sessionSnap = await sessionRef.get();


        if (!sessionSnap.exists) {
            console.log('session not found')
            return NextResponse.json({ error: 'Session not found' }, { status: 400 });

        }

        const sessionData = sessionSnap.data();

        const meetingPayload = {
            topic: `Mentorship Session`,
            type: 2,
            start_time: new Date(sessionData?.date + 'T' + sessionData?.startTime + ':00Z').toISOString(),
            duration: sessionData?.duration || 30,
            timezone: 'UTC',
            settings: {
                join_before_host: false,
                approval_type: 0,
            },
        };

        const zoomRes = await fetch('https://api.zoom.us/v2/users/me/meetings', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(meetingPayload),
        });

        if (!zoomRes.ok) {
            const errText = await zoomRes.text();
            console.log('zoomapi error')
            return NextResponse.json({ error: 'Zoom API error', details: errText }, { status: 500 });

        }

        const zoomData = await zoomRes.json();
        await sessionRef.update({
            status: 'confirmed',
            zoom: {
                meetingId: zoomData.id,
                joinUrl: zoomData.join_url,
                startUrl: zoomData.start_url,
            },
            hasJoined:false
        });

        await adminDb.collection('notifications')
            .doc(menteeId)
            .collection('items')
            .add({
                type: 'session_confirmed',
                message: 'Your session has been confirmed!',
                timestamp: Date.now(),
                sessionId,
                fromUserId: userId,
                seen:false
            })


        return NextResponse.json({ message: 'Session confirmed', zoomData }, { status: 200 });

    } catch (error) {
        console.log('couldnt confirm', error)
        return NextResponse.json({ error: 'failed to confirm' }, { status: 500 })
    }

}

///patch 

export async function PATCH(req: NextRequest, { params }: { params: { sessionId: string } }) {

    const { userId } = await auth();
    try {

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { sessionId } = params;
        const body = await req.json();
        const action = body.action;
        console.log('cancel session')

        if (!action) {
            return NextResponse.json({ error: 'Action is required' }, { status: 400 });
        }
        if (action === 'cancel') {

            const sessionRef = adminDb.collection('sessions').doc(sessionId);
            const sessionSnap = await sessionRef.get();

            if (!sessionSnap.exists) {
                return NextResponse.json({ error: 'Session not found' }, { status: 404 });
            }
            const session = sessionSnap.data();

            // Optional: Only mentor or mentee can cancel
            if (session?.mentorId !== userId && session?.menteeId !== userId) {
                return NextResponse.json({ error: 'Not authorized to cancel this session' }, { status: 403 });
            }

            if (session.status === 'cancelled' || session.status === 'completed') {
                return NextResponse.json({ error: 'Cannot cancel this session' }, { status: 400 });
            }

            // Cancel Zoom meeting if exists
            if (session.zoom.meetingId) {
                try {
                    await deleteZoomMeeting(session.zoom.meetingId);
                } catch (err) {
                    console.error("Zoom meeting deletion failed:", err);
                }
            }

            await sessionRef.update({
                status: 'cancelled',

            });

            //let other user know session got canceled
            const otherUserId = userId === session.mentorId ? session.menteeId : session.mentorId;
            await adminDb
                .collection('notifications')
                .doc(otherUserId)
                .collection('items')
                .add({
                    type: 'session_cancelled',
                    fromUserId: userId,
                    sessionId,
                    timestamp: Date.now(),
                    message: 'A session you were scheduled for was cancelled.',
                    seen:false
                });






            return NextResponse.json({ message: 'Session cancelled' }, { status: 200 });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error('Error cancelling session:', error);
        return NextResponse.json({ error: 'Failed to cancel session' }, { status: 500 });
    }
}

//delete a session
export async function DELETE(req: Request, { params }: { params: { sessionId: string } }) {
  const { userId } =await  auth();
  let id = await params.sessionId;
  console.log('delete sesion api')
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });
  

  const sessionRef = adminDb.collection("sessions").doc(id);
  const sessionSnap = await sessionRef.get();

  if (!sessionSnap.exists) return new Response("Not found", { status: 404 });

  const sessionData = sessionSnap.data() as Session;

  if (sessionData.mentorId !== userId && sessionData.menteeId !== userId) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // Cancel Zoom meeting first
  if (sessionData.zoom?.meetingId) {
    try {
      await deleteZoomMeeting(sessionData.zoom.meetingId);
    } catch (err) {
      console.error("Zoom meeting deletion failed:", err);
    }
  }

   
     await sessionRef.delete();
    return new NextResponse("Session deleted", { status: 200 });
}
