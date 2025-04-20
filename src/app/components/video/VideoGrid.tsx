'use client';

import React, { useState, useEffect } from 'react';
import VideoCard from './VideoCard';
import apiService from '@/app/services/apiService';
import { getVideoScore, saveVideoScore, getVideosBySearchString } from '@/app/services/videoService';

interface VideoItem {
  id: string;
  title: string;
  score?: number;
  isProcessing: boolean;
}
// Add this interface to define the shape of videos returned from the API
interface ApiVideo {
  id: string;
  title: string;
  thumbnail: string;
  description?: string;
  channelTitle?: string;
  publishedAt?: string;
}

interface VideoGridProps {
  searchString: string;
}

export default function VideoGrid({ searchString }: VideoGridProps) {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      if (!searchString) {
        setVideos([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      console.log("Calling getVideosBySearchString with:", searchString);

      try {
        // Search for videos
        const searchResult = await apiService.searchVideos(searchString);
        
        if (!searchResult.success) {
          throw new Error('Failed to search videos');
        }
        // Ensure videos is always an array, even if the API returns null
        const videoResults = searchResult.videos || [];

        // Check if we have cached scores for these videos
        const cachedVideos = await getVideosBySearchString(searchString);
        
        // Map the search results to our video items format
        const videoItems: VideoItem[] = videoResults.map((video: ApiVideo) => {
          // Find if we have a cached score for this video
          const cachedVideo = cachedVideos.find(cv => cv.videoId === video.id);
          
          return {
            id: video.id,
            title: video.title,
            score: cachedVideo?.score,
            isProcessing: false
          };
        });

        setVideos(videoItems);
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('Failed to load videos. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [searchString]);

const handleVideoSelect = async (videoId: string) => {
  const videoIndex = videos.findIndex(v => v.id === videoId);
  if (videoIndex === -1) return;
  if (videos[videoIndex].score !== undefined) return;

  // Show processing state
  setVideos(prev => {
    const updated = [...prev];
    updated[videoIndex] = {
      id: String(prev[videoIndex].id),
      title: String(prev[videoIndex].title),
      score: prev[videoIndex].score,
      isProcessing: true,
    };
    return updated;
  });

  try {
    const cachedVideo = await getVideoScore(videoId, searchString);

    if (cachedVideo) {
      setVideos(prev => {
        const updated = [...prev];
        updated[videoIndex] = {
          id: String(prev[videoIndex].id),
          title: String(prev[videoIndex].title),
          score: cachedVideo.score,
          isProcessing: false,
        };
        return updated;
      });
      return;
    }

    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    console.log("Calculating score for", videoUrl);

    const result = await apiService.calculateVideoScore(videoUrl, searchString);
    const raw = result?.result?.toString().trim() ?? '';
    const parsed = parseFloat(raw);
    const isNumeric = !isNaN(parsed);

    if (result.success && isNumeric) {
      const roundedScore = Math.ceil(parsed);

      await saveVideoScore({
        videoId,
        title: String(videos[videoIndex].title),
        score: roundedScore,
        searchString,
        calculatedAt: new Date().toISOString()
      });

      setVideos(prev => {
        const updated = [...prev];
        updated[videoIndex] = {
          id: String(prev[videoIndex].id),
          title: String(prev[videoIndex].title),
          score: roundedScore,
          isProcessing: false,
        };
        return updated;
      });

    } else {
      console.error('Score failed or returned invalid:', raw);
      alert(`Score calculation failed: ${raw}`);

      setVideos(prev => {
        const updated = [...prev];
        updated[videoIndex] = {
          id: String(prev[videoIndex].id),
          title: String(prev[videoIndex].title),
          score: undefined,
          isProcessing: false,
        };
        return updated;
      });
    }
  } catch (err: any) {
    const errMsg = typeof err === 'string' ? err : err?.message || 'Unknown error';
    console.error('Error processing video:', errMsg);
    alert(`Something went wrong: ${errMsg}`);

    setVideos(prev => {
      const updated = [...prev];
      updated[videoIndex] = {
        id: String(prev[videoIndex].id),
        title: String(prev[videoIndex].title),
        score: undefined,
        isProcessing: false,
      };
      return updated;
    });
  }
};



  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center text-gray-400 p-4">
        {searchString ? 'No videos found. Try a different search term.' : 'Enter a search term to find videos.'}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map(video => (
        <div key={video.id}>
          <VideoCard
            videoId={video.id}
            title={video.title}
            score={video.score}
            isProcessing={video.isProcessing}
            onSelect={handleVideoSelect}
          />
        </div>
      ))}
    </div>
  );
}