'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function SuggestedUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/users/suggested', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (error) {
        console.error('Error fetching suggestions', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  const handleFollow = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `/api/users/${userId}/follow`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Followed user');
      // Remove from list
      setUsers(users.filter((u: any) => u._id !== userId));
    } catch (error) {
      console.error('Error following user', error);
      toast.error('Failed to follow');
    }
  };

  if (loading) return <div className="p-4 text-center text-gray-500">Loading suggestions...</div>;
  if (users.length === 0) return null;

  return (
    <div className="bg-white border border-[#dbdbdb] rounded-[3px] p-4 mb-4">
      <h3 className="font-semibold text-gray-500 mb-4 text-sm">Suggestions for you</h3>
      <div className="space-y-3">
        {users.map((user: any) => (
          <div key={user._id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href={`/profile/${user._id}`}>
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-xs text-gray-500">
                  {user.username[0].toUpperCase()}
                </div>
              </Link>
              <div className="flex flex-col">
                <Link href={`/profile/${user._id}`} className="font-semibold text-sm hover:underline">
                  {user.username}
                </Link>
                <span className="text-xs text-gray-500">Suggested for you</span>
              </div>
            </div>
            <button
              onClick={() => handleFollow(user._id)}
              className="text-[#0095f6] text-xs font-bold hover:text-[#1877f2]"
            >
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
