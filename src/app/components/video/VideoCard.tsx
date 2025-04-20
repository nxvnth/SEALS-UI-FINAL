'use client'; // Ensures this component is only used on the client side.

import React from 'react';
import Image from 'next/image';

interface VideoCardProps {
  videoId: string;
  title: string;
  score?: number;
  isProcessing?: boolean;
  onSelect: (videoId: string) => void; // Function to handle video selection.
}

export default function VideoCard({ videoId, title, score, isProcessing = false, onSelect }: VideoCardProps) {
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

  return (
    <div 
      className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer relative"
      onClick={() => onSelect(videoId)}
      role="button"  // Accessibility improvement: Makes it clear this is an interactive element.
      aria-label={`Select video titled ${title}`}
    >
      <div className="relative">
        <Image 
          src={thumbnailUrl} 
          alt={title}
          width={320}
          height={180}
          layout="responsive"  // Ensures image scales correctly within the container.
          objectFit="cover"    // Ensures the aspect ratio is maintained while covering the entire content box.
        />

        {/* Score display, shown if score is defined */}
        {score !== undefined && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded-md">
            <span className="font-bold">{score.toFixed(1)}</span>
          </div>
        )}

        {/* Processing indicator, shown if the video is being processed */}
        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-white font-medium text-lg line-clamp-2">{title}</h3>
      </div>
    </div>
  );
}
