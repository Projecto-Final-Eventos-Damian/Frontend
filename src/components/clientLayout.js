'use client';

import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import Navbar from './navbar';
import MobileMenu from './navbarMobile';
import { useState } from 'react';
import { useNavbarLogic } from '@/hook/useNavbarLogic';
import Image from 'next/image';
import Link from 'next/link';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const hideLayout = pathname === '/login';

  const [menuOpen, setMenuOpen] = useState(false);

  const { isAuthenticated, isLoading, user, handleLogout } = useNavbarLogic();

  if (isLoading) return null;

  return (
    <>
      {!hideLayout && (
        <>
          <header className="flex items-center justify-between border-b bg-white">
            <div className="flex items-center gap-3 m-3">
              <Link href="/" className="flex items-center gap-3">
                <div className="relative w-39 h-9 sm:w-49 sm:h-11">
                  <Image
                    src='/logo-text.png'
                    alt="EventMix"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="relative w-9 h-9 sm:w-11 sm:h-11">
                  <Image
                    src='/logo-icon.png'
                    alt="EventMix Icon"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>
            </div>
            <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
          </header>
          {menuOpen && (
            <MobileMenu
              isAuthenticated={isAuthenticated}
              user={user}
              handleLogout={handleLogout}
              setMenuOpen={setMenuOpen}
            />
          )}
        </>
      )}

      <main>{children}</main>

      {!hideLayout && (
        <footer className="p-4 text-center border-t text-sm text-gray-500">
          <p>&copy; 2025 EventMix. Todos los derechos reservados. Damián Tortosa 2ºDAW-B</p>
        </footer>
      )}

      <Toaster position="top-center" />
    </>
  );
}