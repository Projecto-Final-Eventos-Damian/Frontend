'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hook/authContext';

export default function Navbar() {
  const router = useRouter();
  const { isAuthenticated, isLoading, logout } = useAuth();

  const handleLogout = () => {
    router.push('/');
    logout();
  };

  if (isLoading) return null;

  return (
    <nav>
      <ul className="flex">
        <li className="py-4 px-6">
          <Link href="/">Home</Link>
        </li>
        <li className="py-4 px-6">
          <Link href="/createEvents">Create Events</Link>
        </li>
        <li className="py-4 px-6">
          <Link href="/dashboard">Dashboard</Link>
        </li>
        {isAuthenticated && (
          <li className="py-4 px-6">
            <Link href="/profile">Profile</Link>
          </li>
        )}
        <li className="py-4 px-6">
          {isAuthenticated ? (
            <button onClick={handleLogout} className="text-red-500 cursor-pointer">
              Logout
            </button>
          ) : (
            <Link href="/login" className="text-blue-500">
              Login
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
