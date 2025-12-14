'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Home, PlusSquare, User, LogOut, Search, Heart } from 'lucide-react';


export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!mounted || !user) return null;

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 w-full bg-white dark:bg-black border-b border-[#dbdbdb] dark:border-[#363636] z-50 h-[60px] flex items-center transition-colors">
      <div className="max-w-[975px] w-full mx-auto px-5 flex items-center justify-between">
        <Link href="/" className="flex-shrink-0">
           <h1 className="text-xl font-bold tracking-tight text-black dark:text-white">MiniGram</h1>
        </Link>

        <div className="hidden md:block w-[268px]">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-[#efefef] dark:bg-[#262626] rounded-lg pl-10 pr-4 py-1.5 focus:outline-none text-sm font-light text-black dark:text-white placeholder-gray-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-6 text-black dark:text-white">
          <Link href="/">
            {isActive('/') ? <Home className="w-7 h-7 fill-black dark:fill-white" /> : <Home className="w-7 h-7" />}
          </Link>
          
          <Link href="/create">
            {isActive('/create') ? <PlusSquare className="w-7 h-7 fill-black dark:fill-white" /> : <PlusSquare className="w-7 h-7" />}
          </Link>

          <button>
            <Heart className="w-7 h-7" />
          </button>

          <Link href={`/profile/${user._id}`}>
             <div className={`w-7 h-7 rounded-full border ${isActive(`/profile/${user._id}`) ? 'border-black border-2 dark:border-white' : 'border-gray-200'} overflow-hidden`}>
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs font-bold text-black">
                    {user.username?.[0]?.toUpperCase()}
                </div>
             </div>
          </Link>
          


          <button onClick={handleLogout} className="text-black dark:text-white hover:opacity-60">
            <LogOut className="w-7 h-7" />
          </button>
        </div>
      </div>
    </nav>
  );
}
