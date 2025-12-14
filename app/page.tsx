'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import PostCard from '@/components/PostCard';
import { PostSkeleton } from '@/components/Skeleton';
import SuggestedUsers from '@/components/SuggestedUsers';

export default function Home() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));

    const fetchPosts = async () => {
      try {
        const res = await axios.get('/api/posts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(res.data);
      } catch (error) {
        console.error('Error fetching posts', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar />
      <main className="max-w-[470px] mx-auto pt-[90px] pb-10 px-4 md:px-0">
        
        {/* Suggested Users (Always visible if feed is empty, or at top) */}
        {/* Actually, let's show it if feed is empty OR just put it at the top/bottom */}
        {/* Since user complained about empty feed, let's prioritize it */}
        
        {loading ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : posts.length === 0 ? (
          <div className="space-y-6">
            <div className="text-center py-10 bg-white border border-[#dbdbdb] rounded-[3px]">
              <h2 className="text-xl font-light mb-2">Welcome to MiniGram!</h2>
              <p className="text-gray-500 mb-4">Follow people to see their posts here.</p>
            </div>
            <SuggestedUsers />
          </div>
        ) : (
          <>
             {posts.length < 3 && <SuggestedUsers />}
             
             {posts.map((post: any) => (
                <PostCard key={post._id} post={post} currentUserId={user?._id} />
             ))}
          </>
        )}
      </main>
    </div>
  );
}
