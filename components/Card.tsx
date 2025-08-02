"use client";

import React from "react";

interface ExploreCardProps {
  name: string;
  avatar: string;
  role: "mentor" | "mentee";
  bio: string;
  skills: string[];
  onViewProfile?: () => void;
}

const ExploreCard: React.FC<ExploreCardProps> = ({
  name,
  avatar,
  role,
  bio,
  skills,
  onViewProfile,
}) => {
  return (
    <div className="md:rounded-md overflow-hidden shadow-md border dark:border-gray-900 border-indigo-100 bg-white dark:bg-gray-700 hover:shadow-lg transition">
      <div className="p-8 flex items-center gap-4">
        <img
          src={avatar}
          alt={name}
          className="w-14 h-14 rounded-full object-cover border-2 dark:border-gray-600 border-indigo-700"
        />
        <div>
          <h2 className="text-lg font-semibold dark:text-white text-indigo-800">{name}</h2>
          <p className="text-sm text-indigo-800 dark:text-gray-100 capitalize">{role}</p>
        </div>
      </div>

      <div className="px-4 pb-4 text-sm dark:text-gray-100 text-gray-700">{bio}</div>

      <div className="px-4 pb-4 text-xs text-indigo-800 dark:text-white font-medium">
        {skills.map((skill, i) => (
          <span key={i} className="inline-block mr-2">
            #{skill}
          </span>
        ))}
      </div>

      <div className="px-4 pb-4">
        <button
          onClick={onViewProfile}
          className="w-full dark:bg-gray-300 dark:text-gray-900 bg-indigo-800 hover:bg-indigo-700 cursor-pointer text-white text-sm py-2 rounded-xl transition"
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

export default ExploreCard;
