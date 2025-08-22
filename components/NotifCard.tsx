import React from 'react'
import { Notification } from '../types/type' // adjust path as needed
import { Timestamp } from 'firebase/firestore'
import Link from 'next/link'

type NotificationCardProps = {
    notification: Notification
}

const typeToTitle = {
    booking: 'New Booking',
    message: 'New Message',
    reminder: 'Reminder',
    session_confirmed: 'Session Confirmed',
    session_cancelled: 'Session Cancelled',
    session_completed: 'Session Completed',
}

const NotifCard: React.FC<NotificationCardProps> = ({ notification }) => {
    const { type, message, timestamp, linkTo, seen } = notification

    // Format timestamp (if using Firestore Timestamp)
    const dateStr =
        timestamp instanceof Timestamp
            ? timestamp.toDate().toLocaleString()
            : new Date(
                typeof timestamp === 'number' || typeof timestamp === 'string'
                    ? timestamp
                    : ''
            ).toLocaleString()

    const cardContent = (
        <div className={`flex items-center space-x-4 bg-white shadow-md rounded-lg p-4 w-full max-w-md transition-shadow duration-300 ${seen ? '' : 'ring-2 ring-blue-400'}`}>
            {/* Optional icon based on type */}
            <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                {type.charAt(0).toUpperCase()}
            </div>

            {/* Content */}
            <div className="flex flex-col">
                <h3 className="text-sm font-semibold text-gray-800">{typeToTitle[type]}</h3>
                <p className="text-xs text-gray-600">{message}</p>
                <span className="text-[10px] text-gray-400">{dateStr}</span>
            </div>
        </div>
    )

    // Wrap in link if `linkTo` exists
    return linkTo ? <Link href={linkTo}>{cardContent}</Link> : cardContent
}

export default NotifCard
