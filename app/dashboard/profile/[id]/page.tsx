'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProfileCard from '@/components/ProfileCard';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Profile } from '@/types/type';

export default function ProfilePageClient() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProfile = async () => {
      const snap = await getDoc(doc(db, 'profiles', id as string));
      if (snap.exists()) {
        setProfile(snap.data() as Profile);
      }
    };

    fetchProfile();
  }, [id]);

  if (!profile) return <p>Loading...</p>;

  return <ProfileCard profile={profile} canEdit={false} />;
}
