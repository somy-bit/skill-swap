'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const ToggleDarkMode: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // On mount, load theme from localStorage or system preference
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);

  const toggleDarkMode = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);

    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-105 transition-transform"
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? (
        <Sun className="text-yellow-400" size={20} />
      ) : (
        <Moon className="text-indigo-900" size={20} />
      )}
    </button>
  );
};

export default ToggleDarkMode;
