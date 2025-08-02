// components/CalendarCell.tsx
import React from "react";
import clsx from "clsx";

interface CalendarCellProps {
  date: Date;
  isSelected: boolean;
  isDisabled: boolean;
  onClick: (date: Date) => void;
}

export default function CalendarCell({ date, isSelected, isDisabled, onClick }: CalendarCellProps) {
  const day = date.getDate();

  return (
    <button
      disabled={isDisabled}
      onClick={() => onClick(date)}
      className={clsx(
        "w-10 h-10 flex items-center justify-center rounded-md text-sm font-medium",
        isDisabled && "text-gray-400 cursor-not-allowed",
        isSelected && "bg-indigo-500 text-white scale-105 transform transition-all duration-100",
        !isSelected && !isDisabled && "hover:bg-indigo-300 text-black bg-indigo-200  dark:hover:bg-blue-500"
      )}
    >
      {day}
    </button>
  );
}
