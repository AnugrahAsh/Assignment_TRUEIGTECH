'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';
import Skeleton from '@/components/Skeleton';
import Link from 'next/link';

export default function PostDetail() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [commentText, setCommentText] = useState('');
  const [likes, setLikes] = useState<string[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setCurrentUser(JSON.parse(userData));

    const fetchPost = async () => {
      try {
        // We can reuse the single post fetch if we had one, or filter from feed (inefficient)
        // Or better, create a specific GET /api/posts/[id] route.
        // Since I didn't create a specific GET /api/posts/[id] in the plan, I'll add it now or use the existing list and filter?
        // No, filtering list is bad. I should add GET to `app/api/posts/[id]/route.ts` if it exists, or create it.
        // Wait, I have `app/api/posts/[id]/like/route.ts` and `comment/route.ts`.
        // I need `app/api/posts/[id]/route.ts` for GET.
        
        const res = await axios.get(`/api/posts/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setPost(res.data);
        setLikes(res.data.likes);
        setComments(res.data.comments);
        setIsLiked(res.data.likes.includes(JSON.parse(userData)._id));
      } catch (error) {
        console.error('Error fetching post', error);
        toast.error('Post not found');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, router]);

  const handleLike = async () => {
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikes(newIsLiked ? [...likes, currentUser._id] : likes.filter((uid) => uid !== currentUser._id));

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `/api/posts/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      setIsLiked(!newIsLiked);
      setLikes(likes);
      console.error('Error liking post', error);
      toast.error('Failed to like post');
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `/api/posts/${id}/comment`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(res.data.comments);
      setCommentText('');
      toast.success('Comment added');
    } catch (error) {
      console.error('Error commenting', error);
      toast.error('Failed to add comment');
    }
  };

  if (loading) {
      return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-black">
            <Navbar />
            <main className="max-w-[935px] mx-auto pt-[90px] px-4 flex justify-center">
                <Skeleton className="w-full h-[600px]" />
            </main>
        </div>
      );
  }

  if (!post) return <div className="text-center py-20">Post not found</div>;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-black text-black dark:text-white">
      <Navbar />
      <main className="max-w-[935px] mx-auto pt-[90px] px-4 pb-10">
        <div className="bg-white dark:bg-black border border-[#dbdbdb] dark:border-[#363636] rounded-[3px] flex flex-col md:flex-row overflow-hidden min-h-[450px] md:h-[600px]">
            
            {/* Image Section */}
            <div className="w-full md:w-[60%] bg-black flex items-center justify-center">
                <img 
                    src={post.imageUrl} 
                    alt={post.caption} 
                    className="max-w-full max-h-full object-contain"
                />
            </div>

            {/* Details Section */}
            <div className="w-full md:w-[40%] flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-[#dbdbdb] dark:border-[#363636] flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Link href={`/profile/${post.user._id}`}>
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-xs text-black">
                                {post.user.username[0].toUpperCase()}
                            </div>
                        </Link>
                        <Link href={`/profile/${post.user._id}`} className="font-semibold text-sm hover:opacity-70">
                            {post.user.username}
                        </Link>
                    </div>
                    <MoreHorizontal className="w-5 h-5" />
                </div>

                {/* Comments Scroll Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                    {/* Caption */}
                    <div className="flex space-x-3">
                        <Link href={`/profile/${post.user._id}`}>
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-xs text-black flex-shrink-0">
                                {post.user.username[0].toUpperCase()}
                            </div>
                        </Link>
                        <div className="text-sm">
                            <Link href={`/profile/${post.user._id}`} className="font-semibold mr-2 hover:opacity-70">
                                {post.user.username}
                            </Link>
                            <span>{post.caption}</span>
                            <div className="text-xs text-gray-500 mt-1">
                                {new Date(post.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    {/* Comments */}
                    {comments.map((comment: any, idx: number) => (
                        <div key={idx} className="flex space-x-3">
                            <Link href={`/profile/${comment.user._id}`}>
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-xs text-black flex-shrink-0">
                                    {comment.user.username[0].toUpperCase()}
                                </div>
                            </Link>
                            <div className="text-sm">
                                <Link href={`/profile/${comment.user._id}`} className="font-semibold mr-2 hover:opacity-70">
                                    {comment.user.username}
                                </Link>
                                <span>{comment.text}</span>
                                <div className="text-xs text-gray-500 mt-1">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="p-4 border-t border-[#dbdbdb] dark:border-[#363636]">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-4">
                            <button onClick={handleLike} className="hover:opacity-60 transition-opacity">
                                <Heart className={`w-7 h-7 ${isLiked ? 'fill-[#ed4956] text-[#ed4956]' : ''}`} />
                            </button>
                            <button className="hover:opacity-60 transition-opacity">
                                <MessageCircle className="w-7 h-7 -rotate-90" />
                            </button>
                            <button className="hover:opacity-60 transition-opacity">
                                <Send className="w-7 h-7" />
                            </button>
                        </div>
                        <button className="hover:opacity-60 transition-opacity">
                            <Bookmark className="w-7 h-7" />
                        </button>
                    </div>
                    <div className="font-semibold text-sm mb-2">
                        {likes.length} likes
                    </div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wide">
                        {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                    </div>
                </div>

                {/* Add Comment */}
                <form onSubmit={handleComment} className="border-t border-[#dbdbdb] dark:border-[#363636] p-3 flex items-center">
                    <button type="button" className="mr-3 hover:opacity-60">
                        <div className="w-6 h-6 text-gray-400">😊</div>
                    </button>
                    <input
                        type="text"
                        placeholder="Add a comment..."
                        className="flex-1 text-sm outline-none bg-transparent placeholder-gray-500"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={!commentText.trim()}
                        className="text-[#0095f6] font-semibold text-sm disabled:opacity-40 ml-2 hover:text-[#1877f2]"
                    >
                        Post
                    </button>
                </form>
            </div>
        </div>
      </main>
    </div>
  );
}
