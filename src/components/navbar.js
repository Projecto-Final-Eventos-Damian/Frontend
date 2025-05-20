'use client';

import Link from 'next/link';
import { useNavbarLogic } from '@/hook/useNavbarLogic';

export default function Navbar() {
  const {
    isAuthenticated,
    isLoading,
    user,
    dropdownOpen,
    toggleDropdown,
    closeDropdown,
    handleLogout,
  } = useNavbarLogic();

  if (isLoading) return null;

  return (
    <nav className="flex justify-between items-center px-6 py-4">
      <ul className="flex gap-5 items-center">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/create/events">Create Events</Link>
        </li>
        <li className="mr-5">
          <Link href="/dashboard">Dashboard</Link>
        </li>
      </ul>

      <div className="relative">
        {!isAuthenticated ? (
          <Link href="/login" className="text-blue-500 font-medium">
            Login
          </Link>
        ) : (
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 cursor-pointer bg-white border px-4 py-2 rounded shadow"
            >
              {user?.name || 'Usuario'}
              <svg
                className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded border z-10">
                <Link
                  href="/profile"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={closeDropdown}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
