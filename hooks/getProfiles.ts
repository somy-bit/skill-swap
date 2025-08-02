'use client'

import { useEffect, useState, useRef } from 'react'
import {
  collection,
  getDocs,
  orderBy,
  limit,
  query,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
  where,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Profile } from '@/types/type'
import { useUser } from '@clerk/nextjs'

const PROFILES_PER_PAGE = 9

export function useProfile(filter: string) {

  const [profiles, setProfiles] = useState<Profile[]>([])
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([])
  const [loadingProf, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const{user} = useUser();

  const pagesLoaded = useRef(0)
  const lastVisible = useRef<QueryDocumentSnapshot<DocumentData> | null>(null)

  const loadProfiles = async () => {
    if (loadingProf || !hasMore) return
    try{
    setLoading(true)

    const q = query(
      collection(db, 'profiles'), // changed from 'users' to 'profiles'
      orderBy('createdAt', 'desc'),
      limit(PROFILES_PER_PAGE),
      where('userId', '!=', user?.id),
      ...(lastVisible.current ? [startAfter(lastVisible.current)] : [])
    )

    const snap = await getDocs(q)
    if (snap.empty) {

      setHasMore(false)

    } else {

      const newBatch = snap.docs.map(d => ({ ...d.data() } as Profile))

      setProfiles(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const filtered = newBatch.filter(p => !existingIds.has(p.id));
        return [...prev, ...filtered];
      });

      lastVisible.current = snap.docs[snap.docs.length - 1]
      pagesLoaded.current += 1
      if (snap.docs.length < PROFILES_PER_PAGE) setHasMore(false)
    }
    }catch(error){
      console.log(error)

    }finally{

    setLoading(false)
    }
  }

  useEffect(() => {
    loadProfiles()
  }, [])

  useEffect(() => {
    if (!filter.trim()) {
      setFilteredProfiles(profiles)
    } else {
      const lower = filter.toLowerCase()
      setFilteredProfiles(
        profiles.filter(profile =>
          profile.skills?.some(skill => skill.toLowerCase().includes(lower))
        )
      )
    }
  }, [filter, profiles])

  useEffect(() => {
    const expectedCount = pagesLoaded.current * PROFILES_PER_PAGE
    if (
      filteredProfiles.length < expectedCount &&
      hasMore &&
      !loadingProf
    ) {
      loadProfiles()
    }
  }, [filteredProfiles, hasMore, loadingProf])

  return {
    profiles: filteredProfiles,
    loadProfiles,
    loadingProf,
    hasMore,
  }
}
