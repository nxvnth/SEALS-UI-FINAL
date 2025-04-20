'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import SearchBar from './components/video/SearchBar';
import VideoGrid from './components/video/VideoGrid';

export default function Home() {
  const { data: session, status } = useSession();
  const [searchString, setSearchString] = useState('');
  
  const handleSearch = (query: string) => {
    setSearchString(query);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">SEALS</h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Discover insights like never before! Search for videos, unlock detailed analyses, and explore smarter ways to understand your content.
        </p>
      </div>
      
      <div className="py-6">
        <SearchBar onSearch={handleSearch} />
      </div>
      
      {searchString && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Results for "{searchString}"</h2>
          <VideoGrid searchString={searchString} />
        </div>
      )}
      
      {!searchString && (
        <div className="text-center text-gray-400 py-12">
          Enter a search term to find and analyze videos
        </div>
      )}
    </div>
  );
}
