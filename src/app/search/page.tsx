'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchBar from '../components/video/SearchBar';
import VideoGrid from '../components/video/VideoGrid';

// Create a separate component that uses useSearchParams
function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchString, setSearchString] = useState(initialQuery);
  
  const handleSearch = (query: string) => {
    setSearchString(query);
  };

  return (
    <div className="space-y-8">
      <div className="py-4">
        <SearchBar onSearch={handleSearch} />
      </div>
      
      {searchString && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Results for &quot;{searchString}&quot;</h2>
            <div className="flex items-center space-x-4">
              <select 
                className="bg-gray-700 text-white px-3 py-2 rounded-md text-sm"
                defaultValue="relevance"
              >
                <option value="relevance">Sort by: Relevance</option>
                <option value="score">Sort by: Score (High to Low)</option>
                <option value="date">Sort by: Date (Newest)</option>
              </select>
            </div>
          </div>
          
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

// Main page component with Suspense boundary
export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
