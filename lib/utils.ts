import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


//get user from firestore by id


export async function getUserFromFirestore(userId: string) {

  const docRef = doc(db, "profiles", userId);
  const snap = await getDoc(docRef);

  return snap.exists() ? snap.data() : null;
}


export const isEndTimeAfterStart = (startTime: string, endTime: string): boolean => {

  const toMinute = (timeStr: string): number => {

    if (timeStr.endsWith('m') || timeStr.endsWith('M')) {

      const [time, modifier] = timeStr.trim().split(' ');
      let [hours, minute] = time.split(':').map(Number);

      if (modifier && modifier.toLowerCase() === 'pm' && hours !== 12) {
        hours += 12;
      }

      if (modifier && modifier.toLowerCase() === 'am' && hours === 12) {
        hours = 0;
      }
      return hours * 60 + minute;
    } else {

      let [hours, minute] = timeStr.trim().split(':').map(Number);
      return hours * 60 + minute;
    }
  }



  return toMinute(startTime) < toMinute(endTime)

}



export const listenToNotifications =(userId: string, callback: (notifs: any[]) => void) =>{
  const q = query(
    collection(db, `notifications/${userId}/items`),
    orderBy('timestamp', 'desc') // optional, to show latest first
  );

  const unsubscribe = onSnapshot(q, snapshot => {
    const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(notifs);
  });

  return unsubscribe;
}
