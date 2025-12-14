'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/signup', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success('Account created successfully');
      router.push('/');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] p-4">
      <div className="w-full max-w-[350px] space-y-4">
        <div className="bg-white border border-[#dbdbdb] p-10 flex flex-col items-center rounded-[1px]">
          <h1 className="text-3xl font-bold mb-4 tracking-tight">MiniGram</h1>
          
          <p className="text-gray-500 font-semibold text-center mb-6">
            Sign up to see photos and videos from your friends.
          </p>

          <button className="w-full bg-[#0095f6] text-white font-semibold py-1.5 px-4 rounded-[4px] hover:bg-[#1877f2] disabled:opacity-50 transition-colors flex items-center justify-center gap-2 mb-4">
             <span>f</span> Log in with Facebook
          </button>

          <div className="flex items-center w-full mb-4">
            <div className="h-px bg-gray-300 flex-1"></div>
            <span className="px-4 text-xs font-semibold text-gray-500 uppercase">OR</span>
            <div className="h-px bg-gray-300 flex-1"></div>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-2">
            <input
              type="email"
              placeholder="Mobile Number or Email"
              required
              className="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] px-2 py-[9px] text-sm focus:outline-none focus:border-gray-400 placeholder-gray-500"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <input
              type="text"
              placeholder="Username"
              required
              className="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] px-2 py-[9px] text-sm focus:outline-none focus:border-gray-400 placeholder-gray-500"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] px-2 py-[9px] text-sm focus:outline-none focus:border-gray-400 placeholder-gray-500"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            
            <p className="text-xs text-gray-500 text-center my-4">
                People who use our service may have uploaded your contact information to Instagram. <a href="#" className="font-semibold">Learn More</a>
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0095f6] text-white font-semibold py-1.5 px-4 rounded-[4px] hover:bg-[#1877f2] disabled:opacity-50 transition-colors"
            >
              {loading ? 'Signing up...' : 'Sign up'}
            </button>
          </form>
        </div>

        <div className="bg-white border border-[#dbdbdb] p-5 text-center rounded-[1px]">
          <p className="text-sm">
            Have an account? <Link href="/login" className="text-[#0095f6] font-semibold hover:opacity-70 transition-opacity">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
