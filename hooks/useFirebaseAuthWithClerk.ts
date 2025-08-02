import { useEffect } from 'react';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { auth as firebaseAuth } from '@/lib/firebase'; // client firebase instance

export function useFirebaseAuthWithClerk() {
  useEffect(() => {
    async function signInToFirebase() {
      const res = await fetch('/api/firebase/token');
      const { token } = await res.json();
      if (token) {
        const auth = getAuth();
        await signInWithCustomToken(auth, token);
      }
    }

    signInToFirebase();
  }, []);
}
