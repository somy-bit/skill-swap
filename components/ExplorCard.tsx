"use client";

import Link from "next/link";
import React from "react";

interface ExploreCardProps {
  name: string;
  avatar: string;
  role: "mentor" | "mentee";
  bio: string;
  skills: string[];
  id: string;

}

const ExploreCard: React.FC<ExploreCardProps> = ({
  name,
  avatar,
  role,
  bio,
  skills,
  id,

}) => {
  return (
    <div className="md:rounded-md mx-auto h-[450px] w-full pb-4
        overflow-hidden shadow-md border dark:border-gray-900 border-indigo-100 bg-white dark:bg-gray-700 hover:shadow-lg transition">
      <div className="flex flex-col space-y-2 items-center ">
        <div className="flex w-full flex-row items-center justify-between px-2 pt-1">
          <Link href={`/dashboard/profile/${id}`} className="text-xs dark:text-gray-100 text-gray-500  cursor-pointer">
            Profile
          </Link>

        </div>


        <div className="px-8 flex flex-col space-y-2 items-center">
          <img
            src={avatar}
            alt={name}
            className="rounded-full  w-[200px] h-[200px]  object-cover border-2 dark:border-gray-700 border-gray-100"
          />
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-semibold dark:text-white text-gray-800">{name}</h2>
            <p className="text-sm text-center text-teal-600 dark:text-teal-300 capitalize">{role}</p>
          </div>
        </div>

        <div className="px-4  flex-1  text-xs dark:text-gray-100 line-clamp-1 text-center text-gray-500">{bio.substring(0, 30)}</div>

        <div className="px-4 pb-4  text-xs text-gray-800 dark:text-white font-medium">
          {skills.map((skill, i) => (
            <span key={i} className="inline-block mr-2 p-2 hover:shadow-lg rounded border dark:border-gray-600 border-gray-50 shadow-md">
              #{skill}
            </span>
          ))}
        </div>

        <div className="px-10 w-full">
          <Link href={{pathname:`/dashboard/schedule/${id}`,query:{name,avatar,role,bio,skills,id}}}
          >
            <button
            className="w-full py-3 dark:bg-gray-300 dark:text-gray-900 bg-gradient-to-br from-indigo-800  to-indigo-500 hover:from-indigo-400 hover:to-indigo-900  text-white text-sm cursor-pointer rounded-lg transition"

            >
              Book A Session
            </button>

          </Link>
        </div>
      </div>

    </div>
  );
};

export default ExploreCard;
