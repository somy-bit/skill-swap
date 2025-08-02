
"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { storage } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import React from 'react'
import { Profile } from '@/types/type'
import Loading from "@/components/Loading";
import { toast } from "react-toastify";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";




function ProfileForm({ profile }: { profile: Profile }) {

    const { user } = useUser();
    const router = useRouter();


    const [role, setRole] = useState(profile?.isMentor ? "mentor" : "mentee");
    const [bio, setBio] = useState(profile.bio);
    const [skills, setSkills] = useState(profile.skills.join(','));
    const [skillsNeed, setSkillsNeed] = useState(profile.skillsNeed.join(','));

    const [loading, setLOading] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState(profile.avatar)



    //open and get file from image picker
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file)); // create preview URL
        }
    };

  

    //handle submit form save profile to db
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user?.id) return;

        try {
            setLOading(true);

            let avatarURL = profile.avatar;
            if (avatarFile) {
                const storageRef = ref(storage, `avatars/${user.id}/${avatarFile.name}`);
                await uploadBytes(storageRef, avatarFile);
                avatarURL = await getDownloadURL(storageRef);
            }

            const updateProfile: Profile = {
                name: user.fullName ?? '',
                email: user.emailAddresses[0]?.emailAddress ?? '',
                userId: user.id,
                avatar: avatarURL,
                bio,
                skills: skills.split(",").map(s => s.trim()),
                skillsNeed: skillsNeed.split(",").map(s => s.trim()),
                isMentor: role === "mentor",
                createdAt: new Date(),
                field: "Technology"
            };

            const res = await fetch("/api/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updateProfile),
            });

            if (!res.ok) throw new Error("Failed to save profile");

            toast.success("Profile saved!");
            router.push("/dashboard");
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            toast.error(msg);
        } finally {
            setLOading(false);
        }
    };



    return (
        <>
            <Loading show={loading} />

            <main className="max-w-xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-8">Welcome, {user?.firstName}!</h1>
                <form onSubmit={handleSubmit} className="space-y-8 flex flex-col">
                    <div className="flex flex-row items-center justify-between py-1 pr-12">
                        <label className="block px-3 py-1 bg-black/90 text-white hover:bg-gray-900 transition-all ease-in rounded ">
                            Change Photo
                            <input type="file" accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />

                        </label>
                        <Avatar className="w-16 h-16 shadow-lg object-cover">
                            <AvatarImage src={avatarPreview} alt='avatar' />
                            <AvatarFallback>user</AvatarFallback>
                        </Avatar>

                    </div>

                    <div>
                        <label className="block font-semibold">Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full border-2  p-2 border-indigo-400 rounded transition-all ease-in duration-150 focus:scale-105 
                            focus:shadow-lg focus:shadow-indigo-300 dark:focus:shadow-gray-500 dark:border-gray-400 focus:outline-none"
                        >
                            <option value="mentee">Mentee</option>
                            <option value="mentor">Mentor</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-semibold">Bio</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full border-2 p-2 border-indigo-400 dark:border-gray-400 focus:outline-none rounded focus:shadow-lg transition-all 
                            ease-in duration-150 focus:scale-105 focus:shadow-indigo-300 dark:focus:shadow-gray-500"
                            rows={3}

                        />
                    </div>

                    <div>
                        <label className="block font-semibold">Skills to offer(seperate with comma)</label>
                        <input
                            type="text"
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                            className="w-full border-2 p-2 border-indigo-400 dark:border-gray-400 rounded transition-all ease-in duration-150 focus:scale-105 focus:shadow-lg
                             focus:shadow-indigo-300 dark:focus:shadow-gray-500 dark:focus:outline-none focus:outline-indigo-300"
                            placeholder="e.g. React, Node.js, Design"

                        />
                    </div>

                    <div>
                        <label className="block font-semibold">Skills seeking(seperate with comma)</label>
                        <input
                            type="text"
                            value={skillsNeed}
                            onChange={(e) => setSkillsNeed(e.target.value)}
                            className="w-full border-2 p-2 border-indigo-400 dark:border-gray-400 rounded transition-all ease-in duration-150 focus:scale-105 focus:shadow-lg
                             focus:shadow-indigo-300 dark:focus:shadow-gray-500 dark:focus:outline-none focus:outline-indigo-300"
                            placeholder="e.g. React, Node.js, Design"
                        />
                    </div>
                 


                    <button
                        type="submit"
                        className="bg-black cursor-pointer dark:hover:shadow-indigo-100 dark:hover:shadow-md w-full text-white mt-10 py-2 px-4 rounded hover:bg-gray-800"
                    >
                        Save & Continue
                    </button>
                </form>
             
            </main>

                           
        </>


    )
}

export default ProfileForm