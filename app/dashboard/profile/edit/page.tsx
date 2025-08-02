"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import ProfileForm from "@/components/ProfileForm";
import Loading from "@/components/Loading";
import { toast } from "react-toastify";
import { Profile } from "@/types/type";

const Page = () => {

    //consts
    const { user, isLoaded }: { user: any; isLoaded: boolean } = useUser();
    const [profile, setProfile] = useState<Profile>();
  

    //get profile if exists
    useEffect(() => {

        if (!isLoaded || !user) return;


        const fetchProfile = async () => {
            try {
                const res = await fetch("/api/profile");
               

                if (!res.ok) {

                    console.error("Error fetching profile");
                    return setProfile(getEmptyProfile(user.id, user.imageUrl));
                }

                const data = await res.json();

                // if data is null or doesn't exist, use empty

                if (!data || Object.keys(data).length === 0) {

                    setProfile(getEmptyProfile(user.id, user.imageUrl));

                } else {
                    
                   if(data.userId === user?.id)
                    setProfile({ ...data });
                }

            } catch (error) {
                console.error("Error parsing profile", error);
                setProfile(getEmptyProfile(user.id, user.imageUrl));
            }



            
        }
        fetchProfile();

    }, [isLoaded,user]);

    if (!user || !profile) return <Loading show />;

    return <ProfileForm profile={profile} />;
};

export default Page;

function getEmptyProfile(userId: string, avatarUrl: string): Profile {
    return {
        userId,
        email: '',
        skills: [],
        skillsNeed: [],
        field: 'Technology',
        bio: '',
        avatar: avatarUrl || "/fallbackuser.png",
        availability: [],
        createdAt: new Date(),
        name: '',
        isMentor: false,
    };
}
