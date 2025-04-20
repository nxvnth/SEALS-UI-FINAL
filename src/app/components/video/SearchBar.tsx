'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  onSearch: (searchString: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchString, setSearchString] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchString.trim()) {
      onSearch(searchString);
      router.push(`/search?q=${encodeURIComponent(searchString)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
        <input
          type="text"
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          placeholder="Search for videos..."
          className="w-full px-4 py-3 text-gray-700 bg-gray-50 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
}
