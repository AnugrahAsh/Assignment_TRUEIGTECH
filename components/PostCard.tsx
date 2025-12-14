'use client';

import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';

interface PostProps {
  post: any;
  currentUserId: string;
}

export default function PostCard({ post, currentUserId }: PostProps) {
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState(post.comments);
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(post.likes.includes(currentUserId));
  const [lastClickTime, setLastClickTime] = useState(0);

  const handleLike = async () => {
    // Optimistic update
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikes(newIsLiked ? [...likes, currentUserId] : likes.filter((id: string) => id !== currentUserId));

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `/api/posts/${post._id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      // Revert on error
      setIsLiked(!newIsLiked);
      setLikes(likes);
      console.error('Error liking post', error);
      toast.error('Failed to like post');
    }
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastClickTime < 300) {
      if (!isLiked) handleLike();
    }
    setLastClickTime(now);
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `/api/posts/${post._id}/comment`,
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

  return (
    <div className="bg-white border border-[#dbdbdb] rounded-[3px] mb-4">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center space-x-3">
          <Link href={`/profile/${post.user._id}`} className="w-8 h-8 bg-gradient-to-tr from-yellow-400 to-purple-600 p-[2px] rounded-full">
             <div className="w-full h-full bg-white rounded-full p-[2px]">
                <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">
                    {post.user.username?.[0]?.toUpperCase()}
                </div>
             </div>
          </Link>
          <Link href={`/profile/${post.user._id}`} className="font-semibold text-sm hover:opacity-70 transition-opacity">
            {post.user.username}
          </Link>
        </div>
        <button className="hover:opacity-60 transition-opacity">
          <MoreHorizontal className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <Link href={`/posts/${post._id}`} className="block relative aspect-square w-full bg-black cursor-pointer" onClick={(e) => {
      }}>
        <img 
            src={post.imageUrl} 
            alt={post.caption} 
            className="w-full h-full object-contain"
            loading="lazy"
        />
      </Link>

      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <button onClick={handleLike} className="hover:opacity-60 transition-opacity transform active:scale-125 transition-transform duration-200">
              <Heart className={`w-7 h-7 ${isLiked ? 'fill-[#ed4956] text-[#ed4956]' : 'text-black'}`} />
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

        <div className="mb-2">
          <span className="font-semibold text-sm mr-2">{post.user.username}</span>
          <span className="text-sm">{post.caption}</span>
        </div>

        {comments.length > 0 && (
          <button className="text-gray-500 text-sm mb-2 hover:opacity-70 transition-opacity">
            View all {comments.length} comments
          </button>
        )}
        
        {comments.slice(-2).map((comment: any, idx: number) => (
          <div key={idx} className="text-sm mb-1">
            <span className="font-semibold mr-2">{comment.user.username}</span>
            <span>{comment.text}</span>
          </div>
        ))}

        <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-3 mt-2">
          {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
        </div>
      </div>

      <form onSubmit={handleComment} className="border-t border-[#dbdbdb] p-3 flex items-center">
        <button type="button" className="mr-3 hover:opacity-60 transition-opacity">
            <div className="w-6 h-6 text-gray-400">😊</div>
        </button>
        <input
          type="text"
          placeholder="Add a comment..."
          className="flex-1 text-sm outline-none placeholder-gray-500"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button
          type="submit"
          disabled={!commentText.trim()}
          className="text-[#0095f6] font-semibold text-sm disabled:opacity-40 ml-2 hover:text-[#1877f2] transition-colors"
        >
          Post
        </button>
      </form>
    </div>
  );
}
