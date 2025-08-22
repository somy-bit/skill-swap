'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SessionWithProfile } from '@/types/type';
import Link from 'next/link';



export default function SessionCard({ sessions, isMentor, handleDeleteSession, handleConfirm, handleCancel, sendMessage }:
  {
    sessions: SessionWithProfile, isMentor: boolean, handleConfirm: (id: string, menteeId: string) => void
    , handleDeleteSession: (id: string) => void
    , handleCancel: (id: string) => void, sendMessage: (id: string) => void
  }) {


  const joinSesstion = async (id: string, zoomUrl: string | undefined) => {

    window.open(zoomUrl, "_blank");

    try {
      const res = await fetch(`/api/sessions/${id}/join`, { method: "POST" });
      if (!res.ok) {
        console.error("Failed to mark session as joined");
      }
    } catch (error) {
      console.error("Error marking session as joined", error);
    }

  }


  return (
    <div className="w-full max-w-md h-full min-h-[400px] mx-auto flex flex-col shadow-xl border border-gray-200 dark:border-black p-4 rounded-lg ">
      <Link href={`/dashboard/sessions/${sessions.id}`} className="text-xl font-bold mb-6">Manage This Session</Link>

      <Card className="mb-6">
        <CardContent className="p-4 space-y-2">
          <p><strong>Date:</strong> {sessions.date}</p>
          <p><strong>Mentoring :</strong> {sessions.skill}</p>

          <p><strong>Time:</strong> {sessions.startTime} - {sessions.endTime}</p>
          <p>
            <strong>Status:</strong>{' '}
            <span
              className={`capitalize ${sessions.status === 'pending' ? 'text-blue-600' :
                sessions.status === 'completed' ? 'text-green-600' :
                  'text-red-600'
                }`}
            >
              {sessions.status}
            </span>
          </p>

          {sessions.status === 'confirmed' && (
            <p>
              <strong>Meeting:</strong>{' '}
              <button
                onClick={() => joinSesstion(sessions.id, isMentor ? sessions.zoom?.startUrl : sessions.zoom?.joinUrl)}>

                Join sessions
              </button>
            </p>
          )}
          {sessions.message && (
            <div>
              <strong>Notes:</strong>
              <p className="text-sm text-gray-600 mt-1">{sessions.message}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid  grid-cols-1 gap-4 mb-6">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <img
              src={isMentor ? sessions.menteeProfile?.avatar ? sessions.menteeProfile?.avatar : '/fallbackuser.png'
                : sessions.mentorProfile?.avatar ? sessions.mentorProfile?.avatar : '/fallbackuser.png'}
              alt='user'
              className="w-12 h-12 rounded-full object-cover"
            />

            <div>
              <p className="font-semibold"></p>
              <p className="text-sm text-gray-500">{isMentor ? sessions.menteeProfile?.name ? sessions.menteeProfile?.name : 'no name provided'
                : sessions.mentorProfile?.name ? sessions.mentorProfile?.name : 'no name provided'}</p>
            </div>
          </CardContent>
        </Card>

        {/* mentees or metors skills to offer */}

        <Card>
          <CardContent className="flex items-center gap-4 p-4">

            <div>
              <p className="font-semibold">Skills</p>
              <ul className="text-sm text-gray-500 flex flex-wrap gap-3">
                {isMentor ? sessions.menteeProfile?.skills?.map(((skill, index) => (
                  <li
                    className='p-1 bg-white shadow-sm font-semibold rounded'
                    key={index}>
                    {skill}
                  </li>
                )))
                  :
                  sessions.mentorProfile?.skills?.map(((skill, index) => (
                    <li className='p-1 bg-white shadow-sm font-semibold rounded'
                      key={index}>{skill}</li>
                  )))
                }

              </ul>
            </div>
          </CardContent>
        </Card>


      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {sessions.status === 'confirmed' && (
          <Button
            className='cursor-pointer'
            onClick={() => joinSesstion(sessions.id, isMentor ? sessions.zoom?.startUrl : sessions.zoom?.joinUrl)}>

            Join Session

          </Button>
        )}
        {sessions.status === 'cancelled' && (
          <Button
            className='cursor-pointer'
            onClick={() => handleDeleteSession(sessions.id)}
          >

            Delete Session

          </Button>
        )}
        {(isMentor && sessions.status === 'pending') &&
          <Button
            onClick={() => handleConfirm(sessions.id, sessions.menteeId)}
            className='bg-indigo-700 text-white cursor-pointer hover:bg-indigo-400 transition-all duration-150 ease-in-out'>Confirm</Button>

        }
        <Button
          onClick={() => handleCancel(sessions.id)}
          className='cursor-pointer hover:bg-red-400 transition duration-150 ease-in-out' variant="destructive">Cancel</Button>
        <Button
          onClick={() => sendMessage(sessions.id)}
          className='cursor-pointer hover:border-2 hover:border-indigo-900' variant="secondary">Message</Button>
      </div>
    </div>
  );
}
