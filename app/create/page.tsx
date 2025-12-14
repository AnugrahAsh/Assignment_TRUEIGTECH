'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { Image as ImageIcon, Upload, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreatePost() {
  const router = useRouter();
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setImageUrl('');
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    setPreviewUrl(e.target.value);
    setFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !imageUrl) {
        toast.error('Please select an image or provide a URL');
        return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      } else {
        formData.append('imageUrl', imageUrl);
      }
      formData.append('caption', caption);

      await axios.post('/api/posts', formData, {
        headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        },
      });
      toast.success('Post created successfully');
      router.push('/');
    } catch (error) {
      console.error('Error creating post', error);
      toast.error('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-black text-black dark:text-white">
      <Navbar />
      <main className="max-w-[600px] mx-auto pt-[90px] px-4">
        <div className="bg-white dark:bg-black border border-[#dbdbdb] dark:border-[#363636] rounded-[3px] overflow-hidden">
          <div className="border-b border-[#dbdbdb] dark:border-[#363636] p-3 text-center font-semibold">
            Create new post
          </div>
          
          <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
             {!previewUrl ? (
                 <div className="text-center w-full max-w-sm">
                     <ImageIcon className="w-24 h-24 mx-auto text-gray-300 mb-4" />
                     <h3 className="text-xl font-light mb-6">Drag photos here</h3>
                     
                     <div className="space-y-4 flex flex-col items-center">
                        <label className="cursor-pointer bg-[#0095f6] text-white font-semibold py-1.5 px-4 rounded-[4px] hover:bg-[#1877f2] transition-colors flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            Select from computer
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </label>

                        <div className="flex items-center w-full my-2">
                            <div className="h-px bg-gray-300 flex-1"></div>
                            <span className="px-4 text-xs font-semibold text-gray-500 uppercase">OR</span>
                            <div className="h-px bg-gray-300 flex-1"></div>
                        </div>

                        <div className="w-full relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <LinkIcon className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="url"
                                placeholder="Paste Image URL"
                                className="w-full bg-[#fafafa] dark:bg-[#262626] border border-[#dbdbdb] dark:border-[#363636] rounded-[3px] pl-10 pr-2 py-[9px] text-sm focus:outline-none focus:border-gray-400 placeholder-gray-500"
                                value={imageUrl}
                                onChange={handleUrlChange}
                            />
                        </div>
                     </div>
                 </div>
             ) : (
                 <div className="w-full">
                     <div className="aspect-square bg-black mb-4 relative flex items-center justify-center">
                        <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                        <button 
                            onClick={() => {
                                setFile(null);
                                setImageUrl('');
                                setPreviewUrl('');
                            }}
                            className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 text-xs hover:bg-black/70 transition-colors"
                        >
                            Change
                        </button>
                     </div>
                     <textarea
                        className="w-full p-3 border-none focus:ring-0 resize-none text-sm bg-transparent dark:text-white placeholder-gray-500"
                        rows={4}
                        placeholder="Write a caption..."
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                     />
                     <div className="flex justify-end p-4 border-t dark:border-[#363636]">
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="text-[#0095f6] font-semibold hover:text-[#1877f2] disabled:opacity-50 transition-colors"
                        >
                            {loading ? 'Sharing...' : 'Share'}
                        </button>
                     </div>
                 </div>
             )}
          </div>
        </div>
      </main>
    </div>
  );
}
