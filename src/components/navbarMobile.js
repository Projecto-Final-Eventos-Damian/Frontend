'use client';

import Link from 'next/link';

export default function MobileMenu({ 
  isAuthenticated, 
  user, 
  handleLogout, 
  setMenuOpen 
}) {
  return (
    <div className="flex flex-col w-full bg-teal-200 border-b border-gray-300 md:hidden">
      {isAuthenticated && (
        <div className="p-4 border-b border-indigo-300 text-center font-semibold">
          {user?.name}
        </div>
      )}
      <Link
        href="/"
        onClick={() => setMenuOpen(false)}
        className="p-4 border-b border-indigo-300 block w-full text-center hover:bg-indigo-100 hover:text-indigo-700 duration-300"
      >
        Home
      </Link>
      <Link
        href="/create/events"
        onClick={() => setMenuOpen(false)}
        className="p-4 border-b border-indigo-300 block w-full text-center hover:bg-indigo-100 hover:text-indigo-700 duration-300"
      >
        Create Events
      </Link>
      <Link
        href="/dashboard"
        onClick={() => setMenuOpen(false)}
        className="p-4 border-b border-indigo-300 block w-full text-center hover:bg-indigo-100 hover:text-indigo-700 duration-300"
      >
        Dashboard
      </Link>

      {!isAuthenticated ? (
        <Link
          href="/login"
          onClick={() => setMenuOpen(false)}
          className="p-4 border-b border-indigo-300 block w-full text-center text-blue-500 font-medium hover:bg-indigo-100 duration-300"
        >
          Login
        </Link>
      ) : (
        <>
          <Link
            href="/profile"
            onClick={() => setMenuOpen(false)}
            className="p-4 border-b border-indigo-300 block w-full text-center hover:bg-indigo-100 hover:text-indigo-500 duration-300"
          >
            Profile
          </Link>
          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            className="p-4 border-b border-indigo-300 block w-full text-center text-red-500 font-medium hover:bg-indigo-100 cursor-pointer duration-300"
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
}