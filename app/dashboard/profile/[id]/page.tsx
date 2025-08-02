
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import ProfileCard from "@/components/ProfileCard";
import { notFound, redirect } from "next/navigation";
import { Profile } from "@/types/type";

type Props = {
  params: {
    id: string;
  };
};

export default async function Page({params}: Props) {

  const {id} =await  params;
  const user = await currentUser();
  const snapShot = await getDoc(doc(db, "profiles", id));

  if (!snapShot.exists()) {
    if (user?.id === id) {
      redirect("/dashboard/profile/edit");
    } else {
      notFound();
    }
  }

  const profile = snapShot.data() as Profile;
  const canEdit = user?.id === profile.userId;

  return <ProfileCard profile={profile} canEdit={canEdit} />;
}
