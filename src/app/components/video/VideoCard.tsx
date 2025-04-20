'use client';

import React from 'react';
import Image from 'next/image';

interface VideoCardProps {
  videoId: string;
  title: string;
  score?: number;
  isProcessing?: boolean;
  onSelect: (videoId: string) => void;
  onWatch?: (videoId: string, title: string) => void; // ✅ ADD THIS LINE
}



export default function VideoCard({ videoId, title, score, isProcessing = false, onSelect, onWatch }: VideoCardProps) {
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

  return (
    <div 
      className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 relative"
      role="button"
      aria-label={`Select video titled ${title}`}
    >
      <div className="relative" onClick={() => onSelect(videoId)}>
        <Image 
          src={thumbnailUrl} 
          alt={title}
          width={320}
          height={180}
          layout="responsive"
          objectFit="cover"
        />

        {score !== undefined && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded-md">
            <span className="font-bold">{score.toFixed(1)}</span>
          </div>
        )}

        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
      </div>
      
      <div className="p-4 space-y-2">
        <h3 className="text-white font-medium text-lg line-clamp-2">{title}</h3>

        {/* Open in YouTube Button */}
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 text-blue-400 hover:underline text-sm"
          onClick={() => onWatch?.(videoId, title)} // record view
        >
          Open in YouTube →
        </a>

      </div>
    </div>
  );
}
