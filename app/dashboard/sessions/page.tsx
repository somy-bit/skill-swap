'use client';

import SessionCard from '@/components/SessionCard';
import { SessionWithProfile } from '@/types/type';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'react-toastify';


export default function SessionListClient() {

  const [mentorSessions, setMentorSessions] = useState([]);
  const [menteeSessions, setMenteeSessions] = useState([]);



  const { user } = useUser();

  useEffect(() => {
    const load = async () => {
      if (!user) return;

      const res = await fetch('/api/sessions');
      const data = await res.json();
      let sessions = data.sessions;

      const mentorSessions = sessions.filter((item: SessionWithProfile) => item.mentorId === user.id)
      const menteeSessions = sessions.filter((item: SessionWithProfile) => item.menteeId === user.id)

      setMenteeSessions(menteeSessions);
      setMentorSessions(mentorSessions);

      console.log('sessions', sessions)
    };
    load();
  }, []);

  const confirmSession = async (sessionId: string,menteeId:string) => {

    const res = await fetch(`/api/sessions/${sessionId}`,{
      method:'post',
      body:JSON.stringify({
        menteeId:menteeId
      })
    });
    let data = await res.json();


  if (res.status === 401 && data.error === 'zoom_auth_required') {
    alert('zoom auth')
    // Zoom tokens missing or expired — redirect to Zoom OAuth connect page
    window.location.href = data.zoomAuthUrl;
    return;
  }

    toast.done(data.message)

  }

  const cancelSession = async (id: string) => {
    const res = await fetch(`/api/sessions/${id}?action=cancel`);
    let message = await res.json();
    if (message.message) {
      toast.done(message.message)
    } else if (message.error) {
      toast.error(message.error)
    }


  }

  const goToMessages = () => {

  }

  return (
    <div className='flex flex-col px-4 py-20 items-center justify-center'>
      {/* sessions for mentor role */}
      <h1 className='text-xl font-semibold w-full text-left pl-4 text-indigo-900 dark:text-indigo-100'>My Session As Mentor :</h1>
      <div className='grid grid-cols-1 py-20 lg:grid-cols-2 xl:grid-cols-3 w-full max-w-5xl  gap-2 min-h-screen justify-center items-center'>

        {mentorSessions.length === 0 ? (
          <p>No sessions found</p>
        ) : (
          mentorSessions.map((s: SessionWithProfile) =>
            <SessionCard
              key={s.id}
              isMentor={true}
              sessions={s}
              handleCancel={cancelSession}
              handleConfirm={confirmSession}
              sendMessage={goToMessages}
            />)
        )}

      </div>
      {/*session for mentee role */}
      <h1 className='text-xl  w-full text-left pl-4 font-semibold text-indigo-900 dark:text-indigo-100'>My Session As Mentee :</h1>
      <div className='grid grid-cols-1 py-20 lg:grid-cols-2 xl:grid-cols-3 w-full max-w-5xl  gap-2 min-h-screen justify-center items-center'>

        {menteeSessions.length === 0 ? (
          <p>No sessions found</p>
        ) : (
          menteeSessions.map((s: SessionWithProfile) =>
            <SessionCard
              key={s.id}
              isMentor={false}
              sessions={s}
              handleCancel={cancelSession}
              handleConfirm={confirmSession}
              sendMessage={goToMessages}
            />)
        )}

      </div>
    </div>
  );
}
