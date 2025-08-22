//make sure to secure routes by getting user from getAuth() and check session token ..
import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebaseAdmin'



export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = params

  try {
    const snapshot = await adminDb
      .collection('notifications')
      .doc(userId)
      .collection('items')
      .where('seen', '==', false)
      .orderBy('timestamp', 'desc')
      .get()

    const notifications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json(notifications, { status: 200 })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { userId } = params

  try {
    const body = await req.json()
    const { notificationId } = body // send notificationId in body to mark specific notif

    if (!notificationId) {
      return NextResponse.json({ error: 'notificationId is required' }, { status: 400 })
    }

    const notifRef = adminDb
      .collection('notifications')
      .doc(userId)
      .collection('items')
      .doc(notificationId)

    await notifRef.update({ seen: true })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 })
  }
}
