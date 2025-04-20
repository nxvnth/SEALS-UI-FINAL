'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import apiService from '../services/apiService';

export default function WatchlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
        router.push('/auth/signin');
        return;
    }

    const fetch = async () => {
        const { getWatchlist } = await import('@/app/services/watchService');
        const result = await getWatchlist();
        setVideos(result);
        setLoading(false);
    };

    fetch();
    }, [status]);


  if (loading) return <p className="text-center text-gray-400 p-4">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Watchlist</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div key={video.videoId} className="bg-gray-800 p-4 rounded-lg">
            <img
              src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
              alt={video.title}
              className="w-full h-auto rounded"
            />
            <h2 className="text-white mt-2 font-semibold text-md">{video.title}</h2>
            <a
              href={`https://www.youtube.com/watch?v=${video.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline text-sm"
            >
              Open in YouTube →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
