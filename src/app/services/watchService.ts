'use server';

import dbConnect from '../lib/mongodb';
import { IUser, User } from '@/app/models/User';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/options';

interface LeanWatchlistUser {
  watchlist?: {
    videoId: string;
    title: string;
    watchedAt: Date;
  }[];
}


export async function addToWatchlist(videoId: string, title: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error('Not authenticated');

  await dbConnect();
  await User.findOneAndUpdate(
    { email: session.user.email },
    {
      $addToSet: {
        watchlist: {
          videoId,
          title,
          watchedAt: new Date()
        }
      }
    },
    { new: true, upsert: true }
  );
}

export async function getWatchlist() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error('Not authenticated');

  await dbConnect();
  const user = await User.findOne({ email: session.user.email }).lean() as LeanWatchlistUser;
  return (user?.watchlist ?? []).map(({ videoId, title, watchedAt }) => ({
    videoId,
    title,
    watchedAt: watchedAt.toISOString?.() || new Date().toISOString()
    }));
}