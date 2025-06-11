'use client';

import Link from 'next/link';
import { useNavbarLogic } from '@/hook/useNavbarLogic';
import { Menu } from '@headlessui/react';
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Navbar({ menuOpen, setMenuOpen }) {
  const {
    isAuthenticated,
    isLoading,
    user,
    handleLogout,
  } = useNavbarLogic();

  if (isLoading) return null;

  return (
    <nav className="flex justify-between items-center px-6 py-4">
      <ul className="hidden md:flex gap-5 items-center">
        <li>
          <Link href="/" className="hover:text-indigo-500 transition-colors duration-300">Home</Link>
        </li>
        <li>
          <Link href="/create/events" className="hover:text-indigo-500 transition-colors duration-300">Create Events</Link>
        </li>
        <li className="me-5">
          <Link href="/dashboard" className="hover:text-indigo-500 transition-colors duration-300">Dashboard</Link>
        </li>
      </ul>

      <div className="hidden md:block relative">
        {!isAuthenticated ? (
          <Link href="/login" className="text-indigo-500 font-medium">
            Login
          </Link>
        ) : (
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="flex items-center gap-2 cursor-pointer bg-white border px-4 py-2 rounded shadow font-medium hover:bg-indigo-100 duration-300">
              {user?.name}
              <ChevronDownIcon className="w-4 h-4" />
            </Menu.Button>

            <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-10">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/profile"
                      className={`transition-colors duration-300 block px-4 py-2 ${active ? 'bg-indigo-100' : ''} cursor-pointer`}
                    >
                      Profile
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={`transition-colors duration-300 block w-full text-left px-4 py-2 text-red-500 cursor-pointer ${active ? 'bg-indigo-100' : ''}`}
                    >
                      Logout
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Menu>
        )}
      </div>

      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden flex items-center p-2 rounded"
        aria-label="Toggle menu"
      >
        {menuOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <Bars3Icon className="w-6 h-6" />
        )}
      </button>
    </nav>
  );
}