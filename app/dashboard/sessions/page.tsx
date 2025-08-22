'use client';

import SessionCard from '@/components/SessionCard';
import { SessionWithProfile } from '@/types/type';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'react-toastify';


export default function SessionListClient() {

  const [mentorSessions, setMentorSessions] = useState([]);
  const [menteeSessions, setMenteeSessions] = useState([]);
  const [archiveSessions, setArchiveSessions] = useState([]);
  const [reload,setRelaod] = useState(1)

  const [activeTab, setActiveTab] = useState<'mentor' | 'mentee' | 'archive'>('mentor');




  const { user } = useUser();

  useEffect(() => {
    const load = async () => {
      if (!user) return;

      const res = await fetch('/api/sessions');
      const data = await res.json();
      let sessions = data.sessions;

      const mentorSessions = sessions.filter((item: SessionWithProfile) => item.mentorId === user.id)
      const menteeSessions = sessions.filter((item: SessionWithProfile) => item.menteeId === user.id)
      const archiveSessions = sessions.filter(
        (session: SessionWithProfile) =>
          (session.mentorId === user.id || session.menteeId === user.id) &&
          (session.status === 'cancelled' || session.status === 'completed')
      );


      setMenteeSessions(menteeSessions);
      setMentorSessions(mentorSessions);
      setArchiveSessions(archiveSessions);

      console.log('sessions', sessions)
    };
    load();
  }, [reload]);

  const confirmSession = async (sessionId: string, menteeId: string) => {

    const res = await fetch(`/api/sessions/${sessionId}`, {
      method: 'post',
      body: JSON.stringify({
        menteeId: menteeId
      })
    });
    let data = await res.json();


    if (res.status === 401 && data.error === 'zoom_auth_required') {

      // Zoom tokens missing or expired — redirect to Zoom OAuth connect page
      window.location.href = data.zoomAuthUrl;
      return;
    }

    setRelaod(pre=>pre+1)

    toast.done(data.message)

  }

  const cancelSession = async (sessionId: string) => {

    const res = await fetch(`/api/sessions/${sessionId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'cancel'
      }),

    });
    let message = await res.json();
    if (message.message) {
      toast.done(message.message)
    } else if (message.error) {
      toast.error(message.error)
    }

    setRelaod(pre=>pre+1)

  }

  const deleteSession = async (sessionId: string) => {

    console.log("deleteing sesstion start")

    const res = await fetch(`/api/sessions/${sessionId}`, { method: "DELETE" });

    switch (res.status) {

      case 404:
        toast.error("Session Not Found!");
        break;
      case 401:
        toast.error("Unauthorized to delete!");
        break;
      case 403:
        toast.error("You are not allowed to delete this session");
        break;
      case 200:
        toast.done("Successfully deleted the session")
        break;
    }

    setRelaod(pre=>pre+1)


  }

  const goToMessages = () => {

  }

  return (
    <div className='flex flex-col px-4 py-20 items-center justify-center'>
      {/* sessions for mentor role */}
      <div className="tabs flex justify-center gap-4 mb-8">
        <button
          className={`px-4 py-2 rounded ${activeTab === 'mentor' ? 'bg-indigo-600 text-gray-100' : 'bg-gray-200 text-black'
            }`}
          onClick={() => setActiveTab('mentor')}
        >
          Sessions as Mentor
        </button>

        <button
          className={`px-4 py-2 rounded ${activeTab === 'mentee' ? 'bg-indigo-600 text-gray-100' : 'bg-gray-200 text-black'
            }`}
          onClick={() => setActiveTab('mentee')}
        >
          Sessions as Mentee
        </button>

        <button
          className={`px-4 py-2 rounded ${activeTab === 'archive' ? 'bg-indigo-600 text-gray-100' : 'bg-gray-200 text-black'
            }`}
          onClick={() => setActiveTab('archive')}
        >
          Archive
        </button>
      </div>

      <div className='grid grid-cols-1 py-20 lg:grid-cols-2 xl:grid-cols-2 w-full max-w-5xl  gap-2 min-h-screen justify-center mx-auto items-center'>
        {activeTab === "mentor" && (
          mentorSessions.length === 0 ? (
            <p>No sessions found</p>
          ) : (
            mentorSessions.map((s: SessionWithProfile) =>
              <SessionCard
                key={s.id}
                handleDeleteSession={deleteSession}
                isMentor={true}
                sessions={s}
                handleCancel={cancelSession}
                handleConfirm={confirmSession}
                sendMessage={goToMessages}
              />)
          ))}

        {activeTab === "mentee" && (
          menteeSessions.length === 0 ? (
            <p>No session found</p>
          ) : (
            menteeSessions.map((s: SessionWithProfile) =>
              <SessionCard
                key={s.id}
                isMentor={false}
                handleDeleteSession={deleteSession}
                sessions={s}
                handleCancel={cancelSession}
                handleConfirm={confirmSession}
                sendMessage={goToMessages}
              />
            )
          ))}

        {activeTab === 'archive' && (
          archiveSessions.length === 0 ? (
            <p>No sessions found</p>
          ) : (
            archiveSessions.map((s: SessionWithProfile) =>
              <SessionCard
                key={s.id}
                isMentor={s.mentorId === user?.id}
                handleDeleteSession={deleteSession}
                sessions={s}
                handleCancel={cancelSession}
                handleConfirm={confirmSession}
                sendMessage={goToMessages}
              />)
          )
        )}

      </div>
     
    </div>
  );
}
