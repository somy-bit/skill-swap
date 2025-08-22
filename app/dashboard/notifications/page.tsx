'use client'

import React, { useEffect, useState } from 'react'

import { Notification } from '../../../types/type' // adjust path as needed
import NotifCard from '@/components/NotifCard'
import { useUser } from '@clerk/nextjs'



const NotificationsPage: React.FC = () => {

   const { user } = useUser()

   const userId = user?.id
 
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch notifications
  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch(`/api/notifications/${userId}/items`)
        if (!(res.status === 200)) {
          throw new Error('Failed to fetch notifications')
        }
        const data = await res.json()
        // assuming API returns array of Notification objects
        setNotifications(data)
      } catch (error) {
        console.error('Error fetching notifications', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [userId])

  // Mark as read (when click)
  const handleClick = async (notif: Notification) => {
    try {
      if (!notif.seen) {
        await fetch(`/api/notifications/${userId}/items`, {
          method:"PATCH",
          body: JSON.stringify({
            seen: true,
            notificationId: notif.id,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
        // Update locally
        setNotifications((prev) =>
          prev.map((n) => (n === notif ? { ...n, seen: true } : n))
        )
      }

      // If notification has linkTo, navigate to it
      if (notif.linkTo) {
        window.location.href = notif.linkTo
      }
    } catch (error) {
      console.error('Error marking notification as read', error)
    }
  }

   if (!userId) {
    return <p>Please log in to see notifications</p>
  }
  if (loading) return <p>Loading notifications...</p>
  if (!notifications.length) return <p>No unread notifications</p>

  return (
    <div className="flex flex-col space-y-2 p-4">
      {notifications.map((notif, index) => (
        <div
          key={index}
          onClick={() => handleClick(notif)}
          className="cursor-pointer"
        >
          <NotifCard notification={notif} />
        </div>
      ))}
    </div>
  )
}

export default NotificationsPage
