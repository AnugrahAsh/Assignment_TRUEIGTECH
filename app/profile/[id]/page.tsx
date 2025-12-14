'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { Settings, Grid, Bookmark, User as UserIcon } from 'lucide-react';
import Skeleton from '@/components/Skeleton';
import toast from 'react-hot-toast';

export default function Profile() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  
  const [profileUser, setProfileUser] = useState<any>(null);
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setCurrentUser(parsedUser);

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/api/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        setProfileUser(res.data.user);
        setPosts(res.data.posts);
        setIsFollowing(res.data.user.followers.includes(parsedUser._id));
      } catch (error) {
        console.error('Error fetching profile', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, router]);

  const handleFollow = async () => {
    // Optimistic update
    const prevIsFollowing = isFollowing;
    const prevFollowers = profileUser.followers;
    
    setIsFollowing(!isFollowing);
    setProfileUser((prev: any) => ({
      ...prev,
      followers: !isFollowing 
        ? [...prev.followers, currentUser._id]
        : prev.followers.filter((uid: string) => uid !== currentUser._id)
    }));

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `/api/users/${id}/follow`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Success - no action needed as we already updated optimistically
    } catch (error) {
      console.error('Error following user', error);
      toast.error('Something went wrong');
      // Revert
      setIsFollowing(prevIsFollowing);
      setProfileUser((prev: any) => ({
        ...prev,
        followers: prevFollowers
      }));
    }
  };

  if (loading) {
      return (
        <div className="min-h-screen bg-[#fafafa]">
            <Navbar />
            <main className="max-w-[935px] mx-auto pt-[90px] px-5">
                <div className="flex flex-col md:flex-row items-center md:items-start mb-10 md:pl-10">
                    <Skeleton className="w-[150px] h-[150px] rounded-full md:mr-20 mb-6 md:mb-0" />
                    <div className="flex-1 w-full">
                        <Skeleton className="h-8 w-48 mb-5" />
                        <div className="flex gap-10 mb-5">
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-6 w-20" />
                        </div>
                        <Skeleton className="h-6 w-64" />
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-1 md:gap-7">
                    {[1,2,3,4,5,6].map(i => (
                        <Skeleton key={i} className="w-full aspect-square" />
                    ))}
                </div>
            </main>
        </div>
      )
  }

  if (!profileUser) return <div className="text-center py-10">User not found</div>;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar />
      <main className="max-w-[935px] mx-auto pt-[90px] px-5">
        
        <header className="flex flex-col md:flex-row items-center md:items-start mb-10 md:pl-10">
          <div className="flex-shrink-0 md:mr-20 mb-6 md:mb-0">
             <div className="w-[150px] h-[150px] bg-gradient-to-tr from-yellow-400 to-purple-600 p-[2px] rounded-full">
                <div className="w-full h-full bg-white rounded-full p-[2px]">
                   <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-6xl font-bold text-gray-400">
                      {profileUser.username[0].toUpperCase()}
                   </div>
                </div>
             </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row items-center gap-4 mb-5">
              <h2 className="text-xl font-light">{profileUser.username}</h2>
              
              {currentUser._id === profileUser._id ? (
                <div className="flex gap-2">
                    <button className="px-4 py-1.5 bg-[#efefef] rounded-[4px] font-semibold text-sm hover:bg-gray-200 transition-colors">Edit profile</button>
                    <button className="px-4 py-1.5 bg-[#efefef] rounded-[4px] font-semibold text-sm hover:bg-gray-200 transition-colors">View archive</button>
                    <button className="p-1.5"><Settings className="w-6 h-6" /></button>
                </div>
              ) : (
                <div className="flex gap-2">
                    <button
                        onClick={handleFollow}
                        className={`px-6 py-1.5 rounded-[4px] font-semibold text-sm transition-colors ${
                        isFollowing
                            ? 'bg-[#efefef] text-black hover:bg-gray-200'
                            : 'bg-[#0095f6] text-white hover:bg-[#1877f2]'
                        }`}
                    >
                        {isFollowing ? 'Following' : 'Follow'}
                    </button>
                    <button className="px-4 py-1.5 bg-[#efefef] rounded-[4px] font-semibold text-sm hover:bg-gray-200 transition-colors">Message</button>
                </div>
              )}
            </div>

            <div className="flex justify-center md:justify-start gap-10 mb-5 text-base">
              <div><span className="font-semibold">{posts.length}</span> posts</div>
              <div><span className="font-semibold">{profileUser.followers.length}</span> followers</div>
              <div><span className="font-semibold">{profileUser.following.length}</span> following</div>
            </div>

            <div className="text-center md:text-left">
              <h1 className="font-semibold">{profileUser.username}</h1>
              <p className="whitespace-pre-wrap">Digital Creator 📸</p>
            </div>
          </div>
        </header>

        <div className="flex gap-10 mb-10 overflow-x-auto pb-4 md:pl-10 scrollbar-hide">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col items-center space-y-2 cursor-pointer">
                    <div className="w-[77px] h-[77px] rounded-full border border-gray-300 bg-gray-100 p-1">
                        <div className="w-full h-full bg-gray-200 rounded-full"></div>
                    </div>
                    <span className="text-xs font-semibold">Highlight</span>
                </div>
            ))}
        </div>

        <div className="border-t border-gray-300 flex justify-center gap-14 text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4">
            <div className="flex items-center gap-1 py-4 border-t border-black text-black -mt-[1px] cursor-pointer">
                <Grid className="w-3 h-3" /> Posts
            </div>
            <div className="flex items-center gap-1 py-4 cursor-pointer hover:text-gray-900 transition-colors">
                <Bookmark className="w-3 h-3" /> Saved
            </div>
            <div className="flex items-center gap-1 py-4 cursor-pointer hover:text-gray-900 transition-colors">
                <UserIcon className="w-3 h-3" /> Tagged
            </div>
        </div>

        <div className="grid grid-cols-3 gap-1 md:gap-7">
          {posts.map((post: any) => (
            <div key={post._id} className="relative aspect-square group cursor-pointer bg-black">
              <img 
                src={post.imageUrl} 
                alt={post.caption} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 hidden group-hover:flex items-center justify-center text-white font-bold gap-6">
                 <div className="flex items-center gap-1"><span className="text-xl">❤️</span> {post.likes.length}</div>
                 <div className="flex items-center gap-1"><span className="text-xl">💬</span> {post.comments.length}</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
