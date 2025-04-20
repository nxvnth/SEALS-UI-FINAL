'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getAllUsers, getDashboardStats } from '@/app/services/dashboardService';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeUsers, setActiveUsers] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [userList, setUserList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }

    if (status === 'authenticated') {
      setIsLoading(true);

      (async () => {
        try {
          const stats = await getDashboardStats();
          const users = await getAllUsers();
          console.log('Dashboard stats:', stats);
          console.log('All users:', users);

          setTotalUsers(stats.totalUsers);
          setActiveUsers(stats.activeUsers); // hardcoded for now
          setRecentSearches(stats.recentSearches);
          setUserList(users);
        } catch (err) {
          console.error('Failed to load dashboard:', err);
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [status]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="bg-gray-700 px-4 py-2 rounded-lg">
          <p className="text-sm">Signed in as: <span className="font-semibold">{session?.user?.email}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Active Users" value={activeUsers} color="text-blue-400" />
        <StatCard title="Total Users" value={totalUsers} color="text-green-400" />
        <RecentSearchesCard searches={recentSearches} />
      </div>

      <UserTable users={userList} />
    </div>
  );
}

function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className={`text-4xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function RecentSearchesCard({ searches }: { searches: string[] }) {
  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg col-span-1 md:col-span-2 lg:col-span-1">
      <h2 className="text-xl font-semibold mb-2">Recent Searches</h2>
      <ul className="space-y-2 mt-4">
        {searches.map((search, idx) => (
          <li key={idx} className="text-gray-300">{search}</li>
        ))}
      </ul>
    </div>
  );
}

function UserTable({ users }: { users: any[] }) {
  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">User Management</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Created At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{user.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
