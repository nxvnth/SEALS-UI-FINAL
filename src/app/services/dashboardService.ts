'use server';

import dbConnect from '../lib/mongodb';
import { Video } from '@/app/models/Video';
import { IUser, User } from '@/app/models/User';

export async function getDashboardStats() {
  await dbConnect();

  const totalUsers = await User.countDocuments({});
  const recentSearchesRaw = await Video.find({})
    .sort({ updatedAt: -1 })
    .limit(10)
    .select('searchString')
    .lean();

  const recentSearches = [...new Set(recentSearchesRaw.map(v => v.searchString))];

  return {
    totalUsers,
    activeUsers: 7, // optionally calculate this later
    recentSearches,
  };
}

export async function getAllUsers() {
  await dbConnect();

  const users = await User.find<IUser>({})
    .sort({ createdAt: -1 })
    .lean(); // users is now IUser[]
  console.log('Fetched users:', users);
  return users.map((u) => ({
    id: u._id?.toString?.() || '',
    email: u.email,
    name: u.name || 'Unknown',
    createdAt: u.createdAt?.toISOString() || ''
  }));
}
