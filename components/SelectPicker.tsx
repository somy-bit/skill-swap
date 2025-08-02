'use client';
import React, { useState } from 'react';

interface SelectPickerProps {
  options: string[];
  onChange?: (value: string) => void;
  label:string;
}

export default function SelectPicker({ options, onChange ,label}: SelectPickerProps) {
  const [selected, setSelected] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelected(e.target.value);
    onChange?.(e.target.value);
  };

  return (
    <div className="flex w-full dark:text-gray-900 flex-col items-start gap-2">
      <label className="text-md  font-medium">{label}</label>
      <select
        value={selected}
        onChange={handleChange}
        className="bg-white shadow-lg w-full p-2 focus:outline-none focus:shadow-xl rounded px-3 py-2 text-sm"
      >
        <option value="" disabled>
          Select an option
        </option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
