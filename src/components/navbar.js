'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/services/authContext.js';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();
  const [isAuth, setIsAuth] = useState(isAuthenticated);

  useEffect(() => {
    setIsAuth(isAuthenticated);
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav>
      <ul className="flex">
        <li className="py-4 px-6">
          <Link href="/">Home</Link>
        </li>
        <li className="py-4 px-6">
          <Link href="/about">About</Link>
        </li>
        <li className="py-4 px-6">
          <Link href="/dashboard">Dashboard</Link>
        </li>
        {isAuthenticated && (
          <li className="py-4 px-6">
            <Link href="/profile">Profile</Link>
          </li>
        )}
        {isAuthenticated && (
          <li className="py-4 px-6">
            <button onClick={handleLogout} className="text-red-500 cursor-pointer">
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
