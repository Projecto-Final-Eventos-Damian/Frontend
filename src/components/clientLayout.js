'use client';

import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import Navbar from './navbar';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const hideLayout = pathname === '/login';

  return (
    <>
      {!hideLayout && (
        <header className="flex items-center justify-between py-4 px-6 border-b">
          <h1 className="text-4xl font-bold">EventMix</h1>
          <Navbar />
        </header>
      )}
      <main>{children}</main>
      {!hideLayout && (
        <footer className="p-4 text-center border-t text-sm text-gray-500">
          <p>&copy; 2025 EventMix. Todos los derechos reservados.</p>
        </footer>
      )}
      <Toaster position="top-center" />
    </>
  );
}
